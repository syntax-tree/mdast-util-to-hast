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

  var customMdast = u('paragraph', [
    u('custom', 'with value'),
    u('custom', [u('image', {url: 'with-children.png'})]),
    u('text', 'bravo')
  ])

  t.deepEqual(
    to(customMdast, {}),
    u('element', {tagName: 'p', properties: {}}, [
      u('text', 'with value'),
      u('element', {tagName: 'div', properties: {}}, [
        u(
          'element',
          {
            tagName: 'img',
            properties: {src: 'with-children.png', alt: undefined}
          },
          []
        )
      ]),
      u('text', 'bravo')
    ]),
    'should use default unknown-handler'
  )

  t.deepEqual(
    to(customMdast, {
      unknownHandler: function(n, node) {
        return node
      }
    }),
    u('element', {tagName: 'p', properties: {}}, [
      u('custom', 'with value'),
      u('custom', [u('image', {url: 'with-children.png'})]),
      u('text', 'bravo')
    ]),
    'should use custom unknown-handler'
  )

  t.end()
})
