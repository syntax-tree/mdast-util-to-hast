/**
 * @typedef {import('hast').ElementContent} ElementContent
 */

/**
 * Wrap `nodes` with line endings between each node.
 *
 * @param {Array<ElementContent>} nodes
 *   List of nodes to wrap.
 * @param {boolean | null | undefined} [loose=false]
 *   Whether to add line endings at start and end.
 * @returns {Array<ElementContent>}
 *   Wrapped nodes.
 */
export function wrap(nodes, loose) {
  /** @type {Array<ElementContent>} */
  const result = []
  let index = -1

  if (loose) {
    result.push({type: 'text', value: '\n'})
  }

  while (++index < nodes.length) {
    if (index) result.push({type: 'text', value: '\n'})
    result.push(nodes[index])
  }

  if (loose && nodes.length > 0) {
    result.push({type: 'text', value: '\n'})
  }

  return result
}
