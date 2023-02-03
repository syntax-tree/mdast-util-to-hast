import assert from 'node:assert/strict'
import test from 'node:test'
import {toHast} from '../index.js'

test('toml', () => {
  assert.deepEqual(
    // @ts-expect-error: custom node.
    toHast({type: 'toml', value: 'alpha'}),
    null,
    'should ignore `toml`'
  )
})
