/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Strong} Strong
 * @typedef {import('../index.js').H} H
 */

import {all} from '../traverse.js'

/**
 * Turn an mdast `strong` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {Strong} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function strong(h, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'strong',
    properties: {},
    children: all(h, node)
  }
  h.patch(node, result)
  return h.applyData(node, result)
}
