'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('Code', function(t) {
  t.deepEqual(
    to(u('code', 'foxtrot()\ngolf.hotel()')),
    u('element', {tagName: 'pre', properties: {}}, [
      u('element', {tagName: 'code', properties: {}}, [
        u('text', 'foxtrot()\ngolf.hotel()\n')
      ])
    ]),
    'should transform `code` to a `pre` element (#1)'
  )

  t.deepEqual(
    to(u('code', '')),
    u('element', {tagName: 'pre', properties: {}}, [
      u('element', {tagName: 'code', properties: {}}, [u('text', '')])
    ]),
    'should transform `code` to a `pre` element (#2)'
  )

  t.deepEqual(
    to(u('code', {lang: 'js'}, 'india()')),
    u('element', {tagName: 'pre', properties: {}}, [
      u(
        'element',
        {tagName: 'code', properties: {className: ['language-js']}},
        [u('text', 'india()\n')]
      )
    ]),
    'should transform `code` to a `pre` element with language class'
  )

  t.end()
})
