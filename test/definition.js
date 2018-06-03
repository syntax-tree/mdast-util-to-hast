'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('Definition', function(t) {
  t.equal(
    to(
      u('definition', {
        url: 'http://uniform.whiskey',
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
        u('definition', {identifier: 'alpha', url: 'http://charlie.com'}),
        u('definition', {identifier: 'alpha', url: 'http://delta.com'})
      ])
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u('element', {tagName: 'a', properties: {href: 'http://delta.com'}}, [
        u('text', 'bravo')
      ])
    ]),
    'should prefer the last definition by default'
  )

  t.deepEqual(
    to(
      u('paragraph', [
        u('linkReference', {identifier: 'alpha'}, [u('text', 'bravo')]),
        u('definition', {identifier: 'alpha', url: 'http://charlie.com'}),
        u('definition', {identifier: 'alpha', url: 'http://delta.com'})
      ]),
      {commonmark: true}
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u('element', {tagName: 'a', properties: {href: 'http://charlie.com'}}, [
        u('text', 'bravo')
      ])
    ]),
    'should prefer the first definition in commonmark mode'
  )

  t.end()
})
