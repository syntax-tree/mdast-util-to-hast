/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Footnote} Footnote
 * @typedef {import('../index.js').H} H
 */

import {footnoteReference} from './footnote-reference.js'

// To do: when both:
// * <https://github.com/micromark/micromark-extension-footnote>
// * <https://github.com/syntax-tree/mdast-util-footnote>
// …are archived, remove this (also from mdast).
// These inline notes are not used in GFM.

/**
 * Turn an mdast `footnote` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {Footnote} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function footnote(h, node) {
  const footnoteById = h.footnoteById
  let no = 1

  while (no in footnoteById) no++

  const identifier = String(no)

  footnoteById[identifier] = {
    type: 'footnoteDefinition',
    identifier,
    children: [{type: 'paragraph', children: node.children}],
    position: node.position
  }

  return footnoteReference(h, {
    type: 'footnoteReference',
    identifier,
    position: node.position
  })
}
