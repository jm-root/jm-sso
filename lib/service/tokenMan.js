const Promise = require('bluebird')
const _redis = require('redis')
const crypto = require('crypto')
const event = require('jm-event')
const consts = require('../consts')
const log = require('jm-log4js')
const error = require('jm-err')
const _ = require('lodash')
let Err = consts.Err
let logger = log.getLogger('sso')
Promise.promisifyAll(_redis.RedisClient.prototype)
Promise.promisifyAll(_redis.Multi.prototype)

/**
 * Class representing a tokenMan.
 */
class TokenMan {
  /**
   * Create a tokenMan.
   * @param {Object} opts
   * @example
   * opts参数:{
   *  redis: (可选, 如果不填，自动连接默认 127.0.0.1:6379)
   *  secret: 安全密钥(可选，默认'')
   *  tokenKey: tokenKey, (可选, 默认'sso:token')
   *  tokenExpire: token过期时间, 单位秒(可选, 默认7200秒)
   * }
   */
  constructor (opts = {}) {
    event.enableEvent(this)
    this.secret = opts.secret || ''
    this.tokenKey = opts.tokenKey || consts.TokenKey
    this.IdKey = opts.idKey || consts.IdKey
    this.tokenExpire = opts.tokenExpire || consts.TokenExpire
    this.enableId = opts.enable_id

    let redis = null
    if (opts.redis) {
      redis = _redis.createClient(opts.redis)
    } else {
      redis = _redis.createClient()
    }
    redis.on('ready', () => {
      this.emit('ready')
    })
    redis.on('end', () => {
      this.emit('notready')
    })
    this.redis = redis
  }

  /**
   * 生成token
   * @param {String} id
   * @return {String} token
   */
  create (id = '') {
    id += Math.random() + Date.now().toString() + this.secret
    let sha256 = crypto.createHash('sha256')
    sha256.update(id)
    let token = sha256.digest('hex')
    return token
  }

  getKey (id) {
    return this.tokenKey + ':' + id
  }

  getIdKey (id) {
    return this.IdKey + ':' + id
  }

  async getValueById (id) {
    try {
      let mapToken = await this.redis.getAsync(this.getIdKey(id))
      mapToken || (mapToken = '{}')
      mapToken = JSON.parse(mapToken)
      for (let token in mapToken) {
        let o = mapToken[token]
        let expired = o.time + o.expire * 1000
        if (expired <= Date.now()) delete mapToken[token]
      }
      return mapToken
    } catch (e) {
      logger.error(e)
      throw error.err(Err.FA_INVALID_ID)
    }
  }

  /**
   * 添加用户token, 并返回登记信息
   * @param {Object} opts
   * @example
   * opts参数:{
   *  id: user id(可选)
   *  token: token(可选)
   *  expire: token过期时间, 单位秒, 0代表永不过期(可选)
   *  data: 用户数据(可选)
   * }
   * @returns {Promise<*>}
   */
  async add (opts = {}) {
    let redis = this.redis
    opts.expire || (opts.expire = this.tokenExpire)
    opts.token || (opts.token = this.create(opts.id))
    opts.time || (opts.time = Date.now())
    try {
      await redis.setAsync(this.getKey(opts.token), JSON.stringify(opts), 'EX', opts.expire)
      if (this.enableId && opts.id) {
        let mapToken = await this.getValueById(opts.id)
        mapToken[opts.token] = opts
        await redis.setAsync(this.getIdKey(opts.id), JSON.stringify(mapToken), 'EX', opts.expire)
      }
      return opts
    } catch (e) {
      logger.error(e)
      throw error.err(Err.FA_ADD_TOKEN)
    }
  }

  /**
   * 验证用户token, 如果成功, 返回登记信息
   * @param token
   * @returns {Promise<*>}
   */
  async verify (token) {
    if (!token) throw error.err(Err.FA_INVALID_TOKEN)
    try {
      let doc = await this.redis.getAsync(this.getKey(token))
      if (!doc) throw error.err(Err.FA_INVALID_TOKEN)
      doc = JSON.parse(doc)
      return doc
    } catch (e) {
      if (e.code) throw e
      logger.error(e)
      throw error.err(Err.FA_VERIFY_TOKEN)
    }
  }

  /**
   * 延长用户token过期时间, 并返回登记信息
   * @param token
   * @param opts (可选)
   * @example
   * opts参数:{
   *  expire: token过期时间, 单位秒(可选)
   *  data: 用户数据(可选)
   * }
   * @returns {Promise<*>}
   */
  async touch (token, opts = {}) {
    let doc = await this.verify(token)
    _.assign(doc, opts)
    doc.expire || (doc.expire = this.tokenExpire)
    doc.time = Date.now()
    try {
      await this.redis.setAsync(this.getKey(token), JSON.stringify(doc), 'EX', doc.expire)
      if (this.enableId && doc.id) {
        await this.redis.expireAsync(this.getIdKey(doc.id), doc.expire)
      }
      return doc
    } catch (e) {
      logger.error(e)
      if (!token) throw error.err(Err.FA_TOUCH_TOKEN)
    }
  }

  /**
   * 删除用户token, 并返回token
   * @param token
   * @returns {Promise<*>}
   */
  async delete (token) {
    if (!token) throw error.err(Err.FA_INVALID_TOKEN)
    try {
      if (this.enableId) {
        let doc = await this.redis.getAsync(this.getKey(token))
        if (doc) {
          doc = JSON.parse(doc)
          if (doc.id) {
            let mapToken = await this.getValueById(doc.id)
            delete mapToken[token]
            await this.redis.setAsync(this.getIdKey(doc.id), JSON.stringify(mapToken))
          }
        }
      }
      await this.redis.delAsync(this.getKey(token))
      return token
    } catch (e) {
      logger.error(e)
      throw error.err(Err.FA_DELETE_TOKEN)
    }
  }

  async deleteById (id) {
    if (!id) throw error.err(Err.FA_INVALID_ID)
    try {
      let mapToken = await this.getValueById(id)
      let tokens = Object.keys(mapToken)
      let promises = tokens.map((token) => this.delete(token))
      let results = await Promise.all(promises)
      await this.redis.delAsync(this.getIdKey(id))
      return results
    } catch (e) {
      logger.error(e)
      throw error.err(Err.FA_DELETE_TOKEN)
    }
  }
}

module.exports = TokenMan
