import { IOT } from '.'
import { RemoteAPI } from './api.const'
import { get, post } from './base.api'

export namespace IOTApi {

  export function searchDevices(keyword: string) {
    return get<Array<IOT.Device>>(RemoteAPI.IOT.BasePath + RemoteAPI.IOT.DeviceSearch, { keyword })
  }

  export function deviceInfo(deviceId: string) {
    return get<IOT.Device>(RemoteAPI.IOT.BasePath + RemoteAPI.IOT.DeviceInfo, { deviceId })
  }

  export function updateDevice(device: IOT.Device) {
    return post<string>(RemoteAPI.IOT.BasePath + RemoteAPI.IOT.DeviceSave, device)
  }

  export function removeDevice(deviceId: string) {
    return post<string>(RemoteAPI.IOT.BasePath + RemoteAPI.IOT.DeviceDelete, { deviceId })
  }

  export function bindDevice() {

  }
}

