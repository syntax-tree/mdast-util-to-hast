/**
 * @typedef {import('hast').ElementContent} HastElementContent
 * @typedef {import('hast').Element} HastElement
 * @typedef {import('hast').Text} HastText
 *
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('mdast').Parent} MdastParent
 * @typedef {import('mdast').Root} MdastRoot
 *
 * @typedef {import('./index.js').H} H
 */

/**
 * @typedef {MdastRoot | MdastContent} MdastNodes
 * @typedef {Extract<MdastNodes, MdastParent>} MdastParents
 */

const own = {}.hasOwnProperty

/**
 * Transform an mdast node into a hast node.
 *
 * @param {H} h
 *   Info passed around.
 * @param {MdastNodes} node
 *   mdast node.
 * @param {MdastParents | null | undefined} [parent]
 *   Parent of `node`.
 * @returns {HastElementContent | Array<HastElementContent> | null | undefined}
 *   Resulting hast node.
 */
export function one(h, node, parent) {
  const type = node && node.type

  // Fail on non-nodes.
  if (!type) {
    throw new Error('Expected node, got `' + node + '`')
  }

  if (own.call(h.handlers, type)) {
    return h.handlers[type](h, node, parent)
  }

  if (h.passThrough && h.passThrough.includes(type)) {
    // @ts-expect-error: types of passed through nodes are expected to be added manually.
    return 'children' in node ? {...node, children: all(h, node)} : node
  }

  if (h.unknownHandler) {
    return h.unknownHandler(h, node, parent)
  }

  return unknown(h, node)
}

/**
 * Transform the children of an mdast node into hast nodes.
 *
 * @param {H} h
 *   Info passed around.
 * @param {MdastNodes} parent
 *   mdast node to compile
 * @returns {Array<HastElementContent>}
 *   Resulting hast nodes.
 */
export function all(h, parent) {
  /** @type {Array<HastElementContent>} */
  const values = []

  if ('children' in parent) {
    const nodes = parent.children
    let index = -1

    while (++index < nodes.length) {
      const result = one(h, nodes[index], parent)

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
 * @param {H} h
 *   Info passed around.
 * @param {MdastNodes} node
 *   Unknown mdast node.
 * @returns {HastText | HastElement}
 *   Resulting hast node.
 */
function unknown(h, node) {
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
          children: all(h, node)
        }

  h.patch(node, result)
  return h.applyData(node, result)
}
