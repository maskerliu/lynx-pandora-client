import { Common, User } from '.'
import { RemoteAPI } from './api.const'
import { formPost, get, post } from './base.api'

export namespace CommonApi {

  export function getAppConfig() {
    return get<Array<Common.AppConfig>>(RemoteAPI.Common.BasePath + RemoteAPI.Common.AppConfig)
  }

  export function login(phone: string, verifyCode: string) {
    let data = new FormData()
    data.append('phone', phone)
    data.append('verifyCode', verifyCode)
    return formPost<string>(RemoteAPI.User.BasePath + RemoteAPI.User.Login, data)
  }

  export function getMyProfile() {
    return get<User.Profile>(RemoteAPI.User.BasePath + RemoteAPI.User.ProfileMyself)
  }


  export function uploadAvatar(avatar: File) {
    let data = new FormData()
    data.append('avatar', avatar)
    return formPost(RemoteAPI.User.BasePath + RemoteAPI.User.ProfileAvatar, data)
  }

  export function saveProfile(profile: User.Profile & User.Account) {
    let data = new FormData()
    data.append('profile', JSON.stringify(profile))
    return formPost<string>(RemoteAPI.User.BasePath + RemoteAPI.User.ProfileSave, data,)
  }

  export function getUserProfile(uid: string) {
    return get<User.Profile>(RemoteAPI.User.BasePath + RemoteAPI.User.ProfileInfo, { uid })
  }

  export function searchUser(phone: string) {
    let data = new FormData()
    data.append('phone', phone)
    return formPost<User.Profile>(RemoteAPI.User.BasePath + RemoteAPI.User.ProfileSearch, data)
  }

  export function getContact(page?: number) {
    return get<Array<User.Profile & User.Account>>(RemoteAPI.User.BasePath + RemoteAPI.User.Contact, { page })
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
