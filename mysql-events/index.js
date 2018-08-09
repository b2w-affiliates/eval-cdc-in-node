"use strict"

const MySQLEvents = require('mysql-events')
const envLoader = require('env-o-loader')

const config = envLoader('../config.yaml')

const mysqlEventWatcher = MySQLEvents(config)

const watcher = mysqlEventWatcher.add(
   "",

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