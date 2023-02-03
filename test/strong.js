import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('strong', () => {
  assert.deepEqual(
    toHast({type: 'strong', children: [{type: 'text', value: 'alpha'}]}),
    h('strong', 'alpha'),
    'should transform `strong` to `strong`'
  )
})
