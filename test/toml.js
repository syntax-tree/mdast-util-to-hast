'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('TOML', function(t) {
  t.equal(to(u('toml', 'kilo: "lima"')), null, 'should ignore `toml`')

  t.end()
})
