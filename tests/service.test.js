const $ = require('./service')

let service = null
beforeAll(async () => {
  await $.onReady()
  service = $
})

test('signon', async () => {
  let doc = await service.signon({
    id: 1
  })
  expect(doc.token).toBeTruthy()
})

test('verify', async () => {
  let doc = await service.signon({
    id: 1
  })
  doc = await service.verify(doc.token)
  expect(doc.token).toBeTruthy()
})

test('touch', done => {
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
              expect(doc.token).toBeTruthy()
              done()
            })
        },
        1500)
    })
})

test('signout', async () => {
  let doc = await service.signon({
    id: 1
  })
  let token = doc.token
  doc = await service.signout(token)
  try {
    doc = await service.verify(token)
    expect(doc).toBeFalsy()
  } catch (e) {
  }
})

