import md5 from 'md5'
import { defineStore } from 'pinia'
import { useCommonStore } from '.'
import dingdong from '../asserts/dingdong.m4a'
import { messageRepo, sessionRepo } from '../common/im.repos'
import { IM, User } from '../models'
import { IMApi } from '../models/im.api'
import { UserApi } from '../models/user.api'

const notifyAudio = new Audio()

type SessionTmpSnap = { unread: number, snapshot: string, timestamp: number }

export type IMState = {
  unread: number
  sid?: string
  _messages: Array<IM.Message>
  _emojis: Array<IM.IMEmoji>
  users: {},
  updateSessions: number,
  updateMessages: number
}

export type IMAction = {
  init(): Promise<void>
  sessions(): Promise<Array<IM.Session>>
  session(sid: string): Promise<IM.Session>
  updateSession(session: IM.Session, snap?: File): Promise<void>
  deleteSession(sid: string): Promise<void>
  myEmojis(): Promise<Array<IM.IMEmoji>>
  messages(sid: string, loadMore?: boolean): Promise<Array<IM.Message>>
  cleanMessages(): void
  onMessageArrived(message: Array<IM.Message>): Promise<void>
  sendMessage(message: IM.Message, file: File): Promise<void>
  user(uid: string): Promise<User.Profile>
  cacheUsers(users: Array<User.Profile>): void
  cleanCache(): Promise<void>
  mockMessages(uid: string): Promise<void>
}

