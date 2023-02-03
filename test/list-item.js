import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('listItem', () => {
  assert.deepEqual(
    toHast({
      type: 'listItem',
      children: [
        {type: 'paragraph', children: [{type: 'text', value: 'alpha'}]}
      ]
    }),
    h('li', 'alpha'),
    'should transform `listItem`s to a `li` element'
  )

  assert.deepEqual(
    toHast({
      type: 'listItem',
      spread: true,
      children: [
        {type: 'paragraph', children: [{type: 'text', value: 'bravo'}]}
      ]
    }),
    h('li', ['\n', h('p', 'bravo'), '\n']),
    'should transform a spread `listItem`s to a `li` element'
  )

  assert.deepEqual(
    toHast({
      type: 'listItem',
      children: [
        {type: 'paragraph', children: [{type: 'text', value: 'charlie'}]},
        {type: 'paragraph', children: [{type: 'text', value: 'delta'}]}
      ]
    }),
    h('li', ['\n', h('p', 'charlie'), '\n', h('p', 'delta'), '\n']),
    'should detect that an item is spread, even when not explicitly set'
  )

  assert.deepEqual(
    toHast({
      type: 'listItem',
      checked: true,
      children: [{type: 'paragraph', children: [{type: 'text', value: 'echo'}]}]
    }),
    h('li.task-list-item', [
      h('input', {type: 'checkbox', checked: true, disabled: true}),
      ' ',
      'echo'
    ]),
    'should support checkboxes in `listItem`s (`true`, tight item)'
  )

  assert.deepEqual(
    toHast({
      type: 'listItem',
      checked: false,
      spread: true,
      children: [
        {type: 'paragraph', children: [{type: 'text', value: 'foxtrot'}]},
        {type: 'paragraph', children: [{type: 'text', value: 'golf'}]}
      ]
    }),
    h('li.task-list-item', [
      '\n',
      h('p', [
        h('input', {type: 'checkbox', checked: false, disabled: true}),
        ' ',
        'foxtrot'
      ]),
      '\n',
      h('p', ['golf']),
      '\n'
    ]),
    'should support checkboxes in `listItem`s (`false`, loose item)'
  )

  assert.deepEqual(
    toHast(
      {
        type: 'listItem',
        checked: true,
        children: [{type: 'html', value: '<!--hotel-->'}]
      },
      {allowDangerousHtml: true}
    ),
    h('li.task-list-item', [
      h('input', {type: 'checkbox', checked: true, disabled: true}),
      '\n',
      {type: 'raw', value: '<!--hotel-->'},
      '\n'
    ]),
    'should support checkboxes in `listItem`s w/o paragraph'
  )

  assert.deepEqual(
    toHast({
      type: 'listItem',
      checked: true,
      children: [
        {
          type: 'blockquote',
          children: [
            {type: 'paragraph', children: [{type: 'text', value: 'india'}]}
          ]
        },
        {type: 'paragraph', children: [{type: 'text', value: 'juliett'}]}
      ]
    }),
    h('li.task-list-item', [
      '\n',
      h('p', [h('input', {type: 'checkbox', checked: true, disabled: true})]),
      '\n',
      h('blockquote', ['\n', h('p', 'india'), '\n']),
      '\n',
      h('p', 'juliett'),
      '\n'
    ]),
    'should support checkboxes in `listItem`s that don’t start with paragraphs'
  )

  assert.deepEqual(
    toHast({type: 'listItem', children: []}),
    h('li', []),
    'should support `listItem`s without children'
  )

  assert.deepEqual(
    toHast({type: 'listItem', checked: true, children: []}),
    h('li.task-list-item', [
      h('input', {type: 'checkbox', checked: true, disabled: true})
    ]),
    'should support checkboxes in `listItem`s without children'
  )

  assert.deepEqual(
    toHast({
      type: 'listItem',
      children: [
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
              children: [
                {type: 'paragraph', children: [{type: 'text', value: 'kilo'}]}
              ]
            }
          ]
        }
      ]
    }),
    h('li', ['\n', h('ul', ['\n', h('li', 'kilo'), '\n']), '\n']),
    'should support lists in `listItem`s'
  )
})
