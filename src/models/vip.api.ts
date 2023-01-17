import { VIP } from '.'
import { RemoteAPI } from './api.const'
import { get, post } from './base.api'

export namespace VIPApi {
  export function config() {
    return get<Array<VIP.VIPItem>>(RemoteAPI.VIP.BasePath + RemoteAPI.VIP.Config)
  }

  export function myVIP() {
    return get<VIP.VIPOrder>(RemoteAPI.VIP.BasePath + RemoteAPI.VIP.MyVIP)
  }

  export function buy(vipId: string) {
    return post<VIP.VIPOrder>(RemoteAPI.VIP.BasePath + RemoteAPI.VIP.Buy, null, { vipId })
  }
}