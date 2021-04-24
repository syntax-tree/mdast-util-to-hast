/**
 * @typedef {import('mdast').ImageReference} ImageReference
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('../index.js').Handler} Handler
 */

import normalize from 'mdurl/encode.js'
import {revert} from '../revert.js'

/**
 * @type {Handler}
 * @param {ImageReference} node
 */
export function imageReference(h, node) {
  var def = h.definition(node.identifier)
  /** @type {Properties} */
  var props

  if (!def) {
    return revert(h, node)
  }

  props = {src: normalize(def.url || ''), alt: node.alt}

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title
  }

  return h(node, 'img', props)
}
