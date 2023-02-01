/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').Root | import('mdast').Content} Node
 */

import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('handlers option', (t) => {
  t.deepEqual(
    toHast(u('paragraph', [u('text', 'bravo')]), {
      handlers: {
        paragraph(h, /** @type {Paragraph} */ node) {
          /** @type {Element} */
          const result = {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [{type: 'text', value: 'changed'}]
          }
          h.patch(node, result)
          return h.applyData(node, result)
        }
      }
    }),
    u('element', {tagName: 'p', properties: {}}, [u('text', 'changed')]),
    'should override default handler'
  )

  const customMdast = /** @type {Paragraph} */ (
    u('paragraph', [
      u('custom', 'with value'),
      u('custom', [u('image', {url: 'with-children.png'})]),
      u('text', 'bravo')
    ])
  )

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
      unknownHandler(_, /** @type {Node} */ node) {
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
