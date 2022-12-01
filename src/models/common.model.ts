

export namespace Common {

  export interface DBDoc {
    _id?: string
  }

  export interface AppConfig {
    broker: string
  }

  export interface DBInfo {
    name: string
    path?: string
    size: number
  }
}