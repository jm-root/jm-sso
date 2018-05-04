const config = require('../config')
const $ = require('../lib')(config)

suite('TokenMan', function () {
  set('iterations', 10000)
  let id = 0
  let token = null
  let o = $.tokenMan
  before(function (next) {
    $.on('ready', function () {
      o.add()
        .then(doc => {
          token = doc.token
          next()
        })
    })
  })
  bench('add', function (next) {
    o.add({
      id: id++,
      name: 'jeff'
    }).then(next)
  })
  bench('verify', function (next) {
    o.verify(token).then(next)
  })
  bench('touch', function (next) {
    o.touch(token).then(next)
  })
})
