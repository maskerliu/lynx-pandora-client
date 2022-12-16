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
  cleanMessages(): void
  onMessageArrived(message: IM.Message): void
  sendMessage(message: IM.Message, file: File): Promise<void>
  user(uid: string): Promise<User.Profile>
  cacheUsers(users: Array<User.Profile>): void
  cleanCache(): Promise<void>
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

      await this.syncOfflineMessages()

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
    async updateSession(session: IM.Session, thumb?: File, sync: boolean = false) {
      let remoteSession = sync ? await IMApi.syncTo(session, thumb) : session
      if (session.type == IM.SessionType.P2P) {
        remoteSession.title = session.title
        remoteSession.thumb = session.thumb
      }
      await sessionRepo.update(remoteSession)
      this.updateSessions++
    },
    async deleteSession(sid: string) {
      await sessionRepo.delete(sid)
      await messageRepo.deleteSessionMessages(sid)
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
    cleanMessages() {
      this._messages = []
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

      session.snapshot = this.message2sessionSnap(message)
      session.timestamp = message.timestamp

      await messageRepo.update(message)
      if (this.sid == message.sid) {
        this.updateMessage++
        session.unread = 0
      } else {
        session.unread += 1
      }
      await this.updateSession(session)
      this.updateSessions++
    },
    async sendMessage(message: IM.Message, file: File) {
      await IMApi.sendMsg(message, file)

      if (message.type == IM.MessageType.TEXT) {
        await messageRepo.update(message)
        this.updateMessage++

        let session: IM.Session = await this.session(message.sid)
        session.snapshot = message.content
        session.timestamp = message.timestamp
        await this.updateSession(session)
        this.updateSessions++
      }
    },
    async user(uid: string) {
      if (this.users[uid] != null) { return this.users[uid] }
      let user = await CommonApi.getUserProfile(uid)
      this.users[uid] = user
      return user
    },
    cacheUsers(users: Array<User.Profile>) {
      users.forEach(it => {
        if (this.users[it.uid] == null)
          this.users[it.uid] = it
      })
    },
    async cleanCache() {
      await sessionRepo.replicate()
      // await messageRepo.compact()
    },
    async syncOfflineMessages() {
      let offlineMsgs = await IMApi.syncOfflineMessages()
      await messageRepo.bulkMessages(offlineMsgs)
      type SessionTmpSnap = { unread: number, snapshot: string, timestamp: number }
      let sessionSanps = new Map<string, SessionTmpSnap>()
      offlineMsgs.forEach(it => {
        if (!sessionSanps.has(it.sid)) {
          sessionSanps.set(it.sid, { unread: 1, snapshot: this.message2sessionSnap(it), timestamp: it.timestamp })
        } else {
          let curSnap = sessionSanps.get(it.sid)
          let newSnap: SessionTmpSnap = Object.assign({}, curSnap)
          newSnap.unread++
          if (curSnap.timestamp < it.timestamp) {
            newSnap.timestamp = it.timestamp
            newSnap.snapshot = this.message2sessionSnap(it)
          }
          sessionSanps.set(it.sid, newSnap)
        }
      })
      let sids = Array.from(sessionSanps.keys())
      let sessions = await sessionRepo.bulkGet(sids)
      sessions.forEach(it => {
        let snap = sessionSanps.get(it.sid)
        it.snapshot = snap.snapshot
        it.timestamp = snap.timestamp
        it.unread += snap.unread
      })

      await sessionRepo.bulkDocs(sessions)
      this.updateSessions++
    },
    message2sessionSnap(message: IM.Message) {
      let snapshot = ''
      switch (message.type) {
        case IM.MessageType.AUDIO:
          snapshot = '[语音]'
          break
        case IM.MessageType.VIDEO:
          snapshot = '[视频]'
          break
        case IM.MessageType.EMOJI:
          snapshot = '[表情]'
          break
        case IM.MessageType.IMAGE:
          snapshot = '[图片]'
          break
        default:
          snapshot = message.content
          break
      }
      return snapshot
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