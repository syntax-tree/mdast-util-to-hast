import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('blockquote', () => {
  assert.deepEqual(
    toHast({
      type: 'blockquote',
      children: [
        {type: 'paragraph', children: [{type: 'text', value: 'alpha'}]},
        {type: 'paragraph', children: [{type: 'text', value: 'bravo'}]}
      ]
    }),
    h('blockquote', ['\n', h('p', 'alpha'), '\n', h('p', 'bravo'), '\n']),
    'should transform `blockquote` to a `blockquote` element'
  )
})
