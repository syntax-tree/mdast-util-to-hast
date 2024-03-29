/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Paragraph} Paragraph
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast, defaultHandlers} from 'mdast-util-to-hast'
import {VFile} from 'vfile'

test('toHast', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('mdast-util-to-hast')).sort(), [
      'defaultFootnoteBackContent',
      'defaultFootnoteBackLabel',
      'defaultHandlers',
      'toHast'
    ])
  })

  await t.test('should throw on non-nodes', async function () {
    assert.throws(function () {
      toHast({
        type: 'paragraph',
        children: [
          // @ts-expect-error: check that non-node children throw at runtime.
          true
        ]
      })
    })
  })

  await t.test('should prefer `data.hName` to tag names', async function () {
    assert.deepEqual(
      toHast({
        type: 'strong',
        data: {hName: 'b'},
        children: [{type: 'text', value: 'alpha'}]
      }),
      h('b', 'alpha')
    )
  })

  await t.test('should prefer `data.hChildren` to children', async function () {
    assert.deepEqual(
      toHast({
        type: 'strong',
        data: {hChildren: [h('i', 'bravo')]},
        children: [{type: 'text', value: 'charlie'}]
      }),
      h('strong', [h('i', 'bravo')])
    )
  })

  await t.test('should support `data.hProperties`', async function () {
    assert.deepEqual(
      toHast({
        type: 'strong',
        data: {hProperties: {title: 'delta'}},
        children: [{type: 'text', value: 'echo'}]
      }),
      h('strong', {title: 'delta'}, 'echo')
    )
  })

  await t.test('should patch `position`s when given', async function () {
    assert.deepEqual(
      toHast({
        type: 'emphasis',
        children: [{type: 'text', value: 'foxtrot'}],
        position: {
          start: {line: 2, column: 3},
          end: {line: 2, column: 12}
        }
      }),
      {
        type: 'element',
        tagName: 'em',
        properties: {},
        children: [{type: 'text', value: 'foxtrot'}],
        position: {
          start: {line: 2, column: 3, offset: undefined},
          end: {line: 2, column: 12, offset: undefined}
        }
      }
    )
  })

  await t.test(
    'should patch `position`s on `pre` and `code`',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'code',
          value: 'golf',
          position: {
            start: {line: 2, column: 3},
            end: {line: 2, column: 12}
          }
        }),
        {
          type: 'element',
          tagName: 'pre',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: [{type: 'text', value: 'golf\n'}],
              position: {
                start: {line: 2, column: 3, offset: undefined},
                end: {line: 2, column: 12, offset: undefined}
              }
            }
          ],
          position: {
            start: {line: 2, column: 3, offset: undefined},
            end: {line: 2, column: 12, offset: undefined}
          }
        }
      )
    }
  )

  await t.test('should patch `position`s when given', async function () {
    assert.deepEqual(
      toHast({
        type: 'emphasis',
        children: [{type: 'text', value: 'foxtrot'}],
        position: {
          start: {line: 2, column: 3},
          end: {line: 2, column: 12}
        }
      }),
      {
        type: 'element',
        tagName: 'em',
        properties: {},
        children: [{type: 'text', value: 'foxtrot'}],
        position: {
          start: {line: 2, column: 3, offset: undefined},
          end: {line: 2, column: 12, offset: undefined}
        }
      }
    )
  })

  await t.test(
    'should patch `position`s on `pre` and `code`',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'code',
          value: 'golf',
          position: {
            start: {line: 2, column: 3},
            end: {line: 2, column: 12}
          }
        }),
        {
          type: 'element',
          tagName: 'pre',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: [{type: 'text', value: 'golf\n'}],
              position: {
                start: {line: 2, column: 3, offset: undefined},
                end: {line: 2, column: 12, offset: undefined}
              }
            }
          ],
          position: {
            start: {line: 2, column: 3, offset: undefined},
            end: {line: 2, column: 12, offset: undefined}
          }
        }
      )
    }
  )

  await t.test('should transform unknown texts to `text`', async function () {
    assert.deepEqual(
      // @ts-expect-error: check how an unknown literal is handled.
      toHast({type: 'hotel', value: 'india'}),
      {type: 'text', value: 'india'}
    )
  })

  await t.test('should transform unknown parents to `div`', async function () {
    assert.deepEqual(
      // @ts-expect-error: check how an unknown parent is handled.
      toHast({type: 'juliett', children: [{type: 'text', value: 'kilo'}]}),
      h('div', 'kilo')
    )
  })

  await t.test('should transform unknown voids to `div`', async function () {
    assert.deepEqual(
      // @ts-expect-error: check how an unknown void.
      toHast({type: 'lima'}),
      h('div')
    )
  })

  await t.test(
    'should transform unknown nodes with `data.h*` properties',
    async function () {
      assert.deepEqual(
        toHast({
          // @ts-expect-error: check how an unknown node is handled.
          type: 'mike',
          data: {
            hName: 'code',
            hProperties: {className: ['november']},
            hChildren: [{type: 'text', value: 'oscar'}]
          },
          value: 'papa'
        }),
        h('code.november', 'oscar')
      )
    }
  )

  await t.test(
    'should transform unknown nodes with `data.hChildren` only to `div`',
    async function () {
      assert.deepEqual(
        toHast({
          // @ts-expect-error: check how an unknown node is handled.
          type: 'quebec',
          data: {hChildren: [{type: 'text', value: 'romeo'}]},
          value: 'sierra'
        }),
        h('div', 'romeo')
      )
    }
  )

  await t.test(
    'should transform unknown nodes with `data.hProperties` only to a `element` node',
    async function () {
      assert.deepEqual(
        toHast({
          // @ts-expect-error: check how an unknown node is handled.
          type: 'tango',
          data: {hProperties: {className: ['uniform']}},
          value: 'whiskey'
        }),
        h('div.uniform', [])
      )
    }
  )

  /** @type {Paragraph} */
  const customMdast = {
    type: 'paragraph',
    children: [
      {type: 'alpha', value: 'alpha'},
      {type: 'bravo', children: [{type: 'image', url: 'bravo'}]},
      {type: 'text', value: 'charlie'}
    ]
  }

  await t.test('should override default handlers', async function () {
    assert.deepEqual(
      toHast(
        {type: 'paragraph', children: [{type: 'text', value: 'alpha'}]},
        {
          handlers: {
            paragraph(state, /** @type {Paragraph} */ node) {
              /** @type {Element} */
              const result = {
                type: 'element',
                tagName: 'p',
                properties: {},
                children: [{type: 'text', value: 'bravo'}]
              }
              state.patch(node, result)
              return state.applyData(node, result)
            }
          }
        }
      ),
      h('p', 'bravo')
    )
  })

  await t.test('should support files', async function () {
    const file = new VFile('alpha')

    assert.deepEqual(
      toHast(
        {type: 'paragraph', children: [{type: 'text', value: 'alpha'}]},
        {
          file,
          handlers: {
            paragraph(state, /** @type {Paragraph} */ node) {
              assert(state.options.file)
              state.options.file.message('Warning!')
              return defaultHandlers.paragraph(state, node)
            }
          }
        }
      ),
      h('p', 'alpha')
    )

    assert.deepEqual(file.messages.map(String), ['1:1: Warning!'])
  })

  await t.test('should support unknown nodes by default', async function () {
    assert.deepEqual(
      toHast(customMdast),
      h('p', ['alpha', h('div', [h('img', {src: 'bravo'})]), 'charlie'])
    )
  })

  await t.test('should support `unknownHandler`', async function () {
    assert.deepEqual(
      toHast(customMdast, {
        unknownHandler() {
          return {type: 'text', value: 'unknown!'}
        }
      }),
      h('p', ['unknown!', 'unknown!', 'charlie'])
    )
  })

  await t.test('should support `passThrough`', async function () {
    assert.deepEqual(toHast(customMdast, {passThrough: ['alpha', 'bravo']}), {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [
        {type: 'alpha', value: 'alpha'},
        {
          type: 'bravo',
          children: [
            {
              type: 'element',
              tagName: 'img',
              properties: {src: 'bravo'},
              children: []
            }
          ]
        },
        {type: 'text', value: 'charlie'}
      ]
    })
  })
})
