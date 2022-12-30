import Paho from 'paho-mqtt'
import { Store } from 'pinia'
import { Chatroom, IM, IOT } from '../models'
import { ChatroomAction, ChatroomState, CommonAction, CommonState, IMAction, IMState, IOTAction, IOTState } from '../store'

export class PahoMsgClient {

  private retry = 0
  private option = {
    port: 8884,
    protocol: 'mqtts',
    username: 'lynx-iot',
    password: '12345678',
    ssl: true,
    keepAlive: 0,
    timeout: 5000,
  }

  private commonStore: Store<string, CommonState, {}, CommonAction>
  private imStore: Store<string, IMState, {}, IMAction>
  private iotStore: Store<string, IOTState, {}, IOTAction>
  private chatroomStore: Store<string, ChatroomState, {}, ChatroomAction>
  private willTopic: string
  private willMessage: Paho.Message

  protected curTopic: string
  protected curSubDevice: string

  client: Paho.Client

  public init(commonStore: Store<string, CommonState, {}, CommonAction>,
    imStore: Store<string, IMState, {}, IMAction>,
    iotStore: Store<string, IOTState, {}, IOTAction>,
    chatroomStore: Store<string, ChatroomState, {}, ChatroomAction>) {

    this.commonStore = commonStore
    this.imStore = imStore
    this.iotStore = iotStore
    this.chatroomStore = chatroomStore

    this.willTopic = `_client/lwt/im/${commonStore.profile.uid}`
    this.willMessage = new Paho.Message(commonStore.profile.uid)
    this.willMessage.destinationName = this.willTopic
    this.willMessage.retained = true

    if (this.client != null) {
      this.client.disconnect()
      this.client = null
    }

    this.retry = 0

    if (this.commonStore.profile.uid == null) throw 'user info error'

    this.client = new Paho.Client(this.commonStore.appConfig.broker, this.option.port, this.commonStore.profile.uid)

    // set callback handlers
    this.client.onConnectionLost = (err: Paho.MQTTError) => {
      if (err.errorCode !== 0 && this.retry > 0 && this.retry <= 5) {
        this.connect()
        console.log(`[${err.errorCode}]:`, err.errorMessage)
        this.connect()
      }
    }
    this.client.onMessageArrived = (msg: any) => { this.handleMsg(msg.topic, msg.payloadString) }
    this.connect()
  }

  private connect() {
    this.retry++
    this.client.connect({
      useSSL: this.option.ssl,
      userName: this.option.username,
      password: this.option.password,
      willMessage: this.willMessage,
      // reconnect: true,
      onSuccess: () => {
        this.retry = 0
        this.client.subscribe(`_im/${this.client.clientId}`)
        this.client.send(this.willTopic, '', 0, true) // 更新在线状态
      }
    })
  }

  public subscribe(topic: string): boolean {
    if (!this.isConnected()) { return false }
    this.client.subscribe(topic)
    return true
  }

  public unsubscribe(topic: string) {
    if (!this.isConnected()) { return }
    this.client.unsubscribe(topic)
  }

  public send(topic: string, message: string) {
    if (!this.isConnected()) { return }
    this.client.send(topic, message, 0, false)
  }

  protected handleMsg(topic: string, message: string) {
    try {
      if (topic == `_im/${this.client.clientId}`) {
        let msgs = JSON.parse(message) as Array<IM.Message>
        this.imStore.onMessageArrived(msgs)
      } else if (topic.indexOf('_iot/') != -1) {
        let msg = JSON.parse(message) as IOT.IOTMsg
        this.iotStore.onDataArrived(msg.from, msg)
      } else if (topic.indexOf('_room/') != -1) {
        let msgs = JSON.parse(message) as Array<Chatroom.Message>
        this.chatroomStore.onMessageArrived(msgs)
      }
    } catch (err) {
      console.log(err)
    }
  }

  isConnected(): boolean {
    return this.client?.isConnected()
  }

  close() {
    if (this.client && this.isConnected()) {
      this.client.disconnect()
      this.client = null
    }

  }
}

const msgClient = new PahoMsgClient()

export default msgClient