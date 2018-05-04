const chai = require('chai')
let expect = chai.expect
const config = require('../config')
const $ = require('../lib/service')
const consts = require('../lib/consts')
let Err = consts.Err

let log = function (err, doc) {
  if (err) console.error(err.stack)
  if (doc) console.log(doc)
}

let service = new $(config)
describe('service', function () {
  it('signon', async function () {
    let doc = await service.signon({
      id: 1
    })
    expect(doc.token).to.be.ok
  })

  it('verify', async function () {
    let doc = await service.signon({
      id: 1
    })
    doc = await service.verify(doc.token)
    expect(doc.token).to.be.ok
  })


  it('touch', function (done) {
    service.signon({
      id: 1,
      expire: 1,
    })
      .then(doc => {
        return service.touch(doc.token, {expire: 50})
      })
      .then(doc => {
        setTimeout(() => {
            service.verify(doc.token)
              .then(doc => {
                expect(doc.token).to.be.ok
                done()
              })
          },
          1500)
      })
  })


  it('signout', async function () {
    let doc = await service.signon({
      id: 1
    })
    let token = doc.token
    doc = await service.signout(token)
    try {
      doc = await service.verify(token)
      expect(doc).to.be.not.ok
    } catch (e) {
    }
  })
})
