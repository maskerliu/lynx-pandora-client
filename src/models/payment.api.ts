import { Payment } from '.'
import { RemoteAPI } from './api.const'
import { get, post } from './base.api'

type PurchaseConfig = {
  channels: Array<Payment.PayChannel>
  purchases: Array<Payment.PurchaseItem>
}

export namespace PaymentApi {
  export function myWallet() {
    return get<Payment.Wallet>(RemoteAPI.Payment.BasePath + RemoteAPI.Payment.MyWallet)
  }

  export function rechargeConfig() {
    return get<PurchaseConfig>(RemoteAPI.Payment.BasePath + RemoteAPI.Payment.RechargeConfig)
  }

  export function recharge(purchaseId: string, channel: string) {
    return post<Payment.Wallet>(RemoteAPI.Payment.BasePath + RemoteAPI.Payment.Recharge, { purchaseId, channel })
  }

  export function exchangeConfig() {
    return get<PurchaseConfig>(RemoteAPI.Payment.BasePath + RemoteAPI.Payment.ExchangeConfig)
  }

  export function exchange(purchaseId: string) {
    return post<Payment.Wallet>(RemoteAPI.Payment.BasePath + RemoteAPI.Payment.Exchange, { purchaseId })
  }

  export function purseRecords(page: number) {
    return get<Array<Payment.PurseRecord>>(RemoteAPI.Payment.BasePath + RemoteAPI.Payment.PurseRecords, { page })
  }
}