

import { defineStore } from 'pinia'
import { NavBarProps } from 'vant'
import PahoMsgClient from '../common/PahoMsgClient'
import { Common, CommonApi, IOT, IOTApi, updateAccessToken, updateBaseDomain, User } from '../models'

export let msgClient: PahoMsgClient = null

export type CommonState = {
  navbar: NavBarProps,
  rightAction: Function,
  needLogin: boolean,
  appConfig: Common.AppConfig,
  locale: string,
  accessToken?: string,
  profile?: User.Account & User.Profile,
  operator?: IOT.Operator,
  company?: IOT.Company,
  sharePrefs: SharePref,
  forword?: any,
}

export type CommonAction = {
  init(): Promise<void>
  updateUserInfo(): Promise<void>
  logout(): Promise<void>
  rebootDevice(deviceId: string): void
  deviceTmpSubscribe(deviceId: string): void
  deviceTmpUnsubscribe(deviceId: string): void
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
      needLogin: false,
      appConfig: {} as Common.AppConfig,
      locale: null,
      accessToken: null,
      profile: null,
      operator: null,
      company: {},
      sharePrefs: {} as SharePref,
      forword: null,
    }
  },
  actions: {
    async init() {
      updateBaseDomain(SERVER_BASE_URL)
      this.updateUserInfo()
    },
    async updateUserInfo() {
      if (this.accessToken == null) return

      updateAccessToken(this.accessToken)
      this.profile = await CommonApi.getMyProfile()
      this.appConfig = await CommonApi.getAppConfig()
      if (msgClient && msgClient.isConnected()) { msgClient.close() }
      msgClient = new PahoMsgClient()
      this.operator = await IOTApi.getMyOperatorInfo()
      if (this.operator) {
        this.company = await IOTApi.getCompany(this.operator.cid)
      }
    },
    async logout() {
      this.accessToken = null
      this.profile = {}
      this.operator = {}
      this.company = {}
      msgClient.close()
    },
    publishMessage(message: string) {
      // here just mock a device to send a fake monitor data for test
      let deviceId = 'lynx-iot-nodered-00003'
      let monitorSnap: IOT.MonitorSnap = {
        temperature: Number.parseFloat((Math.random() * 60).toFixed(2)),
        humidity: Number.parseFloat(Math.random().toFixed(2)),
        speed: Number.parseInt((Math.random() * 5000).toFixed(1)),
        voltage: Number.parseInt((Math.random() * 220).toFixed(0)),
        electric: Number.parseFloat((Math.random() * 5).toFixed(1)),
        pressure: Number.parseFloat((Math.random() * 10).toFixed(1)),
        timestamp: new Date().getTime()
      }

      let msg: IOT.IOTMsg = {
        from: deviceId,
        type: IOT.MsgType.DATA,
        data: monitorSnap
      }
      msgClient.sendMsg(deviceId, msg)
    },
    rebootDevice(deviceId: string) {
      msgClient.sendMsg(deviceId, {
        from: 'my/test/electron',
        type: IOT.MsgType.REBOOT
      })
    },
    deviceTmpSubscribe(deviceId: string) {
      msgClient.subscribe(deviceId)
      msgClient.sendMsg(deviceId, {
        from: 'my/test/electron',
        type: IOT.MsgType.TMP_SUBSCRIBED
      })
    },
    deviceTmpUnsubscribe(deviceId: string) {
      msgClient.unsubscribe(deviceId)
      msgClient.sendMsg(deviceId, {
        from: 'my/test/electron',
        type: IOT.MsgType.TMP_UNSUBSCRIBED
      })
    }
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