import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from 'mdast-util-to-hast'

test('list', async function (t) {
  await t.test('should transform ordered lists to `ol`', async function () {
    assert.deepEqual(
      toHast({
        type: 'list',
        ordered: true,
        children: [
          {
            type: 'listItem',
            children: [
              {type: 'paragraph', children: [{type: 'text', value: 'alpha'}]}
            ]
          }
        ]
      }),
      h('ol', ['\n', h('li', 'alpha'), '\n'])
    )
  })

  await t.test('should transform unordered lists to `ul`', async function () {
    assert.deepEqual(
      toHast({
        type: 'list',
        children: [
          {
            type: 'listItem',
            children: [
              {type: 'paragraph', children: [{type: 'text', value: 'bravo'}]}
            ]
          }
        ]
      }),
      h('ul', ['\n', h('li', 'bravo'), '\n'])
    )
  })

  await t.test(
    'should identify task list items in unordered lists',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'list',
          children: [
            {
              type: 'listItem',
              checked: true,
              children: [
                {
                  type: 'paragraph',
                  children: [{type: 'text', value: 'charlie'}]
                }
              ]
            }
          ]
        }),
        h('ul.contains-task-list', [
          '\n',
          h('li.task-list-item', [
            h('input', {type: 'checkbox', checked: true, disabled: true}),
            ' ',
            'charlie'
          ]),
          '\n'
        ])
      )
    }
  )

  await t.test('should support `start` in ordered lists', async function () {
    assert.deepEqual(
      toHast({
        type: 'list',
        ordered: true,
        start: 3,
        children: [
          {
            type: 'listItem',
            children: [
              {type: 'paragraph', children: [{type: 'text', value: 'delta'}]}
            ]
          }
        ]
      }),
      h('ol', {start: 3}, ['\n', h('li', 'delta'), '\n'])
    )
  })
})
