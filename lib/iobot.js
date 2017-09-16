'use strict'
let Botkit = require('botkit').core
let readline = require('readline')

function iobot (configuration) {

  // Create a core botkit bot
  let _iobot = Botkit(configuration || {})

  _iobot.middleware.spawn.use(function (bot, next) {
    _iobot.listenStdIn(bot)
    next()
  })

  _iobot.middleware.format.use(function (bot, message, platform_message, next) {
    // clone the incoming message
    for (let k in message) {
      platform_message[k] = message[k]
    }
    next()
  })

  _iobot.middleware.format.use(function (bot, message, platform_message, next) {
    // clone the incoming message
    for (let k in message) {
      platform_message[k] = message[k]
    }
    next()
  })

  _iobot.defineBot(function (botkit, config) {

    let bot = {
      botkit: botkit,
      config: config || {},
      utterances: botkit.utterances,
    }

    bot.createConversation = function (message, cb) {
      botkit.createConversation(this, message, cb)
    }

    bot.startConversation = function (message, cb) {
      botkit.startConversation(this, message, cb)
    }

    bot.send = function (message, cb) {
      console.log('BOT:', message.text)
      if (cb) {
        cb()
      }
    }

    bot.reply = function (src, resp, cb) {
      let msg = {}

      if (typeof(resp) == 'string') {
        msg.text = resp
      } else {
        msg = resp
      }

      msg.channel = src.channel

      bot.say(msg, cb)
    }

    bot.findConversation = function (message, cb) {
      botkit.debug('CUSTOM FIND CONVO', message.user, message.channel)
      for (let t = 0; t < botkit.tasks.length; t++) {
        for (let c = 0; c < botkit.tasks[t].convos.length; c++) {
          if (
            botkit.tasks[t].convos[c].isActive() &&
            botkit.tasks[t].convos[c].source_message.user == message.user
          ) {
            botkit.debug('FOUND EXISTING CONVO!')
            cb(botkit.tasks[t].convos[c])
            return
          }
        }
      }

      cb()
    }

    return bot

  })
  _iobot.listenStdIn = function (bot) {

    _iobot.startTicking()
    let rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false})
    rl.on('line', function (line) {
      let message = {
        text: line,
        user: 'user',
        channel: 'text',
        timestamp: Date.now()
      }

      _iobot.ingest(bot, message, null)

    })
  }
  return _iobot
}

module.exports = {iobot}
