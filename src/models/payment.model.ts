import { Common } from "."

export namespace Payment {

  export interface PayChannel extends Common.DBDoc {
    name: string
    icon: string
    color: string
  }

  export interface PurchaseItem extends Common.DBDoc {
    name: string
    discount: string
  }
}