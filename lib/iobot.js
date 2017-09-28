'use strict'
let Botkit = require('botkit').core
const debug = require('debug')('io bot:main')
let readline = require('readline')

function iobot (configuration) {
  // Create a core botkit bot
  let bot = Botkit(configuration || {})

  bot.middleware.spawn.use(function (bot, next) {
    next()
  })

  bot.middleware.format.use(function (bot, message, platform_message, next) {
    // clone the incoming message
    for (let k in message) {
      platform_message[k] = message[k]
    }
    next()
  })

  bot.defineBot(function (botkit, config) {
    let _bot = {
      botkit: botkit,
      config: config || {},
      utterances: botkit.utterances
    }

    _bot.createConversation = function (message, cb) {
      botkit.createConversation(this, message, cb)
    }

    _bot.startConversation = function (message, cb) {
      botkit.startConversation(this, message, cb)
    }

    _bot.send = function (message, cb) {
      console.log('BOT:', message.text)
      if (cb) {
        cb()
      }
    }

    _bot.reply = function (src, resp, cb) {
      let msg = {}

      if (typeof (resp) === 'string') {
        msg.text = resp
      } else {
        msg = resp
      }

      msg.channel = src.channel

      _bot.say(msg, cb)
    }

    _bot.findConversation = function (message, cb) {
      botkit.debug('CUSTOM FIND CONVO', message.user, message.channel)
      for (let t = 0; t < botkit.tasks.length; t++) {
        for (let c = 0; c < botkit.tasks[t].convos.length; c++) {
          if (botkit.tasks[t].convos[c].isActive() && botkit.tasks[t].convos[c].source_message.user === message.user) {
            botkit.debug('FOUND EXISTING CONVO!')
            cb(botkit.tasks[t].convos[c])
            return
          }
        }
      }
      cb()
    }
    return _bot
  })
  bot.listen = function (bot, socket) {
    bot.startTicking()
    let message = {
      text: line,
      user: 'user',
      channel: 'text',
      timestamp: Date.now()
    }
    socket.on('bot:message:received', (message) => {
      bot.ingest(bot, message, null)
    })
    // })
  }
  return bot
}

module.exports = {iobot}
