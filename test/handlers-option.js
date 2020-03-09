'use strict'

var test = require('tape')
var u = require('unist-builder')
var all = require('../lib/all')
var to = require('..')

test('handlers option', function(t) {
  var handlers = {
    paragraph: function(h, node) {
      node.children[0].value = 'changed'
      return h(node, 'p', all(h, node))
    }
  }

  t.deepEqual(
    to(u('paragraph', [u('text', 'bravo')]), {handlers: handlers}),
    u('element', {tagName: 'p', properties: {}}, [u('text', 'changed')]),
    'should override default handler'
  )

  var mdastWithMetaNode = u('paragraph', [
    u('meta-node', 'meta'),
    u('text', 'bravo')
  ])

  t.deepEqual(
    to(mdastWithMetaNode, {}),
    u('element', {tagName: 'p', properties: {}}, [
      u('text', 'meta'),
      u('text', 'bravo')
    ]),
    'should use default unknown-handler'
  )

  t.deepEqual(
    to(mdastWithMetaNode, {
      unknownHandler: function(n, node) {
        return node
      }
    }),
    u('element', {tagName: 'p', properties: {}}, [
      u('meta-node', 'meta'),
      u('text', 'bravo')
    ]),
    'should use custom unknown-handler'
  )

  t.end()
})
