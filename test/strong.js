import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from 'mdast-util-to-hast'

test('strong', async function (t) {
  await t.test('should transform `strong` to `strong`', async function () {
    assert.deepEqual(
      toHast({type: 'strong', children: [{type: 'text', value: 'alpha'}]}),
      h('strong', 'alpha')
    )
  })
})
