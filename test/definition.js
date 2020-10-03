'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('Definition', function (t) {
  t.equal(
    to(
      u('definition', {
        url: 'https://uniform.whiskey',
        identifier: 'x-ray',
        title: 'yankee'
      })
    ),
    null,
    'should ignore `definition`'
  )

  t.deepEqual(
    to(
      u('paragraph', [
        u('linkReference', {identifier: 'alpha'}, [u('text', 'bravo')]),
        u('definition', {identifier: 'alpha', url: 'https://charlie.com'}),
        u('definition', {identifier: 'alpha', url: 'https://delta.com'})
      ])
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u('element', {tagName: 'a', properties: {href: 'https://charlie.com'}}, [
        u('text', 'bravo')
      ])
    ]),
    'should prefer the first definition by default'
  )

  t.end()
})
