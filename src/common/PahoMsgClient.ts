import Paho from 'paho-mqtt'
import { IM, IOT } from '../models'
import { useCommonStore, useIMStore, useIOTDeviceStore } from '../store'

export default class PahoMsgClient {

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

  protected commonStore = useCommonStore()
  protected imStore = useIMStore()
  protected deviceStore = useIOTDeviceStore()
  protected client: Paho.Client
  protected curTopic: string
  protected curSubDevice: string

  constructor() {
    this.client = new Paho.Client(this.commonStore.appConfig.broker, this.option.port,
      this.commonStore.profile.uid == null ? 'lynx-iot-nodered-00003' : this.commonStore.profile.uid)

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
      onSuccess: () => {
        this.retry = 0
        this.client.subscribe(`_im/${this.client.clientId}`)
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
    this.client.send(`_iot/tmp/${deviceId}`, JSON.stringify(message))
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
      } else {
        let msg = JSON.parse(message) as IOT.IOTMsg
        switch (msg.type) {
          case IOT.MsgType.DATA:
            this.deviceStore.updateDeviceData(msg.from, msg.data)
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
    return this.client.isConnected()
  }

  onConnectionLost(err: Paho.MQTTError) {
    if (err.errorCode !== 0) {
      console.log('[onConnectionLost]:', err.errorMessage)
      console.log(err.errorMessage)

      this.connect()
    }
  }

  close() {
    this.client.disconnect()
  }

}