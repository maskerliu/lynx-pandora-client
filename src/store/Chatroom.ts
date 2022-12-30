import { defineStore } from 'pinia'
import msgClient from '../common/PahoMsgClient'
import { Chatroom } from '../models'
import { ChatroomApi } from '../models/chatroom.api'

export type ChatroomState = {
  gifts: Array<Chatroom.Gift>
  curRoom: Chatroom.Room
  effects: Array<Chatroom.Message>
  messages: Array<Chatroom.Message>
}

export interface ChatroomAction {
  enterRoom(roomId: string): Promise<void>
  leaveRoom(): Promise<void>
  reward(giftId: string, count: number, receivers: Array<string>): Promise<void>
  sendMessage(content: string, type: Chatroom.MsgType): Promise<void>
  onMessageArrived(msgs: Chatroom.Message[]): Promise<void>
}

export const useChatroomStore = defineStore<string, ChatroomState, {}, ChatroomAction>('Chatroom', {
  state: () => {
    return {
      gifts: [],
      curRoom: null,
      effects: [],
      messages: [],
    }
  },
  actions: {
    async enterRoom(roomId: string) {
      this.curRoom = await ChatroomApi.enter(roomId)
      if (this.gifts.length == 0) {
        this.gifts = await ChatroomApi.gifts()
      }
      if (!msgClient.subscribe(`_room/${this.curRoom._id}`)) {
        this.curRoom = null
        throw 'cant subscribe room'
      }

      this.mockMessages()
    },
    async leaveRoom() {
      try {
        // await ChatroomApi.leave(this.curRoom._id)
      } catch (err) {

      }

      this.curRoom = null
      this.messages = []
      this.effects = []
    },
    async sendMessage(content: string, type: Chatroom.MsgType) {
      let msg: Chatroom.Message = {
        type,
        data: { content } as Chatroom.ChatContent
      }
      await ChatroomApi.sendMsg(this.curRoom._id, msg)
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
    async onMessageArrived(msgs: Chatroom.Message[]) {
      msgs.forEach(it => {
        switch (it.type) {
          case Chatroom.MsgType.Enter:
            break
          case Chatroom.MsgType.Reward:
            this.effects.push(it)
            // this.messages.push()
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
      this.messages = []
      this.messages.push({
        from: 'string',
        type: Chatroom.MsgType.Sys,
        data: { content: `💗欢迎(*｀∀´*)ノ走进久违播客\n💗锁定ノ 久违播客 💗 唤醒你内心的悸动` } as Chatroom.SysInfoContent
      })

      this.messages.push({
        from: '8f4e7438-4285-4268-910c-3898fb8d6d96',
        type: Chatroom.MsgType.ChatText,
        data: { content: `hello world` }
      })

      this.messages.push({
        from: 'string',
        type: Chatroom.MsgType.Sys,
        data: { content: `<span style="font-size: 0.8rem; font-style: italic; color: #8e44ad;"> 章三 </span> 向 <span style="font-size: 0.8rem; font-style: italic; color: #e67e22;"> 里斯 </span> 赠送了 <span style="font-size: 1rem; font-style: italic; font-weight: bold; color: #f39c12;"> 1 </span> 个 <span>棒棒糖</span>` } as Chatroom.SysInfoContent
      })
    }
  }
})