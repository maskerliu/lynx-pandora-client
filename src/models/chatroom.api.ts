import { Chatroom } from '.'
import { RemoteAPI } from './api.const'
import { get, post } from './base.api'

export namespace ChatroomApi {

  export function myCollections() {
    return get<Array<Chatroom.Room>>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.MyCollections)
  }

  export function recommends() {
    return get<Array<Chatroom.Room>>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.Recommend)
  }


  export function roomInfo(rid: string) {
    return get<Chatroom.Room>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.Enter, { rid })
  }

  export function gifts() {
    return get<Array<Chatroom.Gift>>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.Gifts)
  }

  export function enter(roomId: string) {
    return post<Chatroom.Room>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.Enter, { roomId })
  }

  export function reward(roomId: string, giftId: string, count: number, receivers: string[]) {
    return post<string>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.Reward, { roomId, giftId, count, receivers })
  }
}