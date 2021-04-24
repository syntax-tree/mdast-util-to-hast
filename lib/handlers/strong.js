import {all} from '../all.js'

export function strong(h, node) {
  return h(node, 'strong', all(h, node))
}
