/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').ElementContent} ElementContent
 * @typedef {import('mdast').Table} Table
 * @typedef {import('mdast').TableCell} TableCell
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
  let index = -1
  const align = node.align || []
  /** @type {Array<Element>} */
  const rows = []

  while (++index < node.children.length) {
    const row = node.children[index]
    const tagName = index === 0 ? 'th' : 'td'
    const length = node.align ? align.length : row.children.length
    let cellIndex = -1
    /** @type {Array<ElementContent>} */
    const cells = []

    while (++cellIndex < length) {
      // Note: can also be undefined.
      const cell = row.children[cellIndex]

      /** @type {Element} */
      let result = {
        type: 'element',
        tagName,
        properties: {align: align[cellIndex]},
        children: []
      }

      if (cell) {
        result.children = all(h, cell)
        h.patch(cell, result)
        result = h.applyData(node, result)
      }

      cells.push(result)
    }

    /** @type {Element} */
    const result = {
      type: 'element',
      tagName: 'tr',
      properties: {},
      children: wrap(cells, true)
    }
    h.patch(row, result)
    rows.push(h.applyData(row, result))
  }

  // Always one row:
  /** @type {Element} */
  const head = {
    type: 'element',
    tagName: 'thead',
    properties: {},
    children: wrap([rows[0]], true)
  }
  h.patch(node.children[0], head)

  const tableContent = [head]

  if (rows.length > 1) {
    /** @type {Element} */
    const body = {
      type: 'element',
      tagName: 'tbody',
      properties: {},
      children: wrap(rows.slice(1), true)
    }

    const start = pointStart(node.children[1])
    const end = pointEnd(node.children[node.children.length - 1])
    if (start.line && end.line) {
      body.position = {start, end}
    }

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
