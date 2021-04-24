/**
 * @typedef {import('mdast').Strong} Strong
 * @typedef {import('../index.js').Handler} Handler
 */

import {all} from '../all.js'

/**
 * @type {Handler}
 * @param {Strong} node
 */
export function strong(h, node) {
  return h(node, 'strong', all(h, node))
}
