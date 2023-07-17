import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from 'mdast-util-to-hast'

test('thematicBreak', async function (t) {
  await t.test('should transform `thematicBreak` to `hr`', async function () {
    assert.deepEqual(toHast({type: 'thematicBreak'}), h('hr'))
  })
})
