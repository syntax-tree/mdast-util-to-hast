/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('mdast').Literal} Literal
 * @typedef {import('mdast').Text} Text
 * @typedef {import('./index.js').H} H
 * @typedef {import('./index.js').Handler} Handler
 * @typedef {import('./index.js').Content} Content
 */

import {u} from 'unist-builder'

var own = {}.hasOwnProperty

/**
 * Transform an unknown node.
 * @type {Handler}
 */
function unknown(h, node) {
  if (text(node)) {
    return h.augment(node, u('text', node.value))
  }

  return h(node, 'div', all(h, node))
}

/**
 * @type {Handler}
 */
export function one(h, node, parent) {
  var type = node && node.type
  /** @type {Handler} */
  var fn

  // Fail on non-nodes.
  if (!type) {
    throw new Error('Expected node, got `' + node + '`')
  }

  if (own.call(h.handlers, type)) {
    fn = h.handlers[type]
  } else if (h.passThrough && h.passThrough.includes(type)) {
    fn = returnNode
  } else {
    fn = h.unknownHandler
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent)
}

/**
 * Check if the node should be renderered as a text node.
 * @param {Node} node
 * @returns {node is Literal}
 */
function text(node) {
  var data = node.data || {}

  if (
    own.call(data, 'hName') ||
    own.call(data, 'hProperties') ||
    own.call(data, 'hChildren')
  ) {
    return false
  }

  return 'value' in node
}

/**
 * @type {Handler}
 */
function returnNode(h, node) {
  // @ts-ignore pass through any unknown node.
  return node.children ? {...node, children: all(h, node)} : node
}

/**
 * @param {H} h
 * @param {Node} parent
 */
export function all(h, parent) {
  /** @type {Array.<Node>} */
  // @ts-ignore looks like a parent.
  var nodes = parent.children || []
  var index = -1
  /** @type {Array.<Content>} */
  var values = []
  /** @type {Content} */
  var result
  /** @type {Content} */
  var head

  while (++index < nodes.length) {
    // @ts-ignore looks like a parent.
    result = one(h, nodes[index], parent)

    if (result) {
      if (index && nodes[index - 1].type === 'break') {
        if (result.type === 'text') {
          result.value = result.value.replace(/^\s+/, '')
        }

        if (result.type === 'element') {
          head = result.children[0]

          if (head && head.type === 'text') {
            head.value = head.value.replace(/^\s+/, '')
          }
        }
      }

      values = values.concat(result)
    }
  }

  return values
}
