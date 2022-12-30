import { stringify } from 'querystring'
import { Chatroom, User } from '.'
import { RemoteAPI } from './api.const'
import { formPost, get, post } from './base.api'

export namespace ChatroomApi {

  export function saveRoom(room: Chatroom.Room, cover?: File) {
    let roomInfo = Object.assign({}, room)
    delete roomInfo.displayMasters
    let data = new FormData()
    data.append('room', JSON.stringify(roomInfo))
    if (cover) data.append('cover', cover)
    return formPost<string>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.RoomSave, data)
  }

  export function myRooms() {
    return get<Array<Chatroom.Room>>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.MyRooms)
  }

  export function myCollections() {
    return get<Array<Chatroom.Room>>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.MyCollections)
  }

  export function recommends() {
    return get<Array<Chatroom.Room>>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.Recommend)
  }


  export function roomInfo(roomId: string) {
    return get<Chatroom.Room>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.Enter, { roomId })
  }

  export function collect(roomId: string) {
    return get<string>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.Collect, { roomId })
  }

  export function seatRequests(roomId: string) {
    return get<Array<Chatroom.SeatReq & User.Profile>>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.SeatRequests, { roomId })
  }

  export function seatOpt(roomId: string, seq: number, code: Chatroom.MsgType) {
    return post<string>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.SeatReq, { roomId, seq, code })
  }

  export function seatMgr(roomId: string, uid: string, seq: number, code: Chatroom.MsgType) {
    return post<string>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.SeatMgr, { roomId, uid, seq, code })
  }

  export function gifts() {
    return get<Array<Chatroom.Gift>>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.Gifts)
  }

  export function emojis() {
    return get<Array<Chatroom.EmojiGroup>>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.Emojis)
  }

  export function enter(roomId: string) {
    return post<Chatroom.Room>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.Enter, { roomId })
  }

  export function leave(roomId: string) {
    return get<string>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.Leave, { roomId })
  }

  export function reward(roomId: string, giftId: string, count: number, receivers: string[]) {
    return post<string>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.Reward, { roomId, giftId, count, receivers })
  }

  export function sendMsg(roomId: string, msg: Chatroom.Message) {
    return post<string>(RemoteAPI.Chatroom.BasePath + RemoteAPI.Chatroom.SendMsg, msg, { roomId })
  }
}