import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('ListItem', function (t) {
  t.deepEqual(
    toHast(u('listItem', [u('paragraph', [u('text', 'november')])])),
    u('element', {tagName: 'li', properties: {}}, [u('text', 'november')]),
    'should transform tight `listItem`s to a `li` element'
  )

  t.deepEqual(
    toHast(
      u('listItem', {spread: true}, [u('paragraph', [u('text', 'november')])])
    ),
    u('element', {tagName: 'li', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [u('text', 'november')]),
      u('text', '\n')
    ]),
    'should transform a spreaded `listItem`s to a `li` element'
  )

  t.deepEqual(
    toHast(
      u('listItem', [
        u('paragraph', [u('text', 'oscar')]),
        u('paragraph', [u('text', 'papa')])
      ])
    ),
    u('element', {tagName: 'li', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [u('text', 'oscar')]),
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [u('text', 'papa')]),
      u('text', '\n')
    ]),
    'should transform loose `listItem`s to a `li` element'
  )

  t.deepEqual(
    toHast(
      u('listItem', {checked: true}, [u('paragraph', [u('text', 'québec')])])
    ),
    u('element', {tagName: 'li', properties: {className: ['task-list-item']}}, [
      u(
        'element',
        {
          tagName: 'input',
          properties: {type: 'checkbox', checked: true, disabled: true}
        },
        []
      ),
      u('text', ' '),
      u('text', 'québec')
    ]),
    'should support checkboxes in tight `listItem`s'
  )

  t.deepEqual(
    toHast(
      u('listItem', {checked: false}, [
        u('paragraph', [u('text', 'romeo')]),
        u('paragraph', [u('text', 'sierra')])
      ])
    ),
    u('element', {tagName: 'li', properties: {className: ['task-list-item']}}, [
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [
        u(
          'element',
          {
            tagName: 'input',
            properties: {type: 'checkbox', checked: false, disabled: true}
          },
          []
        ),
        u('text', ' '),
        u('text', 'romeo')
      ]),
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [u('text', 'sierra')]),
      u('text', '\n')
    ]),
    'should support checkboxes in loose `listItem`s'
  )

  t.deepEqual(
    toHast(u('listItem', {checked: true}, [u('html', '<!--tango-->')])),
    u('element', {tagName: 'li', properties: {className: ['task-list-item']}}, [
      u(
        'element',
        {
          tagName: 'input',
          properties: {type: 'checkbox', checked: true, disabled: true}
        },
        []
      )
    ]),
    'should support checkboxes in `listItem`s without paragraph'
  )

  t.deepEqual(
    toHast(
      u('listItem', {checked: false}, [
        u('blockquote', [u('paragraph', [u('text', 'romeo')])]),
        u('paragraph', [u('text', 'sierra')])
      ])
    ),
    u('element', {tagName: 'li', properties: {className: ['task-list-item']}}, [
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [
        u(
          'element',
          {
            tagName: 'input',
            properties: {type: 'checkbox', checked: false, disabled: true}
          },
          []
        )
      ]),
      u('text', '\n'),
      u('element', {tagName: 'blockquote', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'p', properties: {}}, [u('text', 'romeo')]),
        u('text', '\n')
      ]),
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [u('text', 'sierra')]),
      u('text', '\n')
    ]),
    'should support checkboxes in loose `listItem`s without paragraphs'
  )

  t.deepEqual(
    toHast(u('listItem', [])),
    u('element', {tagName: 'li', properties: {}}, []),
    'should support `listItem`s without children'
  )

  t.deepEqual(
    toHast(u('listItem', {checked: true}, [])),
    u('element', {tagName: 'li', properties: {className: ['task-list-item']}}, [
      u(
        'element',
        {
          tagName: 'input',
          properties: {type: 'checkbox', checked: true, disabled: true}
        },
        []
      )
    ]),
    'should support checkboxes in `listItem`s without children'
  )

  t.deepEqual(
    toHast(
      u('listItem', [
        u('list', {ordered: false}, [
          u('listItem', [u('paragraph', [u('text', 'Alpha')])])
        ])
      ])
    ),
    u('element', {tagName: 'li', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'ul', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'li', properties: {}}, [u('text', 'Alpha')]),
        u('text', '\n')
      ]),
      u('text', '\n')
    ]),
    'should support lists in `listItem`s'
  )

  t.end()
})
