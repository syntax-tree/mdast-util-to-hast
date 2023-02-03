import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('root', () => {
  assert.deepEqual(
    toHast({type: 'root', children: []}),
    h(null),
    'should map `root`s'
  )
})
