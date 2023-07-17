import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from 'mdast-util-to-hast'

test('paragraph', async function (t) {
  await t.test(
    'should transform `paragraph` to a `p` element',
    async function () {
      assert.deepEqual(
        toHast({type: 'paragraph', children: [{type: 'text', value: 'alpha'}]}),
        h('p', 'alpha')
      )
    }
  )
})
