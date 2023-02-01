/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('../index.js').H} H
 */

import {all} from '../traverse.js'

/**
 * Turn an mdast `heading` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {Heading} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function heading(h, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'h' + node.depth,
    properties: {},
    children: all(h, node)
  }
  h.patch(node, result)
  return h.applyData(node, result)
}
