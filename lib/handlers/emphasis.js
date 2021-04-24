import {all} from '../all.js'

export function emphasis(h, node) {
  return h(node, 'em', all(h, node))
}
