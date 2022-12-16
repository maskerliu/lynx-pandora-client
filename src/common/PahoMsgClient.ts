import Paho from 'paho-mqtt'
import { Store } from 'pinia'
import { IM, IOT } from '../models'
import { CommonAction, CommonState, IMAction, IMState, IOTAction, IOTState } from '../store'

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

  commonStore: Store<string, CommonState, {}, CommonAction>
  imStore: Store<string, IMState, {}, IMAction>
  iotStore: Store<string, IOTState, {}, IOTAction>

  protected client: Paho.Client
  private willTopic: string
  protected curTopic: string
  protected curSubDevice: string

  private willMessage: Paho.Message

  public init(commonStore: Store<string, CommonState, {}, CommonAction>, imStore: Store<string, IMState, {}, IMAction>,
    iotStore: Store<string, IOTState, {}, IOTAction>) {

    this.commonStore = commonStore
    this.imStore = imStore
    this.iotStore = iotStore


    this.willTopic = `_client/lwt/${commonStore.profile.uid}`

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

  public unsubscribe(deviceId: string): void {
    if (!this.isConnected()) { return }
    this.client.unsubscribe(this.curTopic)
    this.client.unsubscribe(`tmp/${deviceId}`)
    this.client.unsubscribe(`message/${this.client.clientId}`)
  }

  public sendMsg(deviceId: string, message: IOT.IOTMsg) {
    this.client.send(`_iot/tmp/${deviceId}`, JSON.stringify(message), 0, true)
  }

  public subscribe(deviceId: string) {

    if (!this.isConnected()) { return }

    if (this.curTopic && this.curSubDevice !== deviceId) {
      this.sendMsg(this.curSubDevice, {
        from: this.client.clientId,
        type: IOT.MsgType.TMP_UNSUBSCRIBED,
      })
      this.client.unsubscribe(this.curTopic)
    }

    this.curSubDevice = deviceId
    this.curTopic = `_iot/tmp/${deviceId}`
    this.client.subscribe(this.curTopic)

    this.sendMsg(deviceId, {
      from: this.client.clientId,
      type: IOT.MsgType.TMP_SUBSCRIBED,
    })
  }

  protected handleMsg(topic: string, message: string) {
    try {
      if (topic == `_im/${this.client.clientId}`) {
        let msg = JSON.parse(message) as IM.Message
        this.imStore.onMessageArrived(msg)
      } else if (topic.indexOf('_iot/') != -1) {
        let msg = JSON.parse(message) as IOT.IOTMsg
        switch (msg.type) {
          case IOT.MsgType.DATA:
            this.iotStore.updateDeviceData(msg.from, msg.data)
            break
          case IOT.MsgType.REGISTER:

            break
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  isConnected(): boolean {
    return this.client?.isConnected()
  }

  close() {
    this.client.disconnect()
    this.client = null
  }
}

const msgClient = new PahoMsgClient()

export default msgClient