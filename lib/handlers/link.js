/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('mdast').Link} Link
 * @typedef {import('../index.js').H} H
 */

import {normalizeUri} from 'micromark-util-sanitize-uri'
import {all} from '../traverse.js'

/**
 * Turn an mdast `link` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {Link} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function link(h, node) {
  /** @type {Properties} */
  const properties = {href: normalizeUri(node.url)}

  if (node.title !== null && node.title !== undefined) {
    properties.title = node.title
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
