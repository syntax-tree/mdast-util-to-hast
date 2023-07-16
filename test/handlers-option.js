/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').Nodes} Nodes
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

// To do: move to `core`?
test('handlers option', async function (t) {
  /** @type {Paragraph} */
  const customMdast = {
    type: 'paragraph',
    children: [
      // @ts-expect-error: check how a custom literal is handled.
      {type: 'a', value: 'alpha'},
      // @ts-expect-error: check how a custom parent is handled.
      {type: 'b', children: [{type: 'image', url: 'bravo'}]},
      {type: 'text', value: 'charlie'}
    ]
  }

  await t.test('should override default handlers', async function () {
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
      h('p', 'bravo')
    )
  })

  await t.test(
    'should use default handler for unknown nodes',
    async function () {
      assert.deepEqual(
        toHast(customMdast),
        h('p', ['alpha', h('div', [h('img', {src: 'bravo'})]), 'charlie'])
      )
    }
  )

  await t.test('should use an `unknownHandler`', async function () {
    assert.deepEqual(
      toHast(customMdast, {
        // To do: improved test.
        // @ts-expect-error `hast` expected, but this returns unknown mdast nodes.
        unknownHandler(_, /** @type {Nodes} */ node) {
          return node
        }
      }),
      h('p', [
        {type: 'a', value: 'alpha'},
        // To do: register custom?
        // @ts-expect-error: custom.
        {type: 'b', children: [{type: 'image', url: 'bravo'}]},
        'charlie'
      ])
    )
  })

  await t.test('should use `passThrough`', async function () {
    assert.deepEqual(
      toHast(customMdast, {passThrough: ['a', 'b']}),
      h('p', [
        {type: 'a', value: 'alpha'},
        // @ts-expect-error: custom.
        {type: 'b', children: [h('img', {src: 'bravo'})]},
        'charlie'
      ])
    )
  })
})
