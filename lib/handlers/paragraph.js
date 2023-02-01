/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('../index.js').H} H
 */

import {all} from '../traverse.js'

/**
 * Turn an mdast `paragraph` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {Paragraph} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function paragraph(h, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'p',
    properties: {},
    children: all(h, node)
  }
  h.patch(node, result)
  return h.applyData(node, result)
}
