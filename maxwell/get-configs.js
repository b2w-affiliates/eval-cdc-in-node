#!/usr/bin/env node
const envLoader = require('env-o-loader')

const { host, user, password } = envLoader('../config.yaml')

console.log(
  `--user='${user}' --password='${password}' --host='${host}'`
)