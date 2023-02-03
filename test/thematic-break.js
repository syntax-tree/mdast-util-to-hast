import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('thematicBreak', () => {
  assert.deepEqual(
    toHast({type: 'thematicBreak'}),
    h('hr'),
    'should transform `thematicBreak` to `hr`'
  )
})
