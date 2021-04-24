import {all} from '../all.js'

export function paragraph(h, node) {
  return h(node, 'p', all(h, node))
}
