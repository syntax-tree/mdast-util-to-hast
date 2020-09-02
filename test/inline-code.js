'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('InlineCode', function (t) {
  t.deepEqual(
    to(u('inlineCode', 'juliett()')),
    u('element', {tagName: 'code', properties: {}}, [u('text', 'juliett()')]),
    'should transform `inlineCode` to a `code` element'
  )

  t.deepEqual(
    to(u('inlineCode', 'a\tb')),
    u('element', {tagName: 'code', properties: {}}, [u('text', 'a\tb')]),
    'should support tabs in inline code'
  )

  t.deepEqual(
    to(u('inlineCode', 'a\nb')),
    u('element', {tagName: 'code', properties: {}}, [u('text', 'a b')]),
    'should change eols to spaces in inline code'
  )

  t.end()
})
