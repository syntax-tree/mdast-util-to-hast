import {u} from 'unist-builder'

// Return either a `raw` node in dangerous mode, otherwise nothing.
export function html(h, node) {
  return h.dangerous ? h.augment(node, u('raw', node.value)) : null
}
