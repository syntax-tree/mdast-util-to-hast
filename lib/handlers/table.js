/**
 * @typedef {import('mdast').Table} Table
 * @typedef {import('mdast').TableCell} TableCell
 * @typedef {import('hast').Element} Element
 * @typedef {import('../index.js').Handler} Handler
 * @typedef {import('../index.js').Content} Content
 */

import {pointStart, pointEnd} from 'unist-util-position'
import {wrap} from '../wrap.js'
import {all} from '../traverse.js'

/**
 * @type {Handler}
 * @param {Table} node
 */
export function table(h, node) {
  var rows = node.children
  var index = rows.length
  var align = node.align || []
  /** @type {Array.<Element>} */
  var result = []
  /** @type {number} */
  var pos
  /** @type {Array.<TableCell>} */
  var row
  /** @type {Array.<Content>} */
  var out
  /** @type {string} */
  var name
  /** @type {TableCell} */
  var cell

  while (index--) {
    row = rows[index].children
    name = index === 0 ? 'th' : 'td'
    pos = node.align ? align.length : row.length
    out = []

    while (pos--) {
      cell = row[pos]
      out[pos] = h(cell, name, {align: align[pos]}, cell ? all(h, cell) : [])
    }

    result[index] = h(rows[index], 'tr', wrap(out, true))
  }

  return h(
    node,
    'table',
    wrap(
      [h(result[0].position, 'thead', wrap([result[0]], true))].concat(
        result[1]
          ? h(
              {
                start: pointStart(result[1]),
                end: pointEnd(result[result.length - 1])
              },
              'tbody',
              wrap(result.slice(1), true)
            )
          : []
      ),
      true
    )
  )
}
