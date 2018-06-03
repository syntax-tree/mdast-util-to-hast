'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('Blockquote', function(t) {
  t.deepEqual(
    to(
      u('blockquote', [
        u('paragraph', [u('text', 'charlie')]),
        u('paragraph', [u('text', 'delta')])
      ])
    ),
    u('element', {tagName: 'blockquote', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [u('text', 'charlie')]),
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [u('text', 'delta')]),
      u('text', '\n')
    ]),
    'should transform `blockquote` to a `blockquote` element'
  )

  t.end()
})
