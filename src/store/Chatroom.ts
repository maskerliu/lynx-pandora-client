import { count } from 'console'
import { defineStore } from 'pinia'
import msgClient from '../common/PahoMsgClient'
import { Chatroom, User } from '../models'
import { ChatroomApi } from '../models/chatroom.api'

export type ChatroomState = {
  // gifts: Array<Chatroom.Gift>
  normalGifts: Array<Chatroom.Gift>
  vipGifts: Array<Chatroom.Gift>
  curRoom: Chatroom.Room
  effects: Array<Chatroom.Message>
  enterMsgs: Array<Chatroom.Message>
  messages: Array<Chatroom.Message>
}

export interface ChatroomAction {
  isMaster(uid: string): boolean
  isOnSeat(uid: string): boolean
  gifts(type: Chatroom.GiftType): Array<Chatroom.Gift>
  giftEffect(giftId: string): string
  getVIPGifts(): Promise<void>
  enterRoom(roomId: string): Promise<void>
  leaveRoom(): Promise<void>
  reward(giftId: string, count: number, receivers: Array<string>): Promise<void>
  sendMessage(content: string, type: Chatroom.MsgType, userInfo: User.Profile & Chatroom.UserPropInfo): Promise<void>
  seatOnReq(seatInfo: Chatroom.Seat, uid: string): Promise<void>
  seatDown(seatInfo: Chatroom.Seat, uid: string, myUid?: string): Promise<void>
  mute(seatInfo: Chatroom.Seat): Promise<void>
  lock(seatInfo: Chatroom.Seat): Promise<void>
  allowSeatOn(uid: string, seq: number): Promise<void>
  onMessageArrived(msgs: Chatroom.Message[]): Promise<void>
  mockMessages(): void
}

