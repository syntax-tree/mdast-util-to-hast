/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Table} Table
 * @typedef {import('../index.js').H} H
 */

import {pointStart, pointEnd} from 'unist-util-position'
import {wrap} from '../wrap.js'
import {all} from '../traverse.js'

/**
 * Turn an mdast `table` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {Table} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function table(h, node) {
  const rows = all(h, node)
  const firstRow = rows.shift()
  /** @type {Array<Element>} */
  const tableContent = []

  if (firstRow) {
    /** @type {Element} */
    const head = {
      type: 'element',
      tagName: 'thead',
      properties: {},
      children: wrap([firstRow], true)
    }
    h.patch(node.children[0], head)
    tableContent.push(head)
  }

  if (rows.length > 0) {
    /** @type {Element} */
    const body = {
      type: 'element',
      tagName: 'tbody',
      properties: {},
      children: wrap(rows, true)
    }

    const start = pointStart(node.children[1])
    const end = pointEnd(node.children[node.children.length - 1])
    if (start.line && end.line) body.position = {start, end}
    tableContent.push(body)
  }

  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'table',
    properties: {},
    children: wrap(tableContent, true)
  }
  h.patch(node, result)
  return h.applyData(node, result)
}