export const useIMStore = defineStore<string, IMState, {}, IMAction>('IM', {
  state: () => {
    return {
      unread: 0,
      sid: null,
      _messages: [],
      _emojis: [],
      users: {},
      updateSessions: 0,
      updateMessages: 0,
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
      let result = await sessionRepo.find({
        selector: {
          pinned: { $gt: -1 },
          timestamp: { $lt: new Date().getTime() }
        },
        sort: [{ 'pinned': 'desc' }, 'timestamp'],
        use_index: 'idx-timestamp'
      })

      let needUpdate = false
      result.forEach(async (session) => {
        if (session.type == IM.SessionType.P2P && session.title == null) {
          let other = session.members.filter((it) => it != useCommonStore().profile.uid)[0]
          let user = await this.user(other)
          session.title = user.name
          session.thumb = user.avatar
          await sessionRepo.update(session)
          needUpdate = true
        }
      })

      this.unread = 0
      result.forEach(it => { this.unread += it.unread })
      return result
    },
    async session(sid: string) {
      let session = await sessionRepo.get('sid', sid)
      if (session == null) {
        session = await IMApi.syncFrom(sid)
        this.updateSession(session)
      }
      return session
    },
    async updateSession(session: IM.Session, thumb?: File) {
      let remoteSession: IM.Session
      if (session.type == IM.SessionType.P2P) {
        remoteSession = session
        remoteSession.title = session.title
        remoteSession.thumb = session.thumb
      } else {
        remoteSession = await IMApi.syncTo(session, thumb)
      }
      remoteSession.pinned = remoteSession.pinned != null ? remoteSession.pinned : 0
      await sessionRepo.update(remoteSession)
      this.updateSessions++
    },
    async deleteSession(sid: string) {
      await sessionRepo.delete(sid)
      await messageRepo.deleteSessionMessages(sid)
      this.updateSessions++
    },
    async myEmojis() {
      if (this._emojis.length == 0) {
        this._emojis = await IMApi.myEmojis()
      }

      return this._emojis
    },
    async messages(sid: string, loadMore?: boolean) {
      let opt: PouchDB.Find.FindRequest<any> = {
        selector: { sid, timestamp: {} },
        limit: 15,
        sort: [{ 'sid': 'desc' }, { 'timestamp': 'desc' }],
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
    async onMessageArrived(messages: Array<IM.Message>) {
      // notifyAudio.play()
      await this.bulkMessages(messages)
    },
    async syncOfflineMessages() {
      let offlineMsgs = await IMApi.syncOfflineMessages()
      await this.bulkMessages(offlineMsgs)
    },
    async sendMessage(message: IM.Message, file: File) {

      await IMApi.sendMsg(message, file)

      if (message.type == IM.MessageType.TEXT || message.type == IM.MessageType.EMOJI) {
        await messageRepo.update(message)
        this.updateMessages++

        let session = await this.session(message.sid)
        session.snapshot = message.content
        session.timestamp = message.timestamp
        await this.updateSession(session)
        this.updateSessions++
      }
    },
    async user(uid: string) {
      if (this.users[uid] != null) { return this.users[uid] }
      let user = await UserApi.userProfile(uid)
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
      await messageRepo.replicate()
    },
    async bulkMessages(messages: Array<IM.Message>) {
      let uid = useCommonStore().profile.uid
      let sessionSanps = new Map<string, SessionTmpSnap>()
      let p2pSessions = new Map<string, IM.Session>()
      messages.forEach(it => {
        if (it.sid == md5([uid, it.uid].sort().join(';'))) { // is p2p message
          let profile = this.user(it.uid)
          let session: IM.Session = {
            sid: it.sid,
            type: IM.SessionType.P2P,
            title: profile.name,
            thumb: profile.avatar,
            timestamp: it.timestamp,
            members: [it.uid, uid],
            unread: 1,
            pinned: 0,
          }
          p2pSessions.set(it.sid, session)
        }

        if (!sessionSanps.has(it.sid)) {
          sessionSanps.set(it.sid, {
            unread: 1,
            snapshot: this.message2sessionSnap(it),
            timestamp: it.timestamp
          })
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
      let localSids: Array<string>, remoteSessions: Array<IM.Session>

      // p2p session not in local db
      localSids = sessions.map(it => it.sid)
      if (sessionSanps.size > sessions.length) {
        let p2pSids = sids.filter(it => !localSids.includes(it))
        remoteSessions = p2pSids.map(it => { return p2pSessions.get(it) })
        sessions.push(...remoteSessions)
      }

      // group session not in local db
      localSids = sessions.map(it => it.sid)
      if (sessionSanps.size > sessions.length) {
        let remoteSids = sids.filter(it => !localSids.includes(it))
        remoteSessions = await IMApi.bulkSyncFrom(remoteSids)
        sessions.push(...remoteSessions)
      }

      sessions.forEach(it => {
        let snap = sessionSanps.get(it.sid)
        it.snapshot = snap.snapshot
        it.timestamp = snap.timestamp
        it.unread += snap.unread
      })

      if (messages.length > 0) {
        await messageRepo.bulkMessages(messages)
        this.updateMessages++
      }

      if (sessions.length > 0) {
        await sessionRepo.bulkDocs(sessions)
        this.updateSessions++
      }


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
        case IM.MessageType.RedPacket:
          snapshot = '[🧧]'
          break
        default:
          snapshot = message.content
          break
      }
      return snapshot
    },
    async mockMessages(uid: string) {
      let redpacketOrder: IM.RedPacketOrder = {
        _id: '',
        sid: '',
        uid: '',
        name: '王二狗',
        avatar: '',
        note: '恭喜发财',
        type: IM.RedPacketType.Quota,
        amount: 10,
        count: 3,
      }

      let redPacketMsg: IM.Message = {
        timestamp: new Date().getTime(),
        read: true,
        type: IM.MessageType.RedPacket,
        content: redpacketOrder,
        uid: 'f947ed55-7e34-4a82-a9db-8a9cf6f2e608'
      }


      let mockUsers = await UserApi.getContact()
      let messages: Array<IM.Message> = []
      mockUsers.forEach(it => {
        let members = [it.uid, uid]
        let sid = md5(members.sort().join(';'))

        let count = Math.random() * 10
        for (let i = 0; i < count; ++i) {
          let seed = Math.random()
          messages.push({
            sid,
            uid: it.uid,
            content: `${it.name}++${i}++`,
            timestamp: new Date().getTime() - Math.floor(seed * 10000000),
            type: 1 + Math.round(seed) + Math.round(seed * 10 - Math.floor(seed * 10)),
            sent: 1 - Math.round(seed) - Math.round(seed * 10 - Math.floor(seed * 10)),
            read: false,
          } as IM.Message)
        }
      })

      await this.onMessageArrived(messages)
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