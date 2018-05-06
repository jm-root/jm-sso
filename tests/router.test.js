const $ = require('./service')

let router = null
beforeAll(async () => {
  await $.onReady()
  router = $.router()
})

let signon = async (opts = {id: 1}) => {
  let doc = await router.post('/signon', {id: 1})
  return doc
}

test('signon', async () => {
  let doc = await signon()
  expect(doc.token).toBeTruthy()
})

test('isSignon', async () => {
  let doc = await signon()
  let token = doc.token
  doc = await router.get('/isSignon', {token})
  expect(doc.token).toBeTruthy()
})

test('touch', async () => {
  let doc = await signon()
  let token = doc.token
  let doc2 = await router.get('/touch', {token: token, data: {name: 'jeff'}})
  expect(doc2.time > doc.time).toBeTruthy()
})

test('signout', async () => {
  let doc = await signon()
  let token = doc.token
  doc = await router.get('/signout', {token})
})

