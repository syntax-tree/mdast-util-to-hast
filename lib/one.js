/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('mdast').Literal} Literal
 * @typedef {import('mdast').Text} Text
 * @typedef {import('./index.js').H} H
 * @typedef {import('./index.js').Handler} Handler
 */

import {u} from 'unist-builder'
import {all} from './all.js'

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
