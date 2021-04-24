import {all} from '../all.js'

export function strikethrough(h, node) {
  return h(node, 'del', all(h, node))
}
