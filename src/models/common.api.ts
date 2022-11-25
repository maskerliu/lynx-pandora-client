import { RemoteAPI } from './api.const'
import { formPost, get, post } from './base.api'
import { Common } from './common.model'
import { User } from './user.model'

export namespace CommonApi {

  export function getAppConfig() {
    return get<Array<Common.AppConfig>>('/common/appConfig')
  }

  export function login(phone: string, verifyCode: string) {
    let formData = new FormData()
    formData.append('phone', phone)
    formData.append('verifyCode', verifyCode)
    return formPost<string>(RemoteAPI.User.BasePath + RemoteAPI.User.Login, formData)
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
}
