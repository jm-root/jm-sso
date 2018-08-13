const event = require('jm-event')
const TokenMan = require('./tokenMan')
const t = require('../locale')

/**
 * Class representing a sso.
 */
class SSO {
  /**
   * Create a sso.
   * @param {Object} opts
   */
  constructor (opts = {}) {
    event.enableEvent(this)
    this.t = t
    this.ready = false
    this.tokenMan = new TokenMan(opts)
    this.tokenMan.on('ready', () => {
      this.ready = true
      this.emit('ready')
    })
    this.tokenMan.on('notready', () => {
      this.ready = false
      this.emit('notready')
    })
  }

  onReady () {
    let self = this
    return new Promise(function (resolve, reject) {
      if (self.ready) return resolve(self.ready)
      self.once('ready', function () {
        resolve(self.ready)
      })
    })
  }

  /**
   * 登记, 并返回登记信息
   * @param {Object} opts
   * @example
   * opts参数:{
   *  id: user id
   *  token: token(可选)
   *  expire: token过期时间(可选)
   * }
   * @returns {Promise<*>}
   */
  async signon (opts = {}) {
    this.emit('beforeSignon', opts)
    let doc = await this.tokenMan.add(opts)
    this.emit('signon', doc)
    return doc
  }

  /**
   * 延长有效期, 并返回登记信息
   * @param token
   * @param opts
   * @returns {Promise<*>}
   */
  async touch (token, opts = {}) {
    let doc = await this.tokenMan.touch(token, opts)
    this.emit('touch', doc)
    return doc
  }

  /**
   * 登出, 并返回登记信息
   * @param token
   * @returns {Promise<*>}
   */
  async signout (token) {
    let doc = await this.tokenMan.verify(token)
    await this.tokenMan.delete(token)
    this.emit('signout', doc)
    return doc
  }

  /**
   * 清空指定id下所有token
   * @param id
   * @returns {Promise<void>}
   */
  async clearTokenById (id) {
    const rows = await this.tokenMan.deleteById(id)
    return {rows}
  }

  /**
   * 验证Token是否有效, 并返回登记信息
   * @param {String} token
   * @returns {Promise<void>}
   */
  async verify (token) {
    let doc = await this.tokenMan.verify(token)
    return doc
  }
}

module.exports = SSO
