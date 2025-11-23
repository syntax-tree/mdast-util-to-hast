/**
 * @import {Element, Properties} from 'hast'
 * @import {Code} from 'mdast'
 * @import {State} from '../state.js'
 */

/**
 * Turn an mdast `code` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Code} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function code(state, node) {
  const value = node.value ? node.value + '\n' : ''
  /** @type {Properties} */
  const properties = {}

  if (node.lang) {
    properties.className = ['language-' + node.lang]
  }

  // Create `<code>`.
  /** @type {Element} */
  let result = {
    type: 'element',
    tagName: 'code',
    properties,
    children: [{type: 'text', value}]
  }

  if (node.meta) {
    result.data = {meta: node.meta}
  }

  state.patch(node, result)
  result = state.applyData(node, result)

  // Create `<pre>`.
  result = {type: 'element', tagName: 'pre', properties: {}, children: [result]}
  state.patch(node, result)
  return result
}
