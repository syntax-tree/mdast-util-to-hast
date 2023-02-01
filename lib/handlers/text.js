/**
 * @typedef {import('hast').Element} HastElement
 * @typedef {import('hast').Text} HastText
 * @typedef {import('mdast').Text} MdastText
 * @typedef {import('../index.js').H} H
 */

import {trimLines} from 'trim-lines'

/**
 * Turn an mdast `text` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {MdastText} node
 *   mdast node.
 * @returns {HastText | HastElement}
 *   hast node.
 */
export function text(h, node) {
  /** @type {HastText} */
  const result = {type: 'text', value: trimLines(String(node.value))}
  h.patch(node, result)
  return h.applyData(node, result)
}
