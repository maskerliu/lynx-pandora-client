import { defineStore } from 'pinia'
import { IOT } from '../models/iot.model'

export type IOTState = {
  curDeviceId?: string
  xAxisLabel: Array<any>,
  temperature: number,
  humidityData: Array<any>,
  speedData: Array<any>,
  electricData: Array<any>,
  voltageData: Array<any>,
}

export type IOTAction = {
  updateDevice(deviceId: string): void
  updateDeviceData(deviceId: string, msg: IOT.MonitorSnap): void
}

export const useIOTStore = defineStore<string, IOTState, {}, IOTAction>('IOT', {
  state: () => {
    return {
      xAxisLabel: [],
      temperature: 0,
      humidityData: [],
      speedData: [],
      electricData: [],
      voltageData: [],
      curDeviceId: null
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
    }
  }
})