/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').FootnoteDefinition} FootnoteDefinition
 * @typedef {import('mdast').Node} Node
 * @typedef {import('../state.js').State} State
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
 * @param {State} state
 *   Info passed around.
 * @param {Node} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function footnote(state, node) {
  let no = 1

  while (state.footnoteById.get(String(no))) no++

  const identifier = String(no)
  /** @type {FootnoteDefinition} */
  const definition = {
    type: 'footnoteDefinition',
    identifier,
    // @ts-expect-error: to do: remove this.
    children: [{type: 'paragraph', children: node.children}],
    position: node.position
  }

  state.footnoteById.set(identifier, definition)

  return footnoteReference(state, {
    type: 'footnoteReference',
    identifier,
    position: node.position
  })
}
