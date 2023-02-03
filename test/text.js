import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('text', () => {
  assert.deepEqual(
    toHast({type: 'text', value: 'alpha'}),
    {type: 'text', value: 'alpha'},
    'should map `text`s'
  )

  assert.deepEqual(
    toHast({type: 'text', value: 'bravo \n \n charlie'}),
    {type: 'text', value: 'bravo\n\ncharlie'},
    'should trim spaces and tabs around eols'
  )

  assert.deepEqual(
    toHast({type: 'text', value: 'delta', data: {hName: 'span'}}),
    // To do: keep `value`?
    h('span'),
    'should transform text nodes w/ `hName` to an `element`'
  )

  assert.deepEqual(
    toHast({
      type: 'text',
      value: 'echo',
      data: {hProperties: {className: ['foxtrot']}}
    }),
    // To do: `div` or `span`?
    {type: 'text', value: 'echo'},
    'should not transform text nodes w/ `hProperties` w/o `hName` to an `element`'
  )

  assert.deepEqual(
    toHast({
      type: 'text',
      value: 'golf',
      data: {hName: 'span', hProperties: {className: ['hotel']}}
    }),
    // To do: keep `value`?
    h('span.hotel'),
    'should transform text nodes w/ `hProperties` and `hName` to an `element`'
  )

  assert.deepEqual(
    toHast({
      type: 'text',
      value: 'india',
      data: {hChildren: [{type: 'text', value: 'juliett'}]}
    }),
    // To do: `div` or `span`?
    {type: 'text', value: 'india'},
    'should not transform text nodes w/ `hChildren` w/o `hName` to an `element`'
  )

  assert.deepEqual(
    toHast({
      type: 'text',
      value: 'kilo',
      data: {hName: 'span', hChildren: [{type: 'text', value: 'lima'}]}
    }),
    h('span', 'lima'),
    'should transform text nodes w/ `hChildren` and `hName` to an `element`'
  )
})
