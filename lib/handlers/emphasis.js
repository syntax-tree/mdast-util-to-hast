/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('../state.js').State} State
 */

import {all} from '../traverse.js'

/**
 * Turn an mdast `emphasis` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Emphasis} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function emphasis(state, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'em',
    properties: {},
    children: all(state, node)
  }
  state.patch(node, result)
  return state.applyData(node, result)
}
