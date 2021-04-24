/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('mdast').Break} Break
 * @typedef {import('../index.js').Handler} Handler
 */

import {u} from 'unist-builder'

/**
 * @type {Handler}
 * @param {Break} node
 * @returns {Array.<Node>}
 */
export function hardBreak(h, node) {
  return [h(node, 'br'), u('text', '\n')]
}
