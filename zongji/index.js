"use strict"

const envLoader = require('env-o-loader')
const ZongJi = require('zongji')

const zongji = new ZongJi(
  envLoader('../config.yaml'),
  {
    includeSchema: {
      'afiliados.com.br': [
        'admin_usuarios'
      ]
    },
    excludeSchema: {
      'afiliados.com.br': [ 'admin_usuarios_backup' ]
    }
  }
)

// Each change to the replication log results in an event
// zongji.on('binlog', function(evt) {
//   evt.dump();
// });

zongji.on('binlog', event => {
  try {
    switch(event.getEventName()) {
      case 'updaterows':
        const updatedRows = event.rows.map(row => {
          return {
            after: { 
              id: row.after.user_id,
              email: row.after.email
            },
            before: {
              id: row.before.user_id,
              email: row.before.email
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
    // console.log(event.getEventName())

  } catch (err) {
    err
  }
})

// Binlog must be started, optionally pass in filters
zongji.start({
  includeEvents: ['tablemap', 'writerows', 'updaterows', 'deleterows']
})