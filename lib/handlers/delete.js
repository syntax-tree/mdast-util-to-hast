/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Delete} Delete
 * @typedef {import('../state.js').State} State

 */

import {all} from '../traverse.js'

/**
 * Turn an mdast `delete` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Delete} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function strikethrough(state, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'del',
    properties: {},
    children: all(state, node)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}
