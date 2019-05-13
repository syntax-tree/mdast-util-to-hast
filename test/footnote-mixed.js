'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('Footnote', function(t) {
  var mdast = to(
    u('root', [
      u('paragraph', [
        u('text', 'Alpha'),
        u('footnote', [u('text', 'Charlie')])
      ]),
      u('paragraph', [
        u('text', 'Bravo'),
        u('footnoteReference', {identifier: 'x'})
      ]),
      u('footnoteDefinition', {identifier: 'x'}, [
        u('paragraph', [u('text', 'Delta')])
      ])
    ])
  )

  var hast = u('root', [
    u('element', {tagName: 'p', properties: {}}, [
      u('text', 'Alpha'),
      u('element', {tagName: 'sup', properties: {id: 'fnref-1'}}, [
        u(
          'element',
          {
            tagName: 'a',
            properties: {href: '#fn-1', className: ['footnote-ref']}
          },
          [u('text', '1')]
        )
      ])
    ]),
    u('text', '\n'),
    u('element', {tagName: 'p', properties: {}}, [
      u('text', 'Bravo'),
      u('element', {tagName: 'sup', properties: {id: 'fnref-x'}}, [
        u(
          'element',
          {
            tagName: 'a',
            properties: {href: '#fn-x', className: ['footnote-ref']}
          },
          [u('text', 'x')]
        )
      ])
    ]),
    u('text', '\n'),
    u('element', {tagName: 'div', properties: {className: ['footnotes']}}, [
      u('text', '\n'),
      u('element', {tagName: 'hr', properties: {}}, []),
      u('text', '\n'),
      u('element', {tagName: 'ol', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'li', properties: {id: 'fn-x'}}, [
          u('text', 'Delta'),
          u(
            'element',
            {
              tagName: 'a',
              properties: {href: '#fnref-x', className: ['footnote-backref']}
            },
            [u('text', '↩')]
          )
        ]),
        u('text', '\n'),
        u('element', {tagName: 'li', properties: {id: 'fn-1'}}, [
          u('text', 'Charlie'),
          u(
            'element',
            {
              tagName: 'a',
              properties: {href: '#fnref-1', className: ['footnote-backref']}
            },
            [u('text', '↩')]
          )
        ]),
        u('text', '\n')
      ]),
      u('text', '\n')
    ])
  ])

  t.deepEqual(mdast, hast, 'should order the footnote section by usage')

  t.end()
})
