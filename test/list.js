import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('list', () => {
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
    h('ol', ['\n', h('li', 'alpha'), '\n']),
    'should transform ordered lists to `ol`'
  )

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
    h('ul', ['\n', h('li', 'bravo'), '\n']),
    'should transform unordered lists to `ul`'
  )

  assert.deepEqual(
    toHast({
      type: 'list',
      children: [
        {
          type: 'listItem',
          checked: true,
          children: [
            {type: 'paragraph', children: [{type: 'text', value: 'charlie'}]}
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
    ]),
    'should identify task list items in unordered lists'
  )

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
    h('ol', {start: 3}, ['\n', h('li', 'delta'), '\n']),
    'should support `start` in ordered lists'
  )
})
