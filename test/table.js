'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('Table', function(t) {
  t.deepEqual(
    to(
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
      {allowDangerousHTML: true}
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

  t.end()
})
