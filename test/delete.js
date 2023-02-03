import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('delete', () => {
  assert.deepEqual(
    toHast({type: 'delete', children: [{type: 'text', value: 'alpha'}]}),
    h('del', 'alpha'),
    'should transform `delete` to `del`'
  )
})
