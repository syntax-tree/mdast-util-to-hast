/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').HTML} Html
 * @typedef {import('../index.js').H} H
 * @typedef {import('../../index.js').Raw} Raw
 */

/**
 * Turn an mdast `html` node into hast (`raw` node in dangerous mode, otherwise
 * nothing).
 *
 * @param {H} h
 *   Info passed around.
 * @param {Html} node
 *   mdast node.
 * @returns {Raw | Element | null}
 *   hast node.
 */
export function html(h, node) {
  if (h.dangerous) {
    /** @type {Raw} */
    const result = {type: 'raw', value: node.value}
    h.patch(node, result)
    return h.applyData(node, result)
  }

  // To do: next major: return `undefined`.
  return null
}
