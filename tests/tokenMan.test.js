const $ = require('./service')

let service = null
beforeAll(async () => {
  await $.onReady()
  service = $.tokenMan
})

test('add and check', async () => {
  let doc = await service.add({
    id: 1,
    name: 'jeff'
  })
  doc = await service.verify(doc.token)
  expect(doc.token).toBeTruthy()
})

test('delete', async () => {
  let doc = await service.add({
    id: 1,
    name: 'jeff'
  })
  let token = doc.token
  doc = await service.delete(token)
  try {
    doc = await service.verify(token)
    expect(doc).toBeFalsy()
  } catch (e) {
  }
})

test('expire', done => {
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
          .catch(e => {
            done()
          })
      }, 1500)

    })
})

test('touch', done => {
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
            expect(doc).toBeTruthy()
            done()
          })
      }, 1500)
    })
})
