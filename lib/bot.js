'use strict'
const {iobot} = require('./iobot')
const plugins = {
  events: require('./ioevents')
}
// Create the Botkit controller, which controls all instances of the bot.
var controller = iobot({
  debug: true,

})