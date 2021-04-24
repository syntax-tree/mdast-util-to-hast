/**
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('../index.js').Handler} Handler
 */

import {u} from 'unist-builder'

/**
 * Return either a `raw` node in dangerous mode, otherwise nothing.
 *
 * @type {Handler}
 * @param {HTML} node
 */
export function html(h, node) {
  // @ts-ignore non-standard raw nodes.
  return h.dangerous ? h.augment(node, u('raw', node.value)) : null
}
