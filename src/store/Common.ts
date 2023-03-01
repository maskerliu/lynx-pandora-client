

import { defineStore } from 'pinia'
import { NavBarProps } from 'vant'
import { default as msgClient } from '../common/PahoMsgClient'
import {
  Chatroom, ChatroomApi,
  Common, CommonApi,
  Organization, OrganizationApi,
  Payment, PaymentApi,
  updateAccessToken, updateBaseDomain,
  User, UserApi
} from '../models'

export type CommonState = {
  navbar: NavBarProps,
  rightAction: Function,
  navbarBg?: string,
  navbarColor?: string,
  needLogin: boolean,
  appConfig?: Common.AppConfig,
  locale: string,
  accessToken?: string,
  profile?: User.Account & User.Profile & User.UserVIPInfo & User.UserGradeInfo & Chatroom.UserPropInfo,
  wallet?: Payment.Wallet,
  operator?: Organization.Operator,
  company?: Organization.Company,
  sharePrefs: SharePref,
  forword?: any,
  showPurchase: boolean,
}

export type CommonAction = {
  init(token?: string): Promise<void>
  updateUserInfo(): Promise<void>
  updateMyWallet(): Promise<void>
  updateMyProps(orders: Array<Chatroom.PropOrder>): void
  updateMyVIP(order?: User.VIPOrder): void
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
      showPurchase: false,
    }
  },
  actions: {
    async init(token?: string) {
      updateBaseDomain(SERVER_BASE_URL)

      if (token) {
        this.accessToken = token 
      }
      if (this.accessToken == null) {
        this.needLogin = true
        return
      }
      updateAccessToken(this.accessToken)

      this.appConfig = await CommonApi.getAppConfig()
      await this.updateUserInfo()
    },
    async updateUserInfo() {
      this.profile = await UserApi.userProfile()
      await this.updateMyWallet()

      try {
        let vip = await UserApi.myVIP()
        this.updateMyVIP(vip)
      } catch (err) {
        console.log(err)
      }

      try {
        this.operator = await OrganizationApi.operatorInfo()
        if (this.operator) {
          this.company = await OrganizationApi.getCompany(this.operator.cid)
        }
      } catch (err) {
        console.log(err)
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
      orders.forEach(order => {
        switch (order.prop.type) {
          case Chatroom.PropType.EnterEffect:
            this.profile.enterEffect = order.prop.snap
            break
          case Chatroom.PropType.MsgFrame:
            this.profile.msgFrame = order.prop.effect
            break
          case Chatroom.PropType.SeatFrame:
            this.profile.seatFrame = order.prop.snap
            break
        }
      })
    },
    updateMyVIP(order: User.VIPOrder) {
      let vipInfo: User.UserVIPInfo = {
        vipType: order.type,
        vipId: order.vipId,
        vipExpired: order.expired
      }
      this.profile = Object.assign(this.profile, vipInfo)
    },
    async updateMyGrade() {
      let grade = await UserApi.userGradeInfo()
      this.profile = Object.assign(this.profile, grade)
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