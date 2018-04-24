const chai = require('chai')
let expect = chai.expect
const config = require('../config')
const $ = require('../lib')

let log = function (err, doc) {
  if (err) console.error(err.stack)
  if (doc) console.log(doc)
}

let service = new $(config)
let router = service.router()
describe('router', function () {
  it('signon', function (done) {
    router.post('/signon', {id: 1}, function (err, doc) {
      log(err, doc)
      expect(err === null).to.be.ok
      done()
    })
  })

  it('isSignon', function (done) {
    router.post('/signon', {id: 1}, function (err, doc) {
      log(err, doc)
      let token = doc.token
      router.get('/isSignon', {token}, function (err, doc) {
        log(err, doc)
        expect(err === null).to.be.ok
        done()
      })
    })
  })

  it('touch', function (done) {
    router.post('/signon', {id: 1}, function (err, doc) {
      log(err, doc)
      let token = doc.token
      setTimeout(() => {
        router.get('/touch', {token}, function (err, doc2) {
          log(err, doc2)
          expect(doc2.time > doc.time).to.be.ok
          done()
        })
      },
      100)
    })
  })

  it('signout', function (done) {
    router.post('/signon', {id: 1}, function (err, doc) {
      log(err, doc)
      let token = doc.token
      router.get('/signout', {token}, function (err, doc) {
        log(err, doc)
        expect(doc.ret).to.be.ok
        done()
      })
    })
  })
})
