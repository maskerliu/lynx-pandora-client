import { formPost, get, post } from './base.api'
import { Common } from './common.model'

export function getAppConfig() {
  return get<Array<Common.AppConfig>>('/common/appConfig')
}

export function login(formData: FormData) {
  return formPost<string>('/user/login', null, null, formData)
}

