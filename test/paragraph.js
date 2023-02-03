import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('paragraph', () => {
  assert.deepEqual(
    toHast({type: 'paragraph', children: [{type: 'text', value: 'alpha'}]}),
    h('p', 'alpha'),
    'should transform `paragraph` to a `p` element'
  )
})
