import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('emphasis', async function (t) {
  await t.test('should transform `emphasis` to `em`', async function () {
    assert.deepEqual(
      toHast({type: 'emphasis', children: [{type: 'text', value: 'alpha'}]}),
      h('em', 'alpha')
    )
  })
})
