'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('Nodes', function(t) {
  t.deepEqual(to(u('text', 'alpha')), u('text', 'alpha'), 'should map `text`s')

  t.end()
})
