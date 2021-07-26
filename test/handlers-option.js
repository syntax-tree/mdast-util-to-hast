/**
 * @typedef {import('mdast').Paragraph} Paragraph
 */

import assert from 'node:assert'
import test from 'tape'
import {u} from 'unist-builder'
import {all, toHast} from '../index.js'

test('handlers option', (t) => {
  t.deepEqual(
    toHast(u('paragraph', [u('text', 'bravo')]), {
      handlers: {
        paragraph(h, /** @type {Paragraph} */ node) {
          const head = node.children[0]
          assert(head.type === 'text')
          head.value = 'changed'
          return h(node, 'p', all(h, node))
        }
      }
    }),
    u('element', {tagName: 'p', properties: {}}, [u('text', 'changed')]),
    'should override default handler'
  )

  const customMdast = u('paragraph', [
    u('custom', 'with value'),
    u('custom', [u('image', {url: 'with-children.png'})]),
    u('text', 'bravo')
  ])

  t.deepEqual(
    toHast(customMdast, {}),
    u('element', {tagName: 'p', properties: {}}, [
      u('text', 'with value'),
      u('element', {tagName: 'div', properties: {}}, [
        u(
          'element',
          {
            tagName: 'img',
            properties: {src: 'with-children.png', alt: undefined}
          },
          []
        )
      ]),
      u('text', 'bravo')
    ]),
    'should use default unknown-handler'
  )

  t.deepEqual(
    toHast(customMdast, {
      // @ts-expect-error `hast` expected, but this returns unknown mdast nodes.
      unknownHandler(_, /** @type {object} */ node) {
        return node
      }
    }),
    u('element', {tagName: 'p', properties: {}}, [
      u('custom', 'with value'),
      u('custom', [u('image', {url: 'with-children.png'})]),
      u('text', 'bravo')
    ]),
    'should use an `unknownHandler`'
  )

  t.deepEqual(
    toHast(customMdast, {passThrough: ['custom']}),
    u('element', {tagName: 'p', properties: {}}, [
      u('custom', 'with value'),
      u('custom', [
        u(
          'element',
          {
            tagName: 'img',
            properties: {src: 'with-children.png', alt: undefined}
          },
          []
        )
      ]),
      u('text', 'bravo')
    ]),
    'should use `passThrough`'
  )

  t.end()
})
