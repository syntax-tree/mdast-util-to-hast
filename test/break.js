import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from 'mdast-util-to-hast'

test('break', async function (t) {
  await t.test('should transform `break` to `br`', async function () {
    assert.deepEqual(
      toHast({
        type: 'paragraph',
        children: [
          {type: 'text', value: 'alpha'},
          {type: 'break'},
          {type: 'text', value: 'bravo'}
        ]
      }),
      h('p', ['alpha', h('br'), '\n', 'bravo'])
    )
  })

  await t.test('should trim text after a `br` (#1)', async function () {
    assert.deepEqual(
      toHast({
        type: 'paragraph',
        children: [
          {type: 'text', value: 'alpha'},
          {type: 'break'},
          {type: 'text', value: '  bravo'}
        ]
      }),
      h('p', ['alpha', h('br'), '\n', 'bravo'])
    )
  })

  await t.test('should trim text after a `br` (#2)', async function () {
    assert.deepEqual(
      toHast({
        type: 'paragraph',
        children: [
          {type: 'text', value: 'alpha'},
          {type: 'break'},
          {type: 'emphasis', children: [{type: 'text', value: '  bravo'}]}
        ]
      }),
      h('p', ['alpha', h('br'), '\n', h('em', 'bravo')])
    )
  })
})
