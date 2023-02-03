import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('emphasis', () => {
  assert.deepEqual(
    toHast({type: 'emphasis', children: [{type: 'text', value: 'alpha'}]}),
    h('em', 'alpha'),
    'should transform `emphasis` to `em`'
  )
})
