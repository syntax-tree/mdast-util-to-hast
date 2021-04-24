/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('../index.js').Handler} Handler
 */

import {u} from 'unist-builder'
import {all} from '../all.js'
import {wrap} from '../wrap.js'

/**
 * @type {Handler}
 * @param {Root} node
 */
export function root(h, node) {
  // @ts-ignore top-level is a root.
  return h.augment(node, u('root', wrap(all(h, node))))
}
