'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('Strong', function (t) {
  t.deepEqual(
    to(u('strong', [u('text', 'echo')])),
    u('element', {tagName: 'strong', properties: {}}, [u('text', 'echo')]),
    'should transform `strong` to `strong`'
  )

  t.end()
})
