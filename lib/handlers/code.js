'use strict'

module.exports = code

var detab = require('detab')
var u = require('unist-builder')

function code(h, node) {
  var value = node.value ? detab(node.value + '\n') : ''
  var props = {}

  if (node.lang) {
    props.className = ['language-' + node.lang]
  }

  if (node.meta) {
    props.meta = node.meta
  }

  return h(node.position, 'pre', [h(node, 'code', props, [u('text', value)])])
}
