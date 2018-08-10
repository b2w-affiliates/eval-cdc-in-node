var crypto = require('crypto')
var fs = require('fs')
var readStream = fs.createReadStream('events.log')

var hash = crypto.createHash('sha1')

readStream.on('readable', function () {
  let chunk

  debugger
  while (null !== (chunk = readStream.read())) {
    hash.update(chunk);
  }
})
.on('end', function () {
  console.log(hash.digest('hex'));
})