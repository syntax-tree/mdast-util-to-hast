/**
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('hast').Element} HastElement
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('../state.js').State} State
 */

import {all} from '../traverse.js'
import {wrap} from '../wrap.js'

/**
 * Turn an mdast `root` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdastRoot} node
 *   mdast node.
 * @returns {HastRoot | HastElement}
 *   hast node.
 */
export function root(state, node) {
  /** @type {HastRoot} */
  const result = {type: 'root', children: wrap(all(state, node))}
  state.patch(node, result)
  return state.applyData(node, result)
}
