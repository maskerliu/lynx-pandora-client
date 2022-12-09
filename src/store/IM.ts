import { defineStore } from 'pinia'
import { useCommonStore } from '.'
import { messageRepo, sessionRepo } from '../common/im.repos'
import { CommonApi, IM } from '../models'
import { IMApi } from '../models/im.api'
import dingdong from '../../static/dingdong.m4a'

const notifyAudio = new Audio()


export const useIMStore = defineStore('IM', {
  state: () => {
    return {
      sid: null as string,
      _messages: [] as Array<IM.Message>,
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
    async createSession(session: IM.Session) {
      await sessionRepo.update(session)
      await IMApi.syncTo(session)
      this.updateSessions++
    },
    async updateSession(session: IM.Session) {
      await sessionRepo.update(session)
      this.updateSessions++
    },
    async deleteSession(sid: string) {
      await sessionRepo.delete(sid)
      this.updateSessions++
    },
    async session(sid: string) {
      return await sessionRepo.get('sid', sid)
    },
    async sessions() {
      let sessions = await sessionRepo.find({
        selector: {},
        limit: 15,
        sort: [{ 'timestamp': 'desc' }],
        use_index: 'idx-timestamp'
      })
      for (let session of sessions) {
        if (session.type == IM.SessionType.P2P && session.title == null) {
          let other = session.members.filter((it) => it != useCommonStore().profile.uid)[0]
          let user = await this.user(other)
          session.title = user.name
          session.thumb = user.avatar
          await sessionRepo.update(session)
        }
      }
      return sessions
    },
    async messages(init?: boolean, loadMore?: boolean) {

      let time = new Date().getTime()
      let opt: PouchDB.Find.FindRequest<any> = {
        selector: {
          sid: this.sid,
          timestamp: {}
        },
        limit: 15,
        sort: [{ 'timestamp': 'desc' }],
        use_index: 'idx-sid',
      }

      if (init) {
        opt.selector.timestamp = { $lt: new Date().getTime() }
        let msgs = await messageRepo.find(opt)
        this._messages = msgs.reverse()
      } else {
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
      }
      console.log('query cost:', new Date().getTime() - time)
      return this._messages
    },
    async onMessageArrived(message: IM.Message) {
      notifyAudio.play()

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

      await sessionRepo.update(session)
      this.updateSessions++

    },
    async sendMessage(message: IM.Message) {
      await IMApi.sendMsg(message)
      await messageRepo.update(message)
      this.updateMessage++
    },
    async syncSessionFromRemote(sid: string) {

    },
    async syncSessionToRemote() {

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