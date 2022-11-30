

import { defineStore } from 'pinia'
import { NavBarProps } from 'vant'
import { useI18n } from 'vue-i18n'
import MsgClient from '../common/MsgClient'
import PahoMsgClient from '../common/PahoMsgClient'
import { Common, CommonApi, IOT, IOTApi, updateAccessToken, updateBaseDomain, User } from '../models'

let msgClient: MsgClient = null

export type SharePref = {
  sound: boolean,
  vibrate: boolean
}
// const i18n = useI18n()

export const useCommonStore = defineStore('Common', {
  state: () => {
    return {
      navbar: {} as NavBarProps,
      needLogin: false,
      appConfig: {} as Common.AppConfig,
      locale: null,
      accessToken: null,
      profile: {} as User.Account & User.Profile,
      operator: {} as IOT.Operator,
      company: {} as IOT.Company,
      sharePrefs: {} as SharePref
    }
  },
  actions: {
    async init() {
      updateBaseDomain(SERVER_BASE_URL)
      
      this.updateUserInfo()

      if (this.locale == null) {
        this.locale = useI18n().locale.value
      } else {
        useI18n().locale.value = this.locale
      }

      try {
        this.appConfig = await CommonApi.getAppConfig()
        msgClient = new PahoMsgClient(this.appConfig.broker)
      } catch (err) {
        console.error(err)
      }
    },
    async updateUserInfo() {
      this.needLogin = this.accessToken == null
      if (this.needLogin) return

      updateAccessToken(this.accessToken)
      this.profile = await CommonApi.getMyProfile()
      this.operator = await IOTApi.getMyOperatorInfo()
      if (this.operator) this.company = await IOTApi.getCompany(this.operator.cid)
    },
    async logout() {
      this.accessToken = null
      this.profile = {}
      this.operator = {}
      this.company = {}
    },
    async updateCompanyInfo() {
      this.company = await IOTApi.getCompany(this.operator.cid)
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