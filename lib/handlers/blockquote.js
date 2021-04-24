import {wrap} from '../wrap.js'
import {all} from '../all.js'

export function blockquote(h, node) {
  return h(node, 'blockquote', wrap(all(h, node), true))
}
