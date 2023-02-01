/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('mdast').Image} Image
 * @typedef {import('../index.js').H} H
 */

import {normalizeUri} from 'micromark-util-sanitize-uri'

/**
 * Turn an mdast `image` node into hast.
 *
 * @param {H} h
 *   Info passed around.
 * @param {Image} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function image(h, node) {
  /** @type {Properties} */
  const properties = {src: normalizeUri(node.url), alt: node.alt}

  if (node.title !== null && node.title !== undefined) {
    properties.title = node.title
  }

  /** @type {Element} */
  const result = {type: 'element', tagName: 'img', properties, children: []}
  h.patch(node, result)
  return h.applyData(node, result)
}
