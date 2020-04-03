'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('Delete', function (t) {
  t.deepEqual(
    to(u('delete', [u('text', 'foxtrot')])),
    u('element', {tagName: 'del', properties: {}}, [u('text', 'foxtrot')]),
    'should transform `delete` to `del`'
  )

  t.end()
})
