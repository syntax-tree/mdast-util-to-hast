import assert from 'node:assert/strict'
import test from 'node:test'
import {toHast} from 'mdast-util-to-hast'

test('yaml', async function (t) {
  await t.test('should ignore `yaml`', async function () {
    assert.deepEqual(toHast({type: 'yaml', value: 'alpha'}), {
      type: 'root',
      children: []
    })
  })
})
