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

  await t.test('should trim text after a `br` (#3)', async function () {
    assert.deepEqual(
      toHast({
        type: 'paragraph',
        children: [
          {type: 'text', value: 'a'},
          {type: 'break'},
          // U+3000 (ideographic space).
          {type: 'text', value: '　b'},
          {type: 'break'},
          // U+2003 (em space).
          {type: 'text', value: ' c'},
          {type: 'break'},
          // U+00A0 (no-break space).
          {type: 'text', value: ' d'}
        ]
      }),
      h('p', [
        'a',
        h('br'),
        '\n',
        '　b',
        h('br'),
        '\n',
        ' c',
        h('br'),
        '\n',
        ' d'
      ])
    )
  })
})
