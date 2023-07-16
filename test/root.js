import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('root', async function (t) {
  await t.test('should map `root`s', async function () {
    assert.deepEqual(toHast({type: 'root', children: []}), h(null))
  })
})
