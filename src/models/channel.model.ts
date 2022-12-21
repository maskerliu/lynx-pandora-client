import { Common, User } from '.'

export namespace Channel {


  export enum RoomTypeEnum {
    DianTai,
    JiaoYou,
    YuLe,
  }
  export interface RoomType {
    [RoomTypeEnum.DianTai]: {
      type: 1,
      desc: '电台'
    }

    [RoomTypeEnum.JiaoYou]: {
      type: 2,
      desc: '交友'
    }
    [RoomTypeEnum.YuLe]: {
      type: 3,
      desc: '娱乐'
    }
  }


  export interface Channel {

  }

  export interface RoomTag extends Common.DBDoc {
    title: string
  }

  export interface Room extends Common.DBDoc {
    title?: string
    cover?: string
    owner?: string
    notice?: string
    type?: RoomType[RoomTypeEnum]
    tags?: Array<string>
    imgHeight?: number
  }

  export enum SeatType {
    Admin, // 房主
    Master, // 管理
    Guest, // 嘉宾
  }

  export interface Seat extends Common.DBDoc {
    seq: number // 麦序
    type: SeatType
    isMute: boolean // 是否闭麦
    isLocked: boolean
    userInfo?: User.Profile
  }

  export interface Gift extends Common.DBDoc {
    title: string
    snap: string
    effect?: string
    priceDesc: string
  }

}