/**
 * @typedef {import('mdast').List} List
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('../index.js').Handler} Handler
 */

import {wrap} from '../wrap.js'
import {all} from '../traverse.js'

/**
 * @type {Handler}
 * @param {List} node
 */
export function list(h, node) {
  /** @type {Properties} */
  var props = {}
  var name = node.ordered ? 'ol' : 'ul'
  var items = all(h, node)
  var index = -1

  if (typeof node.start === 'number' && node.start !== 1) {
    props.start = node.start
  }

  // Like GitHub, add a class for custom styling.
  while (++index < items.length) {
    if (
      items[index].type === 'element' &&
      items[index].tagName === 'li' &&
      // @ts-ignore looks like properties.
      items[index].properties.className &&
      // @ts-ignore looks like properties.
      items[index].properties.className.includes('task-list-item')
    ) {
      props.className = ['contains-task-list']
      break
    }
  }

  return h(node, name, props, wrap(items, true))
}
