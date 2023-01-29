import { Common, User } from '.'
import { RemoteAPI } from './api.const'
import { formPost, get, post } from './base.api'

export namespace CommonApi {

  export function getAppConfig() {
    return get<Array<Common.AppConfig>>(RemoteAPI.Common.BasePath + RemoteAPI.Common.AppConfig)
  }

  export function getAllDBs() {
    return get<any>(RemoteAPI.Common.BasePath + RemoteAPI.Common.DBMgrDBs)
  }

  export function getAllDocs(db: string) {
    return get<any>(RemoteAPI.Common.BasePath + RemoteAPI.Common.DBMgrDBDocs, { db })
  }

  export function updateDoc(doc: any) {
    return post<any>(RemoteAPI.Common.BasePath + RemoteAPI.Common.DBMgrDBs, doc)
  }

  export function deleteDoc(doc: any) {
    return post<any>(RemoteAPI.Common.BasePath + RemoteAPI.Common.DBMgrDBs, doc)
  }
}
