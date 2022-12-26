import { defineStore } from 'pinia'
import msgClient from '../common/PahoMsgClient'
import { IOT } from '../models/iot.model'

export type IOTState = {
  curDeviceId?: string,
  needUpdate: number,
  xAxisLabel: Array<any>,
  temperature: number,
  humidityData: Array<any>,
  speedData: Array<any>,
  electricData: Array<any>,
  voltageData: Array<any>,
}

export type IOTAction = {
  onDataArrived(deviceId: string, msg: IOT.IOTMsg): void
  updateDevice(deviceId: string): void
  subscribe(deviceId: string): void
  unsubscribe(deviceId: string): void
  rebootDevice(deviceId: string): void
}

const Topic_CMD = '_iot/cmd/'
const Topic_Data = '_iot/data/'

export const useIOTStore = defineStore<string, IOTState, {}, IOTAction>('IOT', {
  state: () => {
    return {
      curDeviceId: null,
      curSubDevice: null,
      needUpdate: 0,
      xAxisLabel: [],
      temperature: 0,
      humidityData: [],
      speedData: [],
      electricData: [],
      voltageData: [],
    }
  },
  actions: {
    updateDevice(deviceId: string) {
      if (this.curDeviceId !== deviceId) {
        this.temperature = 0
        this.humidityData = []
        this.speedData = []
        this.xAxisLabel = []
        this.electricData = []
        this.voltageData = []
        this.curDeviceId = deviceId
      }
    },
    onDataArrived(deviceId: string, msg: IOT.IOTMsg) {
      switch (msg.type) {
        case IOT.MsgType.DATA:
          this.updateDeviceData(deviceId, msg.data)
          break
        case IOT.MsgType.REBOOT:
          break
      }
    },
    updateDeviceData(deviceId: string, msg: IOT.MonitorSnap) {
      this.temperature = msg.temperature
      let now = new Date(msg.timestamp)
      if (this.xAxisLabel.length > 30) {
        this.xAxisLabel.shift()
        this.voltageData.shift()
        this.electricData.shift()
        this.humidityData.shift()
      }

      this.xAxisLabel.push([now.getSeconds()].join(':'))
      this.humidityData.push(msg.humidity)
      this.voltageData.push(msg.voltage)
      this.electricData.push(msg.electric)

      this.needUpdate++
    },
    subscribe(deviceId: string) {
      if (!msgClient.isConnected()) { return }
      if (this.curSubDevice != null && this.curSubDevice != deviceId) {
        this.unsubscribe(this.curSubDevice)
      }

      msgClient.send(`${Topic_CMD}${deviceId}`, JSON.stringify({
        from: msgClient.client.clientId,
        type: IOT.MsgType.TMP_SUBSCRIBED,
      }))
      msgClient.subscribe(`${Topic_Data}${deviceId}`)
      this.curSubDevice = deviceId
    },
    unsubscribe(deviceId: string) {
      msgClient.send(`${Topic_CMD}${deviceId}`, JSON.stringify({
        from: msgClient.client.clientId,
        type: IOT.MsgType.TMP_UNSUBSCRIBED,
      }))
      msgClient.unsubscribe(`${Topic_Data}${deviceId}`)
      this.curSubDevice = null
    },
    rebootDevice(deviceId: string) {
      msgClient.send(`${Topic_CMD}${deviceId}`, JSON.stringify({
        from: msgClient.client.clientId,
        type: IOT.MsgType.REBOOT
      }))
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
      msgClient.send(deviceId, JSON.stringify(msg))
    },
  }
})