import PouchDB from 'pouchdb'
import { Common } from '../models/common.model'

export default abstract class BaseRepo<T extends Common.DBDoc> {

  pouchdb: PouchDB.Database

  constructor(name: string) {
    this.pouchdb = new PouchDB(name)
  }

  abstract init(): void

  public async replicate() {
    // await this.pouchdb.compact()
    let tmpDB = new PouchDB('tmp.db')
    let dbname = this.pouchdb.name

    PouchDB.replicate(this.pouchdb, tmpDB, {
      filter: (doc) => {
        if (doc._deleted)
          return false
        else
          return doc
      }
    }).on('complete', async () => {
      await this.pouchdb.destroy()
      this.pouchdb = new PouchDB(dbname)
      this.init()
      PouchDB.replicate(tmpDB, this.pouchdb).on('complete', async () => { await tmpDB.destroy() })
    })
  }

  public async get(field: string, query: string, returnFields?: Array<string>) {
    let request: PouchDB.Find.FindRequest<any> = {
      selector: {},
      limit: 1,
      fields: returnFields,
    }
    request.selector[field] = { $eq: query }
    let result = await this.find(request)
    return result ? result[0] : null
  }

  public async find(request: PouchDB.Find.FindRequest<any>) {
    let data: Array<T> = new Array()
    let result = await this.pouchdb.find(request)
    if (result.docs) {
      result.docs.forEach(it => {
        data.push(it as T)
      })
    }
    return data
  }

  public async update(item: T) {
    let result = null
    if (item._id != null) {
      let getResult = await this.get('_id', item._id, ['_rev'])
      if (getResult != null) {
        item._rev = getResult._rev
        result = await this.pouchdb.put(item)
      } else {
        result = await this.pouchdb.post(item)
      }
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
      let item = await this.get('_id', id, ['_id', '_rev'])
      let removeResult = await this.pouchdb.remove(item._id, item._rev)
      result = removeResult.ok
    } catch (err) {
      throw '删除失败' + err
    } finally {
      return result
    }
  }
}