"use strict"
const envLoader = require('env-o-loader')
const ZongJi = require('zongji')
const _ = require('lodash')


const options = {

  // binlogName: 'mysql-bin.000001',
  // binlogName: 'mysql-bin.000002',

  // startAtEnd: true,
  /**
   * without 'tablemap' events ('writerows', 'updaterows', 'deleterows') WILL not WORKS
   */
  // includeEvents: [ 'rotate' ],

  includeEvents: [ 'rotate', 'tablemap', 'writerows', 'updaterows', 'deleterows', 'unknown' ],
  // includeEvents: [ 'tablemap', 'writerows', 'updaterows', 'deleterows'],
  includeSchema: {
    'afiliados.com.br': [
      'admin_usuarios'
    ]
  },
  // excludeSchema: {
  //   'afiliados.com.br': [ 'admin_usuarios_backup', 'login' ]
  // }
}

const config = _.extend(envLoader('../config.yaml'))
console.log(config)

const zongji = new ZongJi(config)

// Each change to the replication log results in an event
// zongji.on('binlog', function(evt) {
//   evt.dump();
// });

// to control idempotency
// TODO - store in redis

class EventCache {

  constructor() {
    this.store = {}
  }

  _genKey(event) {
    return [
      event.getEventName(),
      "timestamp",
      event.timestamp,
    ].join(":")
  }

  get(event) {
    const key = this._genKey(event)
    return this.store[key]
  }

  put(event) {
    const key = this._genKey(event)
    this.store[key] = true
  }
}

const eventCache = new EventCache()

zongji.on('binlog', event => {


  try {
    
    // control idempotency
    if (!eventCache.get(event)) {

      const eventName = event.getEventName()
    
      if (eventName === 'tablemap') {
        return
      }

      console.log("date:", new Date(event.timestamp))

      switch(eventName) {

        case 'rotate':
          console.log(event)
          break

        case 'updaterows':
          const updatedRows = event.rows.map(row => {
            return {
              after: { 
                id: row.after.user_id,
                email: row.after.email,
                updated_at: row.after.data_atualizacao,
              },
              before: {
                id: row.before.user_id,
                email: row.before.email,
                updated_at: row.before.data_atualizacao,
              }
            }
          })
          
          console.log("updates:", updatedRows)
          break

        case 'writerows':
          const newRows = event.rows.map(row => ({ id: row.user_id, email: row.email }))
          console.log("create:", newRows)
          break

        case 'deleterows':
          const deletedRows = event.rows.map(row => ({ id: row.user_id, email: row.email }))
          console.log("delete:", deletedRows)
          break
      }

      eventCache.put(event)
    }
 
  } catch (err) {
    
    console.error(err)
  }
})

// Binlog must be started, optionally pass in filters
zongji.start(options)

process.on('SIGINT', function() {
  console.log('Got SIGINT.')
  zongji.stop()
  process.exit()
})