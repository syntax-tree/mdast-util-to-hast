import assert from 'node:assert/strict'
import test from 'node:test'
import {toHast} from '../index.js'

test('toml', async function (t) {
  await t.test('should ignore `toml`', async function () {
    assert.deepEqual(toHast({type: 'toml', value: 'alpha'}), {
      type: 'root',
      children: []
    })
  })
})
