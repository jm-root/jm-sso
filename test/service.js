import chai from 'chai'
let expect = chai.expect
import config from '../config'
import $ from '../src/service'
import consts from '../src/consts'
let Err = consts.Err

let log = function (err, doc) {
  if (err) console.error(err.stack)
  if (doc) console.log(doc)
}

let service = new $(config)
describe('service', function () {
  it('signon', function (done) {
    service.signon({
      id: 1
    }, function (err, doc) {
      log(err, doc)
      expect(err === null).to.be.ok
      done()
    })
  })

  it('isSignon', function (done) {
    service.signon({
      id: 1
    }, function (err, doc) {
      log(err, doc)
      service.isSignon(doc.token, function (err, doc) {
        log(err, doc)
        expect(err === null).to.be.ok
        done()
      })
    })
  })

  it('touch', function (done) {
    service.signon({
      id: 1
    }, function (err, doc) {
      log(err, doc)
      let token = doc.token
      setTimeout(() => {
        service.touch(token, function (err, doc2) {
          log(err, doc2)
          expect(doc2.time > doc.time).to.be.ok
          done()
        })
      },
      100)
    })
  })

  it('signout', function (done) {
    service.signon({
      id: 1
    }, function (err, doc) {
      log(err, doc)
      let token = doc.token
      service.signout(token, function (err, doc) {
        log(err, doc)
        service.isSignon(token, function (err, doc) {
          log(err, doc)
          expect(doc === Err.FA_TOKEN_INVALID).to.be.ok
          done()
        })
      })
    })
  })
})
