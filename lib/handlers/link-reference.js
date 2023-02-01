/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').ElementContent} ElementContent
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('mdast').LinkReference} LinkReference
 * @typedef {import('../index.js').H} H
 */

import {normalizeUri} from 'micromark-util-sanitize-uri'
import {revert} from '../revert.js'
import {all} from '../traverse.js'

/**
 * Turn an mdast `linkReference` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {LinkReference} node
 *   mdast node.
 * @returns {ElementContent | Array<ElementContent>}
 *   hast node.
 */
export function linkReference(h, node) {
  const def = h.definition(node.identifier)

  if (!def) {
    return revert(h, node)
  }

  /** @type {Properties} */
  const properties = {href: normalizeUri(def.url || '')}

  if (def.title !== null && def.title !== undefined) {
    properties.title = def.title
  }

  /** @type {Element} */
  const result = {
    type: 'element',
    tagName: 'a',
    properties,
    children: all(h, node)
  }
  h.patch(node, result)
  return h.applyData(node, result)
}
