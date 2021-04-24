/**
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('../index.js').Handler} Handler
 */

import {all} from '../all.js'

/**
 * @type {Handler}
 * @param {Paragraph} node
 */
export function paragraph(h, node) {
  return h(node, 'p', all(h, node))
}
