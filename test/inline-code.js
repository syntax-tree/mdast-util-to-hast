import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('inlineCode', () => {
  assert.deepEqual(
    toHast({type: 'inlineCode', value: 'alpha()'}),
    h('code', 'alpha()'),
    'should transform `inlineCode` to a `code` element'
  )

  assert.deepEqual(
    toHast({type: 'inlineCode', value: 'a\tb'}),
    h('code', 'a\tb'),
    'should support tabs in inline code'
  )

  assert.deepEqual(
    toHast({type: 'inlineCode', value: 'a\nb'}),
    h('code', 'a b'),
    'should change eols to spaces in inline code'
  )
})
