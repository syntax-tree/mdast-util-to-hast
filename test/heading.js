import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('heading', async function (t) {
  await t.test(
    'should transform `heading` to a `h[1-6]` element',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'heading',
          depth: 4,
          children: [{type: 'text', value: 'alpha'}]
        }),
        h('h4', 'alpha')
      )
    }
  )
})
