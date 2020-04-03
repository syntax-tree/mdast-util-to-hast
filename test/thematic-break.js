'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('ThematicBreak', function (t) {
  t.deepEqual(
    to(u('thematicBreak')),
    u('element', {tagName: 'hr', properties: {}}, []),
    'should transform `thematicBreak` to `hr`'
  )

  t.end()
})
