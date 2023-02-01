/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Text} Text
 * @typedef {import('mdast').Break} Break
 * @typedef {import('../index.js').H} H
 */

/**
 * Turn an mdast `break` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {Break} node
 *   mdast node.
 * @returns {Array<Element | Text>}
 *   hast element content.
 */
export function hardBreak(h, node) {
  /** @type {Element} */
  const result = {type: 'element', tagName: 'br', properties: {}, children: []}
  h.patch(node, result)
  return [h.applyData(node, result), {type: 'text', value: '\n'}]
}
