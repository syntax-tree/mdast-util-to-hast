/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').TableCell} TableCell
 * @typedef {import('../index.js').H} H
 */

import {all} from '../traverse.js'

/**
 * Turn an mdast `tableCell` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {TableCell} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function tableCell(h, node) {
  // Note: this function is normally not called: see `table-row` for how rows
  // and their cells are compiled.
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'td', // Assume body cell.
    properties: {},
    children: all(h, node)
  }
  h.patch(node, result)
  return h.applyData(node, result)
}
