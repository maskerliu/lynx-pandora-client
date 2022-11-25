
export interface BizBridge4Web {
  show(msg: string): void
  setStatusBarColor(color: string): void
}

export interface BizBridge4App {
  
  back(): void

  initEnv(toke: string, ua: string, did: string): void

}