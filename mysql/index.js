"use strict"

const MySQLEvents = require('mysql-events')

const dsn = {
  host:     "localhost",
  user:     "events",
  password: "events",
}

const mysqlEventWatcher = MySQLEvents(dsn)

const watcher = mysqlEventWatcher.add(
   "testdb.companies.cnpj.value",

   (oldRow, newRow, event) => {

     console.log(newRow)

      //row inserted
      if (oldRow === null) {
        //insert code goes here
      }

      //row deleted
      if (newRow === null) {
        //delete code goes here
      }
  
      //row updated
      if (oldRow !== null && newRow !== null) {
        //update code goes here
      }

      //detailed event information
      //console.log(event)
  },
  /teste/
)