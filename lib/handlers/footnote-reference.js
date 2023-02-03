/**
 * @typedef {import('mdast').FootnoteReference} FootnoteReference
 * @typedef {import('hast').Element} Element
 * @typedef {import('../index.js').H} H
 */

import {normalizeUri} from 'micromark-util-sanitize-uri'

/**
 * Turn an mdast `footnoteReference` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {FootnoteReference} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function footnoteReference(h, node) {
  const id = String(node.identifier)
  const safeId = normalizeUri(id.toLowerCase())
  const index = h.footnoteOrder.indexOf(id)
  /** @type {number} */
  let counter

  if (index === -1) {
    h.footnoteOrder.push(id)
    h.footnoteCounts[id] = 1
    counter = h.footnoteOrder.length
  } else {
    h.footnoteCounts[id]++
    counter = index + 1
  }

  const reuseCounter = h.footnoteCounts[id]

  /** @type {Element} */
  const link = {
    type: 'element',
    tagName: 'a',
    properties: {
      href: '#' + h.clobberPrefix + 'fn-' + safeId,
      id:
        h.clobberPrefix +
        'fnref-' +
        safeId +
        (reuseCounter > 1 ? '-' + reuseCounter : ''),
      dataFootnoteRef: true,
      ariaDescribedBy: ['footnote-label']
    },
    children: [{type: 'text', value: String(counter)}]
  }
  h.patch(node, link)

  /** @type {Element} */
  const sup = {
    type: 'element',
    tagName: 'sup',
    properties: {},
    children: [link]
  }
  h.patch(node, sup)
  return h.applyData(node, sup)
}
