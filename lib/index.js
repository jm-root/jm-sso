const Service = require('./service')
const router = require('./router')

/**
 * sso module.
 * @module sso
 * @param {Object} opts
 * @example
 * opts参数:{
 *  redis: (可选, 如果不填，自动连接默认 127.0.0.1:6379)
 *  secret: 安全密钥(可选，默认'')
 *  tokenKey: tokenKey, (可选, 默认'sso:token')
 *  tokenExpire: token过期时间, 单位秒(可选, 默认7200秒)
 * }
 * @return {SSO}
 */
module.exports = function (opts = {}) {
  ['redis', 'tokenExpire', 'tokenKey', 'secret'].forEach(function (key) {
    process.env[key] && (opts[key] = process.env[key])
  })

  let o = new Service(opts)
  o.router = router

  return o
}
