'use strict'

module.exports = code

var detab = require('detab')
var u = require('unist-builder')

/* Transform a code block. */
function code(h, node) {
  var value = node.value ? detab(node.value + '\n') : ''
  var lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/)
  var meta = node.meta
  var props = {}

  if (lang) {
    props.className = ['language-' + lang]
  }

  if (meta) {
    props['data-meta'] = meta
  }

  return h(node.position, 'pre', [h(node, 'code', props, [u('text', value)])])
}
