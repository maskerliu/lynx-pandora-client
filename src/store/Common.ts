

import { defineStore } from 'pinia'
import { NavBarProps } from 'vant'
import { default as msgClient } from '../common/PahoMsgClient'
import { Chatroom, ChatroomApi, Common, CommonApi, IOT, IOTApi, Payment, updateAccessToken, updateBaseDomain, User } from '../models'
import { PaymentApi } from '../models/payment.api'

export type CommonState = {
  navbar: NavBarProps,
  rightAction: Function,
  navbarBg?: string,
  navbarColor?: string,
  needLogin: boolean,
  appConfig?: Common.AppConfig,
  locale: string,
  accessToken?: string,
  profile?: User.Account & User.Profile & Chatroom.UserPropInfo,
  wallet?: Payment.Wallet,
  operator?: IOT.Operator,
  company?: IOT.Company,
  sharePrefs: SharePref,
  forword?: any,
}

export type CommonAction = {
  init(): Promise<void>
  updateUserInfo(): Promise<void>
  updateMyWallet(): Promise<void>
  updateMyProps(orders: Array<Chatroom.PropOrder>): void
  logout(): Promise<void>
}

export type SharePref = {
  sound: boolean,
  vibrate: boolean
}

export const useCommonStore = defineStore<string, CommonState, {}, CommonAction>('Common', {
  state: () => {
    return {
      navbar: {} as NavBarProps,
      rightAction: null,
      navbarBg: null,
      navbarColor: null,
      needLogin: false,
      appConfig: null as Common.AppConfig,
      locale: null,
      accessToken: null,
      profile: null,
      wallet: null,
      operator: null,
      company: null,
      sharePrefs: {} as SharePref,
      forword: null,
    }
  },
  actions: {
    async init() {
      updateBaseDomain(SERVER_BASE_URL)
      this.appConfig = await CommonApi.getAppConfig()

      if (this.accessToken == null) {
        this.needLogin = true
        return
      }
      updateAccessToken(this.accessToken)
      await this.updateUserInfo()
    },
    async updateUserInfo() {
      updateAccessToken(this.accessToken)
      this.profile = await CommonApi.getMyProfile()
      this.wallet = await PaymentApi.myWallet()
      this.operator = await IOTApi.getMyOperatorInfo()
      if (this.operator) {
        this.company = await IOTApi.getCompany(this.operator.cid)
      }

      let propOrders = await ChatroomApi.myProps()
      let dressupOrders: Array<Chatroom.PropOrder> = []
      propOrders.forEach(group => {
        group.orders.forEach(it => {
          if (it.status == Chatroom.PropOrderStatus.On)
            dressupOrders.push(it)
        })
      })
      this.updateMyProps(dressupOrders)
    },
    async updateMyWallet() {
      this.wallet = await PaymentApi.myWallet()
    },
    updateMyProps(orders: Array<Chatroom.PropOrder>) {
      this.props = orders

      orders.forEach(order => {
        switch (order.prop.type) {
          case Chatroom.PropType.EnterEffect:
            this.profile.enterEffect = order.status == Chatroom.PropOrderStatus.On ? order.prop.snap : null
            break
          case Chatroom.PropType.MsgFrame:
            this.profile.msgFrame = order.status == Chatroom.PropOrderStatus.On ? order.prop.effect : null
            break
          case Chatroom.PropType.SeatFrame:
            this.profile.seatFrame = order.status == Chatroom.PropOrderStatus.On ? order.prop.snap : null
            break
        }
      })
    },
    async logout() {
      this.accessToken = null
      this.profile = {}
      this.operator = {}
      this.company = {}
      msgClient.close()
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'common',
        storage: localStorage,
        paths: ['locale', 'accessToken', 'sharePrefs']
      },
    ],
  }
})