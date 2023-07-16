import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'
import * as mod from '../index.js'

test('toHast', () => {
  assert.deepEqual(
    Object.keys(mod).sort(),
    ['all', 'defaultHandlers', 'one', 'toHast'],
    'should expose the public api'
  )

  assert.throws(() => {
    // @ts-expect-error runtime.
    toHast({type: 'bar', children: [true]})
  }, 'should throw on non-nodes')

  assert.deepEqual(
    toHast({
      type: 'strong',
      data: {hName: 'b'},
      children: [{type: 'text', value: 'alpha'}]
    }),
    h('b', 'alpha'),
    'should prefer `data.hName` to tag names'
  )

  assert.deepEqual(
    toHast({
      type: 'strong',
      data: {hChildren: [h('i', 'bravo')]},
      children: [{type: 'text', value: 'charlie'}]
    }),
    h('strong', [h('i', 'bravo')]),
    'should prefer `data.hChildren` to children'
  )

  assert.deepEqual(
    toHast({
      type: 'strong',
      data: {hProperties: {title: 'delta'}},
      children: [{type: 'text', value: 'echo'}]
    }),
    h('strong', {title: 'delta'}, 'echo'),
    'should support `data.hProperties`'
  )

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
    },
    'should patch `position`s when given'
  )

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
    },
    'should patch `position`s on `pre` and `code`'
  )

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
    },
    'should patch `position`s when given'
  )

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
    },
    'should patch `position`s on `pre` and `code`'
  )

  assert.deepEqual(
    // @ts-expect-error: unknown literal.
    toHast({type: 'hotel', value: 'india'}),
    {type: 'text', value: 'india'},
    'should transform unknown texts to `text`'
  )

  assert.deepEqual(
    // @ts-expect-error: unknown parent.
    toHast({type: 'juliett', children: [{type: 'text', value: 'kilo'}]}),
    h('div', 'kilo'),
    'should transform unknown parents to `div`'
  )

  assert.deepEqual(
    // @ts-expect-error: unknown void.
    toHast({type: 'lima'}),
    h('div'),
    'should transform unknown voids to `div`'
  )

  assert.deepEqual(
    toHast({
      // @ts-expect-error: unknown node.
      type: 'mike',
      data: {
        hName: 'code',
        hProperties: {className: ['november']},
        hChildren: [{type: 'text', value: 'oscar'}]
      },
      value: 'papa'
    }),
    h('code.november', 'oscar'),
    'should transform unknown nodes with `data.h*` properties'
  )

  assert.deepEqual(
    toHast({
      // @ts-expect-error: unknown node.
      type: 'quebec',
      data: {hChildren: [{type: 'text', value: 'romeo'}]},
      value: 'sierra'
    }),
    h('div', 'romeo'),
    'should transform unknown nodes with `data.hChildren` only to `div`'
  )

  assert.deepEqual(
    toHast({
      // @ts-expect-error: unknown node.
      type: 'tango',
      data: {hProperties: {className: ['uniform']}},
      value: 'whiskey'
    }),
    h('div.uniform', []),
    'should transform unknown nodes with `data.hProperties` only to a `element` node'
  )
})
