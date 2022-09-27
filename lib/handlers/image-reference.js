/**
 * @typedef {import('mdast').ImageReference} ImageReference
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('../index.js').Handler} Handler
 */

import {sanitizeUri} from 'micromark-util-sanitize-uri'
import {revert} from '../revert.js'

/**
 * @type {Handler}
 * @param {ImageReference} node
 */
export function imageReference(h, node) {
  const def = h.definition(node.identifier)

  if (!def) {
    return revert(h, node)
  }

  /** @type {Properties} */
  const props = {src: sanitizeUri(def.url || ''), alt: node.alt}

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title
  }

  return h(node, 'img', props)
}
