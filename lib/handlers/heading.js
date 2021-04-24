import {all} from '../all.js'

export function heading(h, node) {
  return h(node, 'h' + node.depth, all(h, node))
}
