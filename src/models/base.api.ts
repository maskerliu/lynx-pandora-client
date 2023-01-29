import axios from 'axios'
import { BizCode, BizResponse } from '.'


axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
axios.defaults.headers.common = {
  'X-UA': 'mapi/1.0(Electron 12;com.github.lynxchina.argusIOT 1.0.1;macbook pro:V2171A;offical)',
  'X-Network': 'wifi'
}

let clientUID: string = null
let accessToken: string = null
let BASE_DOMAIN: string = null

async function request<T>(method: string, url: string, baseURL?: string, headers?: any, params?: {}, data?: any) {
  let reqOpt = {
    baseURL: baseURL ? baseURL : BASE_DOMAIN,
    url, method, params, data,
  }

  axios.defaults.headers.common['X-Token'] = accessToken
  axios.defaults.headers.common['X-DID'] = clientUID

  if (headers !== null) {
    reqOpt['headers'] = Object.assign(headers, axios.defaults.headers.common)
  }
  const resp = await axios.request<BizResponse<T>>(reqOpt)

  let bizResp = resp.data
  switch (bizResp.code) {
    case BizCode.SUCCESS:
      return bizResp.data
    case BizCode.ERROR:
      // Notify({ message: bizResp.msg, type: "danger" })
      throw bizResp.msg
    default:
      throw bizResp
  }
}

export async function get<T>(path: string, params?: {}, baseURL?: string,) {
  return request<T>('GET', path, baseURL, null, params)
}

export async function post<T>(path: string, data?: any, params?: {}, baseURL?: string,) {
  return request<T>('POST', path, baseURL, { 'Content-Type': 'application/json' }, params, data)
}

export async function formPost<T>(path: string, data?: FormData, params?: {}, baseURL?: string,) {
  return request<T>('POST', path, baseURL, { 'Content-Type': 'multipart/form-data' }, params, data)
}


export function updateClientUID(uid: string) {
  clientUID = uid
}

export function updateAccessToken(token: string) {
  accessToken = token
}

export function updateBaseDomain(domain: string) {
  BASE_DOMAIN = domain
}


