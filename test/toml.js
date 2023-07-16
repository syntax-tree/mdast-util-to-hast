import assert from 'node:assert/strict'
import test from 'node:test'
import {toHast} from '../index.js'

test('toml', async function (t) {
  await t.test('should ignore `toml`', async function () {
    assert.deepEqual(
      // To do: register in test types.
      // @ts-expect-error: check how a `toml` node is handled (not registered
      // normally, but supported here).
      toHast({type: 'toml', value: 'alpha'}),
      undefined
    )
  })
})
