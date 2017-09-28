'use strict'

module.exports = function (config) {
  const {iobot} = require('./lib/iobot')
  let controller = iobot({})
  controller.on('message_received', function (bot, message) {
    if (message.text) {

    }
  })
  return controller
}
