import { defineStore } from 'pinia'
import msgClient from '../common/PahoMsgClient'
import { Chatroom } from '../models'
import { ChatroomApi } from '../models/chatroom.api'

export type ChatroomState = {
  curRoom: Chatroom.Room
  effects: Array<string>
  messages: Array<Chatroom.Message>
}

export interface ChatroomAction {
  enterRoom(roomId: string): Promise<void>
  reward(giftId: string, count: number, receivers: Array<string>): Promise<void>
  messages(): Promise<Array<Chatroom.Message>>
  onMessageArrived(msgs: Chatroom.Message[]): Promise<void>
}

export const useChatroomStore = defineStore<string, ChatroomState, {}, ChatroomAction>('Chatroom', {
  state: () => {
    return {
      curRoom: null,
      effects: [],
      messages: [],
    }
  },
  actions: {
    async enterRoom(roomId: string) {
      this.curRoom = await ChatroomApi.enter(roomId)
      msgClient.client.subscribe(`_room/${this.curRoom._id}`)
    },
    async messages() {
      return null
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
      console.log(msgs)

      msgs.forEach(it => {
        switch (it.type) {
          case Chatroom.MsgType.Enter:
            break
          case Chatroom.MsgType.Reward:
            this.effects.push()
            this.messages
            break
          case Chatroom.MsgType.ChatText:
          case Chatroom.MsgType.ChatEmoji:
            this.messages.push(it)
            break
        }
      })
    }
  }
})