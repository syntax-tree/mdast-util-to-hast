'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('HTML', function(t) {
  t.equal(to(u('html', '<mike></mike>')), null, 'should ignore `html`')

  t.deepEqual(
    to(u('html', '<mike></mike>'), {allowDangerousHTML: true}),
    u('raw', '<mike></mike>'),
    'should transform `html` to `raw` if `allowDangerousHTML` is given'
  )

  t.end()
})
