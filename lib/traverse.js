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

const own = {}.hasOwnProperty

/**
 * Transform an unknown node.
 * @type {Handler}
 * @param {Node} node
 */
function unknown(h, node) {
  if (text(node)) {
    return h.augment(node, u('text', node.value))
  }

  return h(node, 'div', all(h, node))
}

/**
 * @type {Handler}
 * @param {Node} node
 */
export function one(h, node, parent) {
  const type = node && node.type
  /** @type {Handler} */
  let fn

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
  const data = node.data || {}

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
 * @param {unknown} node
 */
function returnNode(h, node) {
  // @ts-expect-error pass through any unknown node.
  return node.children ? {...node, children: all(h, node)} : node
}

/**
 * @param {H} h
 * @param {Node} parent
 */
export function all(h, parent) {
  /** @type {Array.<Node>} */
  // @ts-expect-error looks like a parent.
  const nodes = parent.children || []
  /** @type {Array.<Content>} */
  const values = []
  let index = -1

  while (++index < nodes.length) {
    // @ts-expect-error looks like a parent.
    const result = one(h, nodes[index], parent)

    if (result) {
      if (index && nodes[index - 1].type === 'break') {
        if (!Array.isArray(result) && result.type === 'text') {
          result.value = result.value.replace(/^\s+/, '')
        }

        if (!Array.isArray(result) && result.type === 'element') {
          const head = result.children[0]

          if (head && head.type === 'text') {
            head.value = head.value.replace(/^\s+/, '')
          }
        }
      }

      if (Array.isArray(result)) {
        values.push(...result)
      } else {
        values.push(result)
      }
    }
  }

  return values
}
