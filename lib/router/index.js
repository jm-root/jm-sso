const event = require('jm-event')
const error = require('jm-err')
const help = require('./help')

let MS = require('jm-ms-core')
let ms = new MS()
let Err = error.Err

/**
 * @apiDefine Error
 *
 * @apiSuccess (Error 200) {Number} err 错误代码
 * @apiSuccess (Error 200) {String} msg 错误信息
 *
 * @apiExample {json} 错误:
 *     {
 *       err: 错误代码
 *       msg: 错误信息
 *     }
 */

module.exports = function (opts = {}) {
  let service = this
  let router = ms.router()

  service.routes || (service.routes = {})
  let routes = service.routes
  event.enableEvent(routes)

  let t = function (doc, lng) {
    if (lng && doc.err && doc.msg) {
      return {
        err: doc.err,
        msg: service.t(doc.msg, lng) || Err.t(doc.msg, lng) || doc.msg
      }
    }
    return doc
  }

  let cbErr = (opts, cb, e) => {
    let doc = {
      err: e.code,
      msg: e.message
    }
    cb(e, t(doc, opts.lng))
  }

  routes.signon = function (opts = {}, cb, next) {
    service.signon(opts.data)
      .then(doc => {
        cb(null, doc)
      })
      .catch(e => {
        cbErr(opts, cb, e)
      })
  }

  routes.signout = function (opts = {}, cb, next) {
    service.signout(opts.data.token)
      .then(doc => {
        cb(null, doc)
      })
      .catch(e => {
        cbErr(opts, cb, e)
      })
  }

  routes.verify = function (opts = {}, cb, next) {
    service.verify(opts.data.token)
      .then(doc => {
        cb(null, doc)
      })
      .catch(e => {
        cbErr(opts, cb, e)
      })
  }

  routes.touch = function (opts = {}, cb, next) {
    service.touch(opts.data.token, opts.data)
      .then(doc => {
        cb(null, doc)
      })
      .catch(e => {
        cbErr(opts, cb, e)
      })
  }

  let _signon = function (opts, cb, next) {
    routes.signon(opts, cb, next)
  }
  let _signout = function (opts, cb, next) {
    routes.signout(opts, cb, next)
  }
  let _verify = function (opts, cb, next) {
    routes.verify(opts, cb, next)
  }
  let _touch = function (opts, cb, next) {
    routes.touch(opts, cb, next)
  }

  router.use(help(service))
    .use(function (opts, cb, next) {
      if (!service.ready) {
        let e = error.err(Err.FA_NOTREADY)
        return cbErr(opts, cb, e)
      }
      next()
    })
    .add('/signon', 'post', _signon)
    .add('/signout', 'get', _signout)
    .add('/verify', 'get', _verify)
    .add('/touch', 'get', _touch)
    .add('/touch', 'post', _touch)
    .add('/user', 'get', _verify) // deprecated
    .add('/isSignon', 'get', _verify) // deprecated

  return router
}
