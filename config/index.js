require('log4js').configure(require('path').join(__dirname, 'log4js.json'))
const config = require('config')
if (process.env['disableMQTT']) delete config.modules['jm-sso-mqtt']
module.exports = config
