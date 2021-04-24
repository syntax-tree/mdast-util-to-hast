/**
 * @typedef {import('mdast').ThematicBreak} ThematicBreak
 * @typedef {import('../index.js').Handler} Handler
 */

/**
 * @type {Handler}
 * @param {ThematicBreak} [node]
 */
export function thematicBreak(h, node) {
  return h(node, 'hr')
}
