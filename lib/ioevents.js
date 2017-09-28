'use strict'
const debug = require('debug')('io:events')

function ioevents () {
  let events = {}
  events['bot:start:dialogue'] = function (message) {
    debug('trigger:message-received')
    controller.trigger('message-received', message)
  }
  return controller
}

module.exports = ioevents

// controller.bindInterface(function (source, events = []) {})

// controller.on('start:dialogue', function (bot, message) {
//   // bot.reply(message, 'Cool sticker.')
//   controller.trigger('start:dialogue', [bot, message])
// })
// look for sticker, image and audio attachments
// capture them, and fire special events
// controller.on('message_received', function (bot, message) {
//
//   if (!message.text) {
//     if (message.sticker_id) {
//       controller.trigger('sticker_received', [bot, message])
//       return false
//     } else if (message.attachments && message.attachments[0]) {
//       controller.trigger(message.attachments[0].type + '_received', [bot, message])
//       return false
//     }
//   }
