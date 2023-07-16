import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('code', async function (t) {
  await t.test(
    'should transform `code` to a `pre` element (#1)',
    async function () {
      assert.deepEqual(
        toHast({type: 'code', value: 'alpha()\nbravo.charlie()'}),
        h('pre', [h('code', 'alpha()\nbravo.charlie()\n')])
      )
    }
  )

  await t.test(
    'should transform `code` to a `pre` element (#2)',
    async function () {
      assert.deepEqual(
        toHast({type: 'code', value: ''}),
        h('pre', [h('code', '')])
      )
    }
  )

  await t.test(
    'should transform `code` to a `pre` element with language class',
    async function () {
      assert.deepEqual(
        toHast({type: 'code', lang: 'js', value: 'delta()'}),
        h('pre', [h('code', {className: ['language-js']}, 'delta()\n')])
      )
    }
  )

  await t.test('should support `meta`', async function () {
    assert.deepEqual(
      toHast({type: 'code', lang: 'js', meta: 'echo', value: 'foxtrot()'}),
      h('pre', [
        {
          type: 'element',
          tagName: 'code',
          properties: {className: ['language-js']},
          data: {meta: 'echo'},
          children: [{type: 'text', value: 'foxtrot()\n'}]
        }
      ])
    )
  })

  await t.test('should support tabs in code', async function () {
    assert.deepEqual(
      toHast({type: 'code', value: '\ta'}),
      h('pre', [h('code', '\ta\n')])
    )
  })
})
