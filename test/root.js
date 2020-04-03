'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('Root', function (t) {
  t.deepEqual(to(u('root', [])), u('root', []), 'should map `root`s')

  t.end()
})
