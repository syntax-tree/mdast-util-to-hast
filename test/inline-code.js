import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('inlineCode', async function (t) {
  await t.test(
    'should transform `inlineCode` to a `code` element',
    async function () {
      assert.deepEqual(
        toHast({type: 'inlineCode', value: 'alpha()'}),
        h('code', 'alpha()')
      )
    }
  )

  await t.test('should support tabs in inline code', async function () {
    assert.deepEqual(
      toHast({type: 'inlineCode', value: 'a\tb'}),
      h('code', 'a\tb')
    )
  })

  await t.test(
    'should change eols to spaces in inline code',
    async function () {
      assert.deepEqual(
        toHast({type: 'inlineCode', value: 'a\nb'}),
        h('code', 'a b')
      )
    }
  )
})
