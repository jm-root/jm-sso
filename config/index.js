require('log4js').configure(require('path').join(__dirname, 'log4js.json'))
var config = {
  development: {
    debug: true,
    lng: 'zh_CN',
    port: 3000,
    mqtt: 'mqtt://root:123@api.h5.jamma.cn',
    enable_id: true,
    modules: {
      sso: {
        module: process.cwd() + '/lib'
      },
      'jm-sso-mqtt': {}
    }
  },
  production: {
    port: 80,
    redis: 'redis://redis.db',
    tokenExpire: 7200,
    enable_id: false,
    modules: {
      sso: {
        module: process.cwd() + '/lib'
      },
      'jm-sso-mqtt': {}
    }
  }
}

var env = process.env.NODE_ENV || 'development'
config = config[env] || config['development']
config.env = env

if (process.env['disableMQTT']) delete config.modules['jm-sso-mqtt']

module.exports = config
