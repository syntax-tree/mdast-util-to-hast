/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('../index.js').H} H
 */

import {wrap} from '../wrap.js'
import {all} from '../traverse.js'

/**
 * Turn an mdast `blockquote` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {Blockquote} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function blockquote(h, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'blockquote',
    properties: {},
    children: wrap(all(h, node), true)
  }
  h.patch(node, result)
  return h.applyData(node, result)
}
