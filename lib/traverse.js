/**
 * @typedef {import('hast').ElementContent} HastElementContent
 * @typedef {import('hast').Element} HastElement
 * @typedef {import('hast').Text} HastText
 *
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('mdast').Parent} MdastParent
 * @typedef {import('mdast').Root} MdastRoot
 *
 * @typedef {import('./state.js').State} State
 */

/**
 * @typedef {MdastRoot | MdastContent} MdastNodes
 * @typedef {Extract<MdastNodes, MdastParent>} MdastParents
 */

const own = {}.hasOwnProperty

/**
 * Transform an mdast node into a hast node.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdastNodes} node
 *   mdast node.
 * @param {MdastParents | null | undefined} [parent]
 *   Parent of `node`.
 * @returns {HastElementContent | Array<HastElementContent> | null | undefined}
 *   Resulting hast node.
 */
export function one(state, node, parent) {
  const type = node && node.type

  // Fail on non-nodes.
  if (!type) {
    throw new Error('Expected node, got `' + node + '`')
  }

  if (own.call(state.handlers, type)) {
    return state.handlers[type](state, node, parent)
  }

  if (state.passThrough && state.passThrough.includes(type)) {
    // To do: next major: deep clone.
    // @ts-expect-error: types of passed through nodes are expected to be added manually.
    return 'children' in node ? {...node, children: all(state, node)} : node
  }

  if (state.unknownHandler) {
    return state.unknownHandler(state, node, parent)
  }

  return unknown(state, node)
}

/**
 * Transform the children of an mdast node into hast nodes.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdastNodes} parent
 *   mdast node to compile
 * @returns {Array<HastElementContent>}
 *   Resulting hast nodes.
 */
export function all(state, parent) {
  /** @type {Array<HastElementContent>} */
  const values = []

  if ('children' in parent) {
    const nodes = parent.children
    let index = -1
    while (++index < nodes.length) {
      const result = one(state, nodes[index], parent)

      // To do: see if we van clean this? Can we merge texts?
      if (result) {
        if (index && nodes[index - 1].type === 'break') {
          if (!Array.isArray(result) && result.type === 'text') {
            result.value = result.value.replace(/^\s+/, '')
          }

          if (!Array.isArray(result) && result.type === 'element') {
            const head = result.children[0]

            if (head && head.type === 'text') {
              head.value = head.value.replace(/^\s+/, '')
            }
          }
        }

        if (Array.isArray(result)) {
          values.push(...result)
        } else {
          values.push(result)
        }
      }
    }
  }

  return values
}

/**
 * Transform an unknown node.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdastNodes} node
 *   Unknown mdast node.
 * @returns {HastText | HastElement}
 *   Resulting hast node.
 */
function unknown(state, node) {
  const data = node.data || {}
  /** @type {HastText | HastElement} */
  const result =
    'value' in node &&
    !(own.call(data, 'hProperties') || own.call(data, 'hChildren'))
      ? {type: 'text', value: node.value}
      : {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: all(state, node)
        }

  state.patch(node, result)
  return state.applyData(node, result)
}