export const useChatroomStore = defineStore<string, ChatroomState, {}, ChatroomAction>('Chatroom', {
  state: () => {
    return {
      normalGifts: [],
      vipGifts: [],
      curRoom: null,
      effects: [],
      enterMsgs: [],
      messages: [],
    }
  },
  actions: {
    isMaster(uid: string) {
      return this.curRoom?.masters.includes(uid) || this.curRoom?.owner == uid
    },
    isOnSeat(uid: string) {
      return this.curRoom.seats.find((it: Chatroom.Seat) => { return it.userInfo?.uid == uid }) != null
    },
    gifts(type: Chatroom.GiftType) {
      return type == Chatroom.GiftType.Normal ? this.normalGifts : this.vipGifts
    },
    giftEffect(giftId: string) {
      let effect = this.normalGifts.find((it: Chatroom.Gift) => { return it._id == giftId })?.effect
      if (effect == null) {
        effect = this.vipGifts.find((it: Chatroom.Gift) => { return it._id == giftId })?.effect
      }
      return effect
    },
    async getNormalGifts() {
      if (this.normalGifts.length == 0) {
        this.normalGifts = await ChatroomApi.gifts(this.curRoom._id, Chatroom.GiftType.Normal)
      }
    },
    async getVIPGifts() {
      if (this.vipGifts.length == 0) {
        this.vipGifts = await ChatroomApi.gifts(this.curRoom._id, Chatroom.GiftType.VIP)
      }
    },
    async enterRoom(roomId: string) {
      if (!msgClient.subscribe(`_room/${roomId}`)) {
        this.curRoom = null
        throw 'cant subscribe room'
      }

      this.curRoom = await ChatroomApi.enter(roomId)

      await this.getNormalGifts()

      this.messages = []
      if (this.curRoom.welcome != null) {
        this.messages.push({
          from: 'sys',
          type: Chatroom.MsgType.Sys,
          content: this.curRoom.welcome
        })
      }
    },
    async leaveRoom() {
      await ChatroomApi.leave(this.curRoom._id)

      this.curRoom = null
      this.messages = []
      this.effects = []
    },
    async sendMessage(content: string, type: Chatroom.MsgType, userInfo: User.Profile & Chatroom.UserPropInfo) {
      await ChatroomApi.sendMsg(this.curRoom._id, { type, content, userInfo })
    },
    async reward(giftId: string, count: number, receivers: Array<string>) {
      // let messages = receivers.map(it => {
      //   return {
      //     type: Chatroom.MsgType.Reward,
      //     from: '',
      //     content: { to: it, giftId, count }
      //   } as Chatroom.Message
      // })
      // 本地视角，优先播放用户打赏特效
      await ChatroomApi.reward(this.curRoom._id, giftId, count, receivers)
    },
    async seatOnReq(seatInfo: Chatroom.Seat, uid: string) {
      if (this.isMaster(uid)) { // 有权限直接上麦
        await ChatroomApi.seatMgr(this.curRoom._id, uid, seatInfo.seq, Chatroom.MsgType.SeatOn)
      } else { // 发送上麦请求
        await ChatroomApi.seatReq(this.curRoom._id, seatInfo.seq, Chatroom.MsgType.SeatOnReq)
      }
    },
    async seatDown(seatInfo: Chatroom.Seat, uid: string) {
      if (uid == seatInfo.userInfo.uid) {
        await ChatroomApi.seatReq(this.curRoom._id, seatInfo.seq, Chatroom.MsgType.SeatDown)
      } else if (this.isMaster(uid)) {
        await ChatroomApi.seatMgr(this.curRoom._id, seatInfo.userInfo.uid, seatInfo.seq, Chatroom.MsgType.SeatDown)
      }
    },
    async mute(seatInfo: Chatroom.Seat) {
      await ChatroomApi.seatMgr(this.curRoom._id, null, seatInfo.seq, seatInfo.isMute ? Chatroom.MsgType.SeatUnmute : Chatroom.MsgType.SeatMute)
    },
    async lock(seatInfo: Chatroom.Seat) {
      await ChatroomApi.seatMgr(this.curRoom._id, null, seatInfo.seq, seatInfo.isLocked ? Chatroom.MsgType.SeatUnlock : Chatroom.MsgType.SeatLock)
    },
    async allowSeatOn(uid: string, seq: number) {
      await ChatroomApi.seatMgr(this.curRoom._id, uid, seq, Chatroom.MsgType.SeatOn)
    },
    async onMessageArrived(msgs: Chatroom.Message[]) {
      // TODO 加强校验，topic's room id is same with current room id
      msgs.forEach(it => {
        switch (it.type) {
          case Chatroom.MsgType.SeatLock:
          case Chatroom.MsgType.SeatUnlock: {
            let isLock = it.type == Chatroom.MsgType.SeatLock
            let seq = it.seq
            this.curRoom.seats.find((item: Chatroom.Seat) => { return item.seq == seq }).isLocked = isLock
            break
          }

          case Chatroom.MsgType.SeatMute:
          case Chatroom.MsgType.SeatUnmute: {
            let isMute = it.type == Chatroom.MsgType.SeatMute
            this.curRoom.seats.find((item: Chatroom.Seat) => { return item.seq == it.seq }).isMute = isMute
            break
          }

          case Chatroom.MsgType.SeatOn: {
            this.curRoom.seats.find((seat: Chatroom.Seat) => { return it.seq == seat.seq }).userInfo = it.userInfo
            break
          }
          case Chatroom.MsgType.SeatDown: {
            if (this.curRoom) {
              this.curRoom.seats.find((seat: Chatroom.Seat) => { return it.seq == seat.seq }).userInfo = null
            }
            break
          }
          case Chatroom.MsgType.Enter:
            this.enterMsgs.push(it)
            break
          case Chatroom.MsgType.Reward:
            this.effects.push(it)
            break
          case Chatroom.MsgType.ChatText:
          case Chatroom.MsgType.ChatEmoji:
          case Chatroom.MsgType.Sys:
            this.messages.push(it)
            break
        }
      })
    },
    mockMessages() {
      let sysMsg: Chatroom.Message = {
        type: Chatroom.MsgType.Sys,
        content: `<span style="font-size: 0.8rem; font-style: italic; color: #8e44ad;"> 章三 </span> 向 <span style="font-size: 0.8rem; font-style: italic; color: #e67e22;"> 里斯 </span> 赠送了 <span style="font-size: 1rem; font-style: italic; font-weight: bold; color: #f39c12;"> 1 </span> 个 <span>棒棒糖</span>`
      }

      let rewardMsg: Chatroom.Message = {
        type: Chatroom.MsgType.Reward,
        giftId: this.gifts[Math.ceil(Math.random() * (this.gifts.length - 1))]._id,
        count: 1
      }

      let chatTxtMsg: Chatroom.Message = {
        type: Chatroom.MsgType.ChatText,
        userInfo: {
          uid: 'f947ed55-7e34-4a82-a9db-8a9cf6f2e608',
          name: '刘大毛',
          avatar: "/_res/a9032c164574a174aa854dc91c3d8913.jpg",
          msgFrame: '/_res/8d04d0e0df2c484e84da11b667725074.png'
        },
        content: `所以${Math.random()}--${new Date()}`
      }

      let chatEmojiMsg: Chatroom.Message = {
        type: Chatroom.MsgType.ChatEmoji,
        userInfo: {
          uid: 'f947ed55-7e34-4a82-a9db-8a9cf6f2e608',
          name: '刘大毛',
          avatar: "/_res/a9032c164574a174aa854dc91c3d8913.jpg",
          msgFrame: '/_res/8d04d0e0df2c484e84da11b667725074.png'
        },
        content: '/_res/70c942c4f14e4669b0a844e24517a451.gif'
      }

      let enterMsg: Chatroom.Message = {
        type: Chatroom.MsgType.Enter,
        userInfo: {
          uid: 'f947ed55-7e34-4a82-a9db-8a9cf6f2e608',
          name: '刘大毛',
          avatar: "/_res/a9032c164574a174aa854dc91c3d8913.jpg",
          enterEffect: '/_res/4fd9f7e7c4774ca7ad8f8f058909d022.png'
        }
      }

      let mockMsgs = []

      let sysCount = Math.random() * 5 + 1
      let rewardCount = Math.random() * 5 + 1
      let chatTxtCount = Math.random() * 5 + 1
      let chatEmojiCount = Math.random() * 5 + 1
      let enterCount = Math.random() * 5 + 1

      for (let i = 0; i < sysCount; ++i) {
        mockMsgs.push(sysMsg)
      }
      for (let i = 0; i < rewardCount; ++i) {
        mockMsgs.push(rewardMsg)
      }
      for (let i = 0; i < chatTxtCount; ++i) {
        mockMsgs.push(chatTxtMsg)
      }
      for (let i = 0; i < chatEmojiCount; ++i) {
        mockMsgs.push(chatEmojiMsg)
      }
      for (let i = 0; i < enterCount; ++i) {
        mockMsgs.push(enterMsg)
      }

      this.onMessageArrived(mockMsgs)
    }
  }
})