/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('./index.js').H} H
 * @typedef {import('./index.js').Content} Content
 */

import {one} from './one.js'

/**
 * @param {H} h
 * @param {Node} parent
 */
export function all(h, parent) {
  /** @type {Array.<Node>} */
  // @ts-ignore looks like a parent.
  var nodes = parent.children || []
  var index = -1
  /** @type {Array.<Content>} */
  var values = []
  /** @type {Content} */
  var result
  /** @type {Content} */
  var head

  while (++index < nodes.length) {
    // @ts-ignore looks like a parent.
    result = one(h, nodes[index], parent)

    if (result) {
      if (index && nodes[index - 1].type === 'break') {
        if (result.type === 'text') {
          result.value = result.value.replace(/^\s+/, '')
        }

        if (result.type === 'element') {
          head = result.children[0]

          if (head && head.type === 'text') {
            head.value = head.value.replace(/^\s+/, '')
          }
        }
      }

      values = values.concat(result)
    }
  }

  return values
}
