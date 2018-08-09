"use strict"

const envLoader = require('env-o-loader')
const MyEmitter = require('mysql-event-emitter')

const config = envLoader('../config.yaml')
console.log(config)


var mye = new MyEmitter({
  mysql: config
})

mye.on('change', function(db, table, event) {
  console.log('An ' + event + ' occured in ' + db + '.' + table)
})

mye.on('insert', function(db, table) {
  console.log('An insert occured in ' + db + '.' + table)
})

// Vanilla Events
mye.on('MyDB.MyTable.insert', function(){
  console.log('An insert occured in MyDB.MyTable')
})

mye.on('MyDB.MyTable', function(event){
  console.log('An ' + event + ' occured in MyDB.MyTable')
})

mye.on('MyDB', function(table, event){
  console.log('An ' + event + ' occured in MyDB.' + table)
})

mye.start(err => {

  if (err) 
    throw err
  
  console.log('started')

})