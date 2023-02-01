/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').ThematicBreak} ThematicBreak
 * @typedef {import('../index.js').H} H
 */

/**
 * Turn an mdast `thematicBreak` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {ThematicBreak} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function thematicBreak(h, node) {
  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'hr',
    properties: {},
    children: []
  }
  h.patch(node, result)
  return h.applyData(node, result)
}
