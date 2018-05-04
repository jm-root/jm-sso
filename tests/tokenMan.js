const chai = require('chai')
let expect = chai.expect
const config = require('../config')
const $ = require('../lib/service/tokenMan')
const consts = require('../lib/consts')
let Err = consts.Err

let log = function (err, doc) {
  if (err)
    console.error(err.stack)
  if (doc) console.log(doc)
}

let service = new $(config)
describe('tokenMan', function () {
  it('add and check', async function () {
    let doc = await service.add({
      id: 1,
      name: 'jeff'
    })
    doc = await service.verify(doc.token)
    expect(doc.token).to.be.ok
  })

  it('delete', async function () {
    let doc = await service.add({
      id: 1,
      name: 'jeff'
    })
    let token = doc.token
    doc = await service.delete(token)
    try {
      doc = await service.verify(token)
      expect(doc).to.be.not.ok
    } catch (e) {
    }
  })

  it('expire', function (done) {
    service.add({
      id: 1,
      expire: 1,
      name: 'jeff'
    })
      .then(function (doc) {
        setTimeout(function () {
          service.verify(doc.token)
            .then(function (doc) {
            })
            .catch(e=>{
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
    })
      .then(function (doc) {
        return service.touch(doc.token, {expire: 500, value: 'abc', name: 'jeff2'})
      })
      .then(function (doc) {
        setTimeout(function () {
          service.verify(doc.token)
            .then(function (doc) {
              expect(doc).to.be.ok
              done()
            })
        }, 1500)
      })
  })
})
