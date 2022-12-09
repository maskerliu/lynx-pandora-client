import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'


PouchDB.plugin(PouchDBFind)

const db = new PouchDB('test')

async function createIndex() {
  console.log('create index')
  await db.createIndex({
    index: {
      fields: ["name", "rank"]
    },
    "ddoc": "index-1",
    "type": "json"
  })

  await db.createIndex({
    index: {
      fields: ["name", "debut"]
    },
    "ddoc": "index-2",
    "type": "json"
  })

  await db.createIndex({
    index: {
      fields: ['rank', "debut",]
    },
    "ddoc": "index-4",
    "type": "json"
  })

  await db.createIndex({
    index: {
      "fields": ["name", "rank"]
    },
    "ddoc": "index-3",
    "name": "third-index",
    "type": "json"
  })

  return 'work'
}

async function genData() {
  console.log('genData')
  return await db.bulkDocs([
    { name: 'mario', _id: 'mario', rank: 5, series: 'mario', debut: 1981, test: new Date().getTime() },
    { name: 'jigglypuff', _id: 'puff', rank: 8, series: 'pokemon', debut: 1996, test: new Date().getTime() },
    { name: 'link', _id: 'link', rank: 10, series: 'zelda', debut: 1986, test: new Date().getTime() },
    { name: 'donkey kong', _id: 'dk', rank: 7, series: 'mario', debut: 1981, test: new Date().getTime() },
    { name: 'pikachu', _id: 'pikachu', rank: 1, series: 'pokemon', debut: 1996, test: new Date().getTime() },
    { name: 'captain falcon', _id: 'falcon', rank: 4, series: 'f-zero', debut: 1990, test: new Date().getTime() },
    { name: 'luigi', _id: 'luigi', rank: 11, series: 'mario', debut: 1983, test: new Date().getTime() },
    { name: 'fox', _id: 'fox', rank: 3, series: 'star fox', debut: 1993, test: new Date().getTime() },
    { name: 'ness', _id: 'ness', rank: 9, series: 'earthbound', debut: 1994, test: new Date().getTime() },
    { name: 'samus', _id: 'samus', rank: 12, series: 'metroid', debut: 1986, test: new Date().getTime() },
    { name: 'yoshi', _id: 'yoshi', rank: 6, series: 'mario', debut: 1990, test: new Date().getTime() },
    { name: 'kirby', _id: 'kirby', rank: 2, series: 'kirby', debut: 1992, test: new Date().getTime() },
    { name: 'kirby', _id: 'kirby1', rank: 2, series: 'kirby', debut: 1992, test: new Date().getTime() }
  ])
}

async function test() {
  console.log('hello')

  let test = await db.getIndexes()
  test.indexes.forEach(it => { console.log(it.ddoc) })
  let opt = {
    selector: {
      $and: []
    },
    sort: [{ 'name': 'asc', 'rank': 'desc' }],
    use_index: "index-1"
  }

  let filter = {}
  filter['name'] = { $gte: null }
  opt.selector.$and.push(filter)

  filter = {}
  filter['rank'] = { $gt: 0 }
  opt.selector.$and.push(filter)

  filter = {}
  filter['debut'] = { $ne: 1990 }
  opt.selector.$and.push(filter)

  // filter = {}
  // filter['series'] = { $ne: 'kirby' }
  // opt.selector.$and.push(filter)

  filter = {}
  filter['_id'] = { $ne: 'mario' }
  opt.selector.$and.push(filter)

  let result = await db.find(opt)
  console.log(result.docs)
}

export { createIndex, genData, test }