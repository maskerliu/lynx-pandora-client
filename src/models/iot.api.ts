import { get, post } from './base.api'
import { IOT } from './iot.model'


export function searchDevices(keyword: string) {
  return get<Array<IOT.Device>>('/iot/search', null, { keyword })
}

export function deviceInfo(deviceId: string) {
  return get<IOT.Device>('/iot/deviceInfo', null, { deviceId })
}

export function updateDevice(device: IOT.Device) {
  return post<string>('/iot/updateInfo', null, null, device)
}

export function removeDevice(deviceId: string) {
  return post<string>('/iot/removeDevice', null, { deviceId })
}

export function bindDevice() {

}

export function saveCompany(company: IOT.Company) {
  return post<string>('/iot/company/save', null, null, )
}

