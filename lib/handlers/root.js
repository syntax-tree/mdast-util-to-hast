/**
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('hast').Element} HastElement
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('../index.js').H} H
 */

import {all} from '../traverse.js'
import {wrap} from '../wrap.js'

/**
 * Turn an mdast `root` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {MdastRoot} node
 *   mdast node.
 * @returns {HastRoot | HastElement}
 *   hast node.
 */
export function root(h, node) {
  /** @type {HastRoot} */
  const result = {type: 'root', children: wrap(all(h, node))}
  h.patch(node, result)
  return h.applyData(node, result)
}
