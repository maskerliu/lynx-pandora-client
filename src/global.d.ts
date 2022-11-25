import { BizBridge4App, BizBridge4Web } from "./common/Bridges"

export interface IElectronAPI {
  openFile: (...args: any) => Promise<void>,
  openGame: (...args: any) => Promise<void>
}


declare global {
  let __DEV__: boolean
  let __VUE_OPTIONS_API__: boolean

  interface Window {
    electronAPI: IElectronAPI
    argus: BizBridge4Web
    webApp: BizBridge4App
  }

  let __IS_WEB__: boolean
  let PROTOCOL: string
  let SERVER_BASE_URL: string

  let AMapUI: any
}

declare module 'vue-router' {
  interface RouteMeta {
    navBar?: boolean
    tabBar?: boolean
    needAuth?: boolean
  }
}