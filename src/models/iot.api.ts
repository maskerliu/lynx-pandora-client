import { formPost, get, post } from './base.api'
import { IOT } from './iot.model'

import { RemoteAPI } from './api.const'

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

  export function getCompany(cid: string) {
    return get<IOT.Company>(RemoteAPI.IOT.BasePath + RemoteAPI.IOT.CompanyInfo, { cid },)
  }

  export function saveCompany(company: IOT.Company) {
    return post<string>(RemoteAPI.IOT.BasePath + RemoteAPI.IOT.CompanySave, company)
  }

  export function getRoles(cid: string) {
    return get<Array<IOT.Role>>(RemoteAPI.IOT.BasePath + RemoteAPI.IOT.RoleAll, { cid },)
  }

  export function saveRole(role: IOT.Role) {
    return post<string>(RemoteAPI.IOT.BasePath + RemoteAPI.IOT.RoleSave, role)
  }

  export function deleteRole(rid: string) {
    let data = new FormData()
    data.append('rid', rid)
    return formPost<string>(RemoteAPI.IOT.BasePath + RemoteAPI.IOT.RoleDelete, data)
  }

  export function getOperators(cid: string) {
    return get<Array<IOT.Operator>>(RemoteAPI.IOT.BasePath + RemoteAPI.IOT.OperatorAll, { cid })
  }

  export function getMyOperatorInfo() {
    return get<Array<IOT.Operator>>(RemoteAPI.IOT.BasePath + RemoteAPI.IOT.OperatorMyself)
  }

  export function saveOperator(operator: IOT.Operator) {
    return post<string>(RemoteAPI.IOT.BasePath + RemoteAPI.IOT.OperatorSave, operator)
  }

  export function removeOperator(opId: string) {
    return post<string>(RemoteAPI.IOT.BasePath + RemoteAPI.IOT.OperatorDelete, null, { opId })
  }
}

