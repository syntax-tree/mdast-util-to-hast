/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('../index.js').H} H
 */

import {all} from '../traverse.js'

/**
 * Turn an mdast `emphasis` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {Emphasis} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function emphasis(h, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'em',
    properties: {},
    children: all(h, node)
  }
  h.patch(node, result)
  return h.applyData(node, result)
}
