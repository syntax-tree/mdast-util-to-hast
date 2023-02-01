/**
 * @typedef {import('mdast').Table} Table
 */

import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Table', (t) => {
  t.deepEqual(
    toHast(
      /** @type {Table} */
      (
        u('table', {align: ['left', 'right']}, [
          u('tableRow', [
            u('tableCell', [u('text', 'yankee')]),
            u('tableCell', [
              u('html', '<code>'),
              u('text', 'zulu'),
              u('html', '</code>')
            ])
          ]),
          u('tableRow', [u('tableCell', [u('text', 'alpha')])])
        ])
      ),
      {allowDangerousHtml: true}
    ),
    u('element', {tagName: 'table', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'thead', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'tr', properties: {}}, [
          u('text', '\n'),
          u('element', {tagName: 'th', properties: {align: 'left'}}, [
            u('text', 'yankee')
          ]),
          u('text', '\n'),
          u('element', {tagName: 'th', properties: {align: 'right'}}, [
            u('raw', '<code>'),
            u('text', 'zulu'),
            u('raw', '</code>')
          ]),
          u('text', '\n')
        ]),
        u('text', '\n')
      ]),
      u('text', '\n'),
      u('element', {tagName: 'tbody', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'tr', properties: {}}, [
          u('text', '\n'),
          u('element', {tagName: 'td', properties: {align: 'left'}}, [
            u('text', 'alpha')
          ]),
          u('text', '\n'),
          u('element', {tagName: 'td', properties: {align: 'right'}}, []),
          u('text', '\n')
        ]),
        u('text', '\n')
      ]),
      u('text', '\n')
    ]),
    'should transform `table`'
  )

  t.deepEqual(
    toHast(
      u('table', [
        u('tableRow', [
          u('tableCell', [u('text', 'a')]),
          u('tableCell', [u('text', 'b')])
        ])
      ])
    ),
    u('element', {tagName: 'table', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'thead', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'tr', properties: {}}, [
          u('text', '\n'),
          u('element', {tagName: 'th', properties: {}}, [u('text', 'a')]),
          u('text', '\n'),
          u('element', {tagName: 'th', properties: {}}, [u('text', 'b')]),
          u('text', '\n')
        ]),
        u('text', '\n')
      ]),
      u('text', '\n')
    ]),
    'should not add a `tbody` if w/o second row'
  )

  t.deepEqual(
    toHast({type: 'table', children: []}),
    {
      type: 'element',
      tagName: 'table',
      properties: {},
      children: [{type: 'text', value: '\n'}]
    },
    'should handle a table node w/o rows'
  )

  t.deepEqual(
    toHast({
      type: 'tableRow',
      children: [
        {type: 'tableCell', children: [{type: 'text', value: 'a'}]},
        {type: 'tableCell', children: [{type: 'text', value: 'b'}]}
      ]
    }),
    {
      type: 'element',
      tagName: 'tr',
      properties: {},
      children: [
        {type: 'text', value: '\n'},
        {
          type: 'element',
          tagName: 'td',
          properties: {},
          children: [{type: 'text', value: 'a'}]
        },
        {type: 'text', value: '\n'},
        {
          type: 'element',
          tagName: 'td',
          properties: {},
          children: [{type: 'text', value: 'b'}]
        },
        {type: 'text', value: '\n'}
      ]
    },
    'should handle a table row node w/ cells'
  )

  t.deepEqual(
    toHast({type: 'tableRow', children: []}),
    {
      type: 'element',
      tagName: 'tr',
      properties: {},
      children: [{type: 'text', value: '\n'}]
    },
    'should handle a table row node w/o cells'
  )

  t.deepEqual(
    toHast({type: 'tableCell', children: [{type: 'text', value: 'a'}]}),
    {
      type: 'element',
      tagName: 'td',
      properties: {},
      children: [{type: 'text', value: 'a'}]
    },
    'should handle a table cell node w/ children'
  )

  t.deepEqual(
    toHast({type: 'tableCell', children: []}),
    {type: 'element', tagName: 'td', properties: {}, children: []},
    'should handle a table cell node w/o children'
  )

  t.end()
})
