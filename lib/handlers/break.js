import {u} from 'unist-builder'

export function hardBreak(h, node) {
  return [h(node, 'br'), u('text', '\n')]
}
