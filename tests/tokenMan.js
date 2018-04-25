const chai = require('chai')
let expect = chai.expect
const config = require('../config')
const $ = require('../lib/service/tokenMan')
const consts = require('../lib/consts')
let Err = consts.Err

let log = function (err, doc) {
  if (err) console.error(err.stack)
  if (doc) console.log(doc)
}

let service = new $(config)
describe('tokenMan', function () {
  it('add and check', function (done) {
    service.add({
      id: 1,
      name: 'jeff'
    }, function (err, doc) {
      let token = doc.token
      service.check(token, function (err, doc) {
        expect(err === null).to.be.ok
        done()
      })
    })
  })

  it('delete', function (done) {
    service.add({
      id: 1,
      name: 'jeff'
    }, function (err, doc) {
      let token = doc.token
      service.delete(token, function (err, doc) {
        expect(doc === 1).to.be.ok
        done()
      })
    })
  })

  it('expire', function (done) {
    service.add({
      id: 1,
      expire: 1,
      name: 'jeff'
    }, function (err, doc) {
      log(err, doc)
      let token = doc.token
      setTimeout(function () {
        service.check(token, function (err, doc) {
          log(err, doc)
          expect(doc === Err.FA_TOKEN_EXPIRED).to.be.ok
          done()
        })
      }, 1500)
    })
  })

  it('touch', function (done) {
    service.add({
      id: 1,
      expire: 1,
      name: 'jeff'
    }, function (err, doc) {
      log(err, doc)
      let token = doc.token
      setTimeout(function () {
        service.touch(token, function (err, doc) {
          log(err, doc)
          service.check(token, function (err, doc) {
            log(err, doc)
            expect(err === null).to.be.ok
            done()
          })
        })
      }, 1500)
    })
  })
})
