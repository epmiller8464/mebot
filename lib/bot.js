'use strict'
const {iobot} = require('./iobot')
const debug = require('debug')('mebot:main')
const plugins = {
  events : require('./ioevents')
}
// Create the Botkit controller, which controls all instances of the bot.
var controller = iobot({
  debug: true
})
// Tell Facebook to start sending events to this application
require(__dirname + '/components/subscribe_events.js')(controller)

// Set up Facebook "thread settings" such as get started button, persistent menu
require(__dirname + '/components/thread_settings.js')(controller)

// Send an onboarding message when a user activates the bot
require(__dirname + '/components/onboarding.js')(controller)

// Enable Dashbot.io plugin
require(__dirname + '/components/plugin_dashbot.js')(controller)

var normalizedPath = require('path').join(__dirname, 'skills')
require('fs').readdirSync(normalizedPath).forEach(function (file) {
  require('./skills/' + file)(controller)
})

// This captures and evaluates any message sent to the bot as a DM
// or sent to the bot in the form "@bot message" and passes it to
// Botkit Studio to evaluate for trigger words and patterns.
// If a trigger is matched, the conversation will automatically fire!
// You can tie into the execution of the script using the functions
// controller.studio.before, controller.studio.after and controller.studio.validate
if (process.env.studio_token) {
  controller.on('message_received', function (bot, message) {
    if (message.text) {
      controller.studio.runTrigger(bot, message.text, message.user, message.channel).then(function (convo) {
        if (!convo) {
          // no trigger was matched
          // If you want your bot to respond to every message,
          // define a 'fallback' script in Botkit Studio
          // and uncomment the line below.
          controller.studio.run(bot, 'fallback', message.user, message.channel)
        } else {
          // set variables here that are needed for EVERY script
          // use controller.studio.before('script') to set variables specific to a script
          convo.setVar('current_time', new Date())
        }
      }).catch(function (err) {
        if (err) {
          bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err)
          debug('Botkit Studio: ', err)
        }
      })
    }
  })
} else {
  console.log('~~~~~~~~~~')
  console.log('NOTE: Botkit Studio functionality has not been enabled')
  console.log('To enable, pass in a studio_token parameter with a token from https://studio.botkit.ai/')
}

function usage_tip () {
  console.log('~~~~~~~~~~')
  console.log('Botkit Studio Starter Kit')
  console.log('Execute your bot application like this:')
  console.log('page_token=<MY PAGE TOKEN> verify_token=<MY VERIFY TOKEN> studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js')
  console.log('Get Facebook token here: https://developers.facebook.com/docs/messenger-platform/implementation')
  console.log('Get a Botkit Studio token here: https://studio.botkit.ai/')
  console.log('~~~~~~~~~~')
}
