import assert from 'node:assert/strict'
import test from 'node:test'
import {toHast} from '../index.js'

test('yaml', () => {
  assert.deepEqual(
    toHast({type: 'yaml', value: 'alpha'}),
    null,
    'should ignore `yaml`'
  )
})
