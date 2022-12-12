import { defineStore } from 'pinia'
import { useCommonStore } from '.'
import dingdong from '../asserts/dingdong.m4a'
import { messageRepo, sessionRepo } from '../common/im.repos'
import { CommonApi, IM, User } from '../models'
import { IMApi } from '../models/im.api'

const notifyAudio = new Audio()

export type IMState = {
  sid?: string
  _messages: Array<IM.Message>
  users: {},
  updateSessions: number,
  updateMessage: number
}

export type IMAction = {
  init(): Promise<void>
  sessions(): Promise<Array<IM.Session>>
  session(sid: string): Promise<IM.Session>
  updateSession(session: IM.Session, snap?: File, sync?: boolean): Promise<void>
  deleteSession(sid: string): Promise<void>
  messages(loadMore?: boolean): Promise<Array<IM.Message>>
  onMessageArrived(message: IM.Message): void
  sendMessage(message: IM.Message): Promise<void>
  user(uid: string): Promise<User.Profile>
}

export const useIMStore = defineStore<string, IMState, {}, IMAction>('IM', {
  state: () => {
    return {
      sid: null,
      _messages: [],
      users: {},
      updateSessions: 0,
      updateMessage: 0,
    }
  },
  actions: {
    async init() {
      await sessionRepo.init()
      await messageRepo.init()

      notifyAudio.src = dingdong
      this._messages = []
    },
    async sessions() {
      let sessions = await sessionRepo.find({
        selector: {},
        limit: 50,
        sort: [{ 'timestamp': 'desc' }],
        use_index: 'idx-timestamp'
      })
      for (let session of sessions) {
        try {
          if (session.type == IM.SessionType.P2P && session.title == null) {
            let other = session.members.filter((it) => it != useCommonStore().profile.uid)[0]
            let user = await this.user(other)
            session.title = user.name
            session.thumb = user.avatar
            await sessionRepo.update(session)
          }
        } catch (err) {

        }
      }
      return sessions
    },
    async session(sid: string) {
      let session = await sessionRepo.get('sid', sid)
      if (session == null) {
        session = await IMApi.syncFrom(sid)
        this.updateSession(session)
      }
      return session
    },
    async updateSession(session: IM.Session, snap?: File, sync: boolean = false) {
      let remoteSession = sync ? await IMApi.syncTo(session, snap) : session
      if (session.type== IM.SessionType.P2P) {
        remoteSession.title = session.title
        remoteSession.thumb = session.thumb
      }
      await sessionRepo.update(remoteSession)
      this.updateSessions++
    },
    async deleteSession(sid: string) {
      await sessionRepo.delete(sid)
      this.updateSessions++
    },
    async messages(loadMore?: boolean) {
      let opt: PouchDB.Find.FindRequest<any> = {
        selector: {
          sid: this.sid,
          timestamp: {}
        },
        limit: 15,
        sort: [{ 'timestamp': 'desc' }],
        use_index: 'idx-sid',
      }

      if (loadMore) {
        opt.selector.timestamp = { $lt: this._messages[0].timestamp }
        let msgs = await messageRepo.find(opt)
        this._messages = msgs.reverse().concat(this._messages)
      } else {
        if (this._messages.length > 0) {
          opt.selector.timestamp = { $gt: this._messages[this._messages.length - 1].timestamp }
          let msgs = await messageRepo.find(opt)
          this._messages = this._messages.concat(msgs.reverse())
        } else {
          opt.selector.timestamp = { $lt: new Date().getTime() }
          let msgs = await messageRepo.find(opt)
          this._messages = msgs.reverse()
        }
      }
      return this._messages
    },
    async onMessageArrived(message: IM.Message) {
      // notifyAudio.play()

      let session = await sessionRepo.get('sid', message.sid)
      if (session == null) {
        session = await IMApi.syncFrom(message.sid)

        if (session.type == IM.SessionType.P2P) {
          let profile = await CommonApi.getUserProfile(message.uid)
          session.title = profile.name
          session.thumb = profile.avatar
        }
      }

      switch (message.type) {
        case IM.MessageType.AUDIO:
          session.snapshot = '[语音]'
          break
        case IM.MessageType.VIDEO:
          session.snapshot = '[视频]'
          break
        case IM.MessageType.EMOJI:
          session.snapshot = '[表情]'
          break
        case IM.MessageType.IMAGE:
          session.snapshot = '[图片]'
          break
        default:
          session.snapshot = message.content
          break
      }

      session.timestamp = message.timestamp

      await messageRepo.update(message)
      if (this.sid == message.sid) {
        this.updateMessage++
        session.unread = 0
      } else {
        session.unread += 1
      }

      await this.updateSession(session)
    },
    async sendMessage(message: IM.Message) {
      await IMApi.sendMsg(message)
      await messageRepo.update(message)
      this.updateMessage++
    },
    async user(uid: string) {
      if (this.users[uid] != null) { return this.users[uid] }
      let user = await CommonApi.getUserProfile(uid)
      this.users[uid] = user
      return user
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'im',
        storage: localStorage,
        paths: ['users']
      },
    ],
  }
})