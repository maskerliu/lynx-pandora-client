import { get } from './base.api'
import { Channel } from '.'
import { RemoteAPI } from './api.const'

export namespace ChannelApi {

  export function getChannels() {
    return get<Array<Channel.Channel>>(RemoteAPI.ChatRoom.BasePath + RemoteAPI.ChatRoom)
  }


}

export namespace ChatRoomApi {
  export function recommends() {
    return get<Array<Channel.Room>>(RemoteAPI.ChatRoom.BasePath + RemoteAPI.ChatRoom.Recommend)
  }
}