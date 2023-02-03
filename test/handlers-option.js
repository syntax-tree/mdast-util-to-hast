/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').Root | import('mdast').Content} Node
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

// To do: move to `core`?
test('handlers option', () => {
  assert.deepEqual(
    toHast(
      {type: 'paragraph', children: [{type: 'text', value: 'alpha'}]},
      {
        handlers: {
          paragraph(h, /** @type {Paragraph} */ node) {
            /** @type {Element} */
            const result = {
              type: 'element',
              tagName: 'p',
              properties: {},
              children: [{type: 'text', value: 'bravo'}]
            }
            h.patch(node, result)
            return h.applyData(node, result)
          }
        }
      }
    ),
    h('p', 'bravo'),
    'should override default handlers'
  )

  /** @type {Paragraph} */
  const customMdast = {
    type: 'paragraph',
    children: [
      // @ts-expect-error: custom literal.
      {type: 'a', value: 'alpha'},
      // @ts-expect-error: custom parent.
      {type: 'b', children: [{type: 'image', url: 'bravo'}]},
      {type: 'text', value: 'charlie'}
    ]
  }

  assert.deepEqual(
    toHast(customMdast),
    h('p', ['alpha', h('div', [h('img', {src: 'bravo'})]), 'charlie']),
    'should use default handler for unknown nodes'
  )

  assert.deepEqual(
    toHast(customMdast, {
      // @ts-expect-error `hast` expected, but this returns unknown mdast nodes.
      unknownHandler(_, /** @type {Node} */ node) {
        return node
      }
    }),
    h('p', [
      {type: 'a', value: 'alpha'},
      // @ts-expect-error: custom.
      {type: 'b', children: [{type: 'image', url: 'bravo'}]},
      'charlie'
    ]),
    'should use an `unknownHandler`'
  )

  assert.deepEqual(
    toHast(customMdast, {passThrough: ['a', 'b']}),
    h('p', [
      {type: 'a', value: 'alpha'},
      // @ts-expect-error: custom.
      {type: 'b', children: [h('img', {src: 'bravo'})]},
      'charlie'
    ]),
    'should use `passThrough`'
  )
})
