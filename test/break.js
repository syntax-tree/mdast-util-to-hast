import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('break', () => {
  assert.deepEqual(
    toHast({
      type: 'paragraph',
      children: [
        {type: 'text', value: 'alpha'},
        {type: 'break'},
        {type: 'text', value: 'bravo'}
      ]
    }),
    h('p', ['alpha', h('br'), '\n', 'bravo']),
    'should transform `break` to `br`'
  )

  assert.deepEqual(
    toHast({
      type: 'paragraph',
      children: [
        {type: 'text', value: 'alpha'},
        {type: 'break'},
        {type: 'text', value: '  bravo'}
      ]
    }),
    h('p', ['alpha', h('br'), '\n', 'bravo']),
    'should trim text after a `br` (#1)'
  )

  assert.deepEqual(
    toHast({
      type: 'paragraph',
      children: [
        {type: 'text', value: 'alpha'},
        {type: 'break'},
        {type: 'emphasis', children: [{type: 'text', value: '  bravo'}]}
      ]
    }),
    h('p', ['alpha', h('br'), '\n', h('em', 'bravo')]),
    'should trim text after a `br` (#2)'
  )
})
