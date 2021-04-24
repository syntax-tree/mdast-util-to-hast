import {u} from 'unist-builder'
import {all} from '../all.js'
import {wrap} from '../wrap.js'

export function root(h, node) {
  return h.augment(node, u('root', wrap(all(h, node))))
}
