/**
 * @typedef {import('mdast').FootnoteReference} FootnoteReference
 * @typedef {import('../index.js').Handler} Handler
 */

import {u} from 'unist-builder'

/**
 * @type {Handler}
 * @param {FootnoteReference} node
 */
export function footnoteReference(h, node) {
  var footnoteOrder = h.footnoteOrder
  var identifier = String(node.identifier)
  var index = footnoteOrder.indexOf(identifier)
  var marker = String(index === -1 ? footnoteOrder.push(identifier) : index + 1)

  return h(
    node,
    'a',
    {
      href: '#fn' + marker,
      className: ['footnote-ref'],
      id: 'fnref' + marker,
      role: 'doc-noteref'
    },
    [h(node.position, 'sup', [u('text', marker)])]
  )
}
