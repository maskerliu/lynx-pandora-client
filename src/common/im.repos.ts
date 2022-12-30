
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import { IM } from '../models'
import BaseRepo from './BaseRepo'

PouchDB.plugin(PouchDBFind)

export class SessionRepo extends BaseRepo<IM.Session> {

  constructor() {
    super('im-sessions.db')
  }

  async init() {
    await this.pouchdb.createIndex({
      index: {
        fields: ['pinned', 'timestamp'],
        ddoc: 'idx-timestamp',
      },
    })
    return this
  }

  public async bulkGet(sids: Array<string>) {
    let request: PouchDB.Find.FindRequest<any> = {
      selector: {
        sid: { $in: sids }
      }
    }
    let resp = await this.pouchdb.find(request)
    return resp.docs.map(it => {
      return it as IM.Session
    })
  }

  public async bulkDocs(sessions: Array<IM.Session>) {

    let sids = sessions.map(it => it.sid)
    let request: PouchDB.Find.FindRequest<any> = {
      selector: {
        sid: { $in: sids }
      },
      fields: ['_id', '_rev', 'sid']
    }
    let resp = await this.pouchdb.find(request)

    await this.pouchdb.bulkDocs(sessions)
  }

  public async update(item: IM.Session) {
    let result = null

    let getResult = await this.get('sid', item.sid, ['_id', '_rev', 'snapshot'])
    if (getResult != null) {
      item._rev = getResult._rev
      item._id = getResult._id
      item.snapshot = item.snapshot == null ? getResult.snapshot : item.snapshot
      result = await this.pouchdb.put(item)
    } else {
      result = await this.pouchdb.post(item)
    }

    if (result.ok)
      return result.id
    else
      throw '更新失败'
  }

  public async delete(id: string) {
    let result = false
    try {
      let item = await this.get('sid', id, ['_id', '_rev'])
      let removeResult = await this.pouchdb.remove(item._id, item._rev)
      result = removeResult.ok
    } catch (err) {
      throw '删除失败' + err
    } finally {
      return result
    }
  }
}

export class MessageRepo extends BaseRepo<IM.Message> {
  constructor() {
    super('im-messages.db')
  }

  async init() {
    await this.pouchdb.createIndex({
      index: {
        fields: ['sid', 'timestamp'],
        ddoc: 'idx-sid',
      },
    })
    return this
  }

  async bulkMessages(messages: Array<IM.Message>) {
    await this.pouchdb.bulkDocs(messages)
  }

  async deleteSessionMessages(sid: string) {
    let opt: PouchDB.Find.FindRequest<any> = {
      selector: {
        sid: sid,
        timestamp: { $lt: new Date().getTime() }
      },
      use_index: 'idx-sid',
      fields: ['_id', '_rev']
    }
    let resp = await this.pouchdb.find(opt)
    let docs = resp.docs
    docs.forEach(it => {
      it['_deleted'] = true
    })
    await this.pouchdb.bulkDocs(docs)
  }
}


const sessionRepo = new SessionRepo()
const messageRepo = new MessageRepo()

export { sessionRepo, messageRepo }