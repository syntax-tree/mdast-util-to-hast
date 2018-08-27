'use strict'

module.exports = listItem

var u = require('unist-builder')
var wrap = require('../wrap')
var all = require('../all')

/* Transform a list-item. */
function listItem(h, node) {
  var children = node.children
  var head = children[0]
  var props = {}
  var result = all(h, node)

  if (typeof node.checked === 'boolean') {
    if (!head || head.type !== 'paragraph') {
      result.unshift(h(null, 'p', []))
    }

    if (result.length !== 0) {
      result.unshift(u('text', ' '))
    }

    result.unshift(
      h(null, 'input', {
        type: 'checkbox',
        checked: node.checked,
        disabled: true
      })
    )

    /* According to github-markdown-css, this class hides bullet. */
    props.className = ['task-list-item']
  }

  if (result.length > 1) {
    result = wrap(result, true)
  }

  return h(node, 'li', props, result)
}
