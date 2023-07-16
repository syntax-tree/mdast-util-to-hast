import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'
import * as mod from '../index.js'

test('toHast', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(mod).sort(), [
      'all',
      'defaultHandlers',
      'one',
      'toHast'
    ])
  })

  await t.test('should throw on non-nodes', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that non-node children throw at runtime.
      toHast({type: 'bar', children: [true]})
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
})
