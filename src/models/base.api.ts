import axios from 'axios'
import { BizCode, BizResponse } from './base.model'

import { Notify } from 'vant'

axios.defaults.timeout = 10000
axios.defaults.withCredentials = true
axios.defaults.headers.common = {
  'X-Token': 'dddd',
  'X-UA': 'mapi/1.0(Electron 12;com.github.lynxchina.app-api-proxy 1.0.1;macbook pro:V2171A;offical)',
  'X-DID': '........./..../....',
  'X-Network': 'wifi'
}

let clientUID: string = null
let BASE_DOMAIN: string = null

async function request<T>(method: string, path: string, baseURL?: string, headers?: any, params?: {}, data?: any) {
  let reqOpt = {
    baseURL: baseURL ? baseURL : BASE_DOMAIN,
    url: path,
    method: method,
    params: Object.assign({ uid: clientUID }, params),
    data: data,
  }

  if (headers !== null) {
    reqOpt['headers'] = Object.assign(headers, axios.defaults.headers.common)
  }
  const resp = await axios.request<BizResponse<T>>(reqOpt)

  let bizResp = resp.data
  switch (bizResp.code) {
    case BizCode.SUCCESS:
      return bizResp.data
    case BizCode.FAIL:
      Notify({ message: bizResp.msg, type: "warning" })
      return Promise.reject(bizResp.msg)
    case BizCode.ERROR:
      Notify({ message: bizResp.msg, type: "danger" })
      return Promise.reject(bizResp.msg)
    default:
      break
  }
}

export async function get<T>(path: string, baseURL?: string, params?: {}) {
  return request<T>('GET', path, baseURL, null, params)
}

export async function post<T>(path: string, baseURL?: string, params?: {}, data?: any) {
  return request<T>('POST', path, baseURL, { 'Content-Type': 'application/json' }, params, data)
}

export async function formPost<T>(path: string, baseURL?: string, params?: {}, data?: FormData) {
  return request<T>('POST', path, baseURL, { 'Content-Type': 'multipart/form-data' }, params, data)
}


export function updateClientUID(uid: string) {
  clientUID = uid
}

export function updateBaseDomain(domain: string) {
  BASE_DOMAIN = domain
}
