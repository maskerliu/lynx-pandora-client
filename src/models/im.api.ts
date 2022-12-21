import { IM } from '.'
import { RemoteAPI } from './api.const'
import { formPost, get, post } from './base.api'

export namespace IMApi {

  export function syncFrom(sid: string) {
    return get<IM.Session>(RemoteAPI.IM.BasePath + RemoteAPI.IM.SyncFrom, { sid })
  }

  export function bulkSyncFrom(sids: Array<string>) {
    return post<Array<IM.Session>>(RemoteAPI.IM.BasePath + RemoteAPI.IM.BulkSyncFrom, sids)
  }

  export async function syncTo(session: IM.Session, thumb?: File) {
    let obj = Object.assign({}, session)
    delete obj._id
    delete obj._rev
    delete obj.pinned

    if (obj.type == IM.SessionType.P2P) {
      delete obj.title
      delete obj.thumb
    }

    let data = new FormData()
    data.append('session', JSON.stringify(obj))
    if (thumb) data.append('thumb', thumb)
    return formPost<IM.Session>(RemoteAPI.IM.BasePath + RemoteAPI.IM.SyncTo, data)
  }

  export function sendMsg(message: IM.Message, file?: File) {
    let data = new FormData()
    data.append('message', JSON.stringify(message))
    if (file) data.append('file', file)
    return formPost<string>(RemoteAPI.IM.BasePath + RemoteAPI.IM.SendMsg, data)
  }

  export function syncOfflineMessages() {
    return get<Array<IM.Message>>(RemoteAPI.IM.BasePath + RemoteAPI.IM.GetOfflineMessages)
  }
}