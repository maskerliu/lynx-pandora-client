
export interface BizBridge4Web {
  init(): void
  show(msg: string): void
  setStatusBarColor(color: string): void
  scan(): void
  fileSelect(type: number, maxSize: number): void
}

type LocalFunction = { func: Function, thiz?: any }

export interface BizBridge4App {

  methods: Map<string, LocalFunction>

  back(): void

  initEnv(toke: string, ua: string, did: string): void

  onCallback(method: string, ...args: any): void

  register(func: Function, thiz?: any): void

  unRegister(func: string): void

}