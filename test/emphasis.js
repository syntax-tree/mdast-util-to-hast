'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('Emphasis', function (t) {
  t.deepEqual(
    to(u('emphasis', [u('text', 'delta')])),
    u('element', {tagName: 'em', properties: {}}, [u('text', 'delta')]),
    'should transform `emphasis` to `em`'
  )

  t.end()
})
