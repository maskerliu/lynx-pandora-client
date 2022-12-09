
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import { IM } from '../models'
import BaseRepo from './BaseRepo'

PouchDB.plugin(PouchDBFind)

export class SessionRepo extends BaseRepo<IM.Session> {

  constructor() {
    super()
    this.pouchdb = new PouchDB('im-sessions.db')
  }

  async init() {
    await this.pouchdb.createIndex({
      index: {
        fields: ['timestamp'],
        ddoc: 'idx-timestamp',
      },
    })
    return this
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
    super()
    this.pouchdb = new PouchDB('im-messages.db')
  }

  async init() {
    await this.pouchdb.createIndex({
      index: {
        fields: ['timestamp'],
        ddoc: 'idx-sid',
      },
    })
    return this
  }
}


const sessionRepo = new SessionRepo()
const messageRepo = new MessageRepo()

export { sessionRepo, messageRepo }