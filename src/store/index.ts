

import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import MsgClient from '../common/MsgClient'
import PahoMsgClient from '../common/PahoMsgClient'
import { updateBaseDomain } from '../models/base.api'
import { LocalServerConfig } from '../models/base.models'
import { getAppConfig } from '../models/common.api'
import { Common } from '../models/common.models'
import { IOT } from '../models/iot.model'

let msgClient: MsgClient = null

export const useCommonStore = defineStore('Common', {
  state: () => {
    return {
      navbar: null,
      needLogin: false,
      appConfig: {} as Common.AppConfig,
      locale: null,
    }
  },
  actions: {
    async init() {
      if (__DEV__ || !__IS_WEB__) { // dev mode 
        updateBaseDomain(SERVER_BASE_URL)
      }

      if (this.locale == null) {
        this.locale = useI18n().locale.value
      } else {
        useI18n().locale.value = this.locale
      }

      try {
        this.appConfig = await getAppConfig()
        msgClient = new PahoMsgClient(this.appConfig.broker)
      } catch (err) {
        console.error(err)
      }
    },
    async saveLocalServerConfig(config: LocalServerConfig) {
      let newConfig: LocalServerConfig = Object.assign(this.serverConfig, config)
      delete newConfig.ip
      delete newConfig.port
      delete newConfig.ips
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
        paths: ['locale']
      },
    ],
  }
})