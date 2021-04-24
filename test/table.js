import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Table', function (t) {
  t.deepEqual(
    toHast(
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
      ]),
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
          u('element', {tagName: 'th', properties: {align: undefined}}, [
            u('text', 'a')
          ]),
          u('text', '\n'),
          u('element', {tagName: 'th', properties: {align: undefined}}, [
            u('text', 'b')
          ]),
          u('text', '\n')
        ]),
        u('text', '\n')
      ]),
      u('text', '\n')
    ]),
    'should not add a `tbody` if w/o second row'
  )

  t.end()
})
