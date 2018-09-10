'use strict'

module.exports = listItem

var u = require('unist-builder')
var wrap = require('../wrap')
var all = require('../all')

/* Transform a list-item. */
function listItem(h, node, parent) {
  var children = node.children
  var head = children[0]
  var props = {}
  var result = all(h, node)
  var container

  /* A list item is loose if its parent list is loose, or if it directly
   * contains two block-level elements */
  var loose = false;
  if (parent) {
    loose = !!parent.loose;
  } else if (children.length > 1) {
    loose = true;
  }

  /* Tight lists should not render 'paragraph' nodes as 'p' tags */
  if (!loose) {
    for (var i = 0; i < result.length; i++) {
      if (result[i].tagName === 'p') {
        var len = result[i].children.length
        result.splice(i, 1, ...result[i].children)
        i += len - 1
      }
    }
  }

  if (typeof node.checked === 'boolean') {
    if (loose && (!head || head.type !== 'paragraph')) {
      result.unshift(h(null, 'p', []))
    }

    container = loose ? result[0].children : result

    if (container.length !== 0) {
      container.unshift(u('text', ' '))
    }

    container.unshift(
      h(null, 'input', {
        type: 'checkbox',
        checked: node.checked,
        disabled: true
      })
    )

    /* According to github-markdown-css, this class hides bullet. */
    props.className = ['task-list-item']
  }

  if (loose && result.length !== 0) {
    result = wrap(result, true)
  }

  return h(node, 'li', props, result)
}
