import { Common } from "./common.model"


export namespace IOT {
  export const TOPICS = {
    Topic_Android: 'my/test/android',
    Topic_NodeRed: 'my/test/nodered',
    Topic_Web: 'my/test/web',
    Topic_Electron: 'my/test/electron'
  }

  export enum DeviceStatus {
    Online,
    Offline
  }

  export enum CompanyStatus {
    Verifing = 1, // 认证中
    Verified = 2, //通过认证
    WrittenOff = 3, // 注销
  }

  export interface Device extends Common.DBDoc {
    deviceId?: string,
    status?: DeviceStatus,
    address?: string,
    lat?: number,
    lng?: number,
    cid?: string // company id
  }

  export interface Company extends Common.DBDoc {
    status?: CompanyStatus
    name?: string,
    address?: string,
    owner?: string,
    ownerName?: string,
    tel?: string,
    privileges?: Array<Privilege>
    roles?: Array<Role>
  }

  export interface Operator extends Common.DBDoc {
    uid?: string // user id
    name?: string
    cid?: string
    roles?: Array<string>
  }

  export interface Role extends Common.DBDoc {
    name?: string
    desc?: string
    cid?: string // company id
    privileges?: Array<string>
  }

  export interface Privilege {
    id: string
    name: string
  }

  export interface IOTMsg {
    from: string,
    type: MsgType
    data?: MonitorSnap
  }

  export interface MonitorSnap {
    temperature: number,
    humidity: number,
    speed: number,
    voltage: number,
    electric: number,
    pressure: number,
    timestamp: number
  }

  export enum MsgType {
    DATA = 0, // 数据
    REGISTER = 1, // 注册
    REBOOT = 2, // 重启
    KICKOUT = 3, // 踢出链接,
    TMP_SUBSCRIBED = 4, // 临时订阅
    TMP_UNSUBSCRIBED = 5, // 取消临时订阅
  }

}
