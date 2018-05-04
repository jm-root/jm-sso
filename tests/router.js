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
let signon = async (opts = {id: 1}) => {
  let doc = await router.post('/signon', {id: 1})
  return doc
}
describe('router', function () {
  it('signon', async function () {
    let doc = await signon()
    expect(doc.token).to.be.ok
  })

  it('isSignon', async function () {
    let doc = await signon()
    let token = doc.token
    doc = await router.get('/isSignon', {token})
    expect(doc.token).to.be.ok
  })

  it('touch', async function () {
    let doc = await signon()
    let token = doc.token
    let doc2 = await router.get('/touch', {token})
    expect(doc2.time > doc.time).to.be.ok
  })

  it('signout', async function () {
    let doc = await signon()
    let token = doc.token
    doc = await router.get('/signout', {token})
  })
})
