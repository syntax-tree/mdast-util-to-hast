import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Footnote (mixed)', function (t) {
  var mdast = toHast(
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
      u(
        'element',
        {
          tagName: 'a',
          properties: {
            href: '#fn1',
            className: ['footnote-ref'],
            id: 'fnref1',
            role: 'doc-noteref'
          }
        },
        [u('element', {tagName: 'sup', properties: {}}, [u('text', '1')])]
      )
    ]),
    u('text', '\n'),
    u('element', {tagName: 'p', properties: {}}, [
      u('text', 'Bravo'),
      u(
        'element',
        {
          tagName: 'a',
          properties: {
            href: '#fn2',
            className: ['footnote-ref'],
            id: 'fnref2',
            role: 'doc-noteref'
          }
        },
        [u('element', {tagName: 'sup', properties: {}}, [u('text', '2')])]
      )
    ]),
    u('text', '\n'),
    u(
      'element',
      {
        tagName: 'section',
        properties: {className: ['footnotes'], role: 'doc-endnotes'}
      },
      [
        u('text', '\n'),
        u('element', {tagName: 'hr', properties: {}}, []),
        u('text', '\n'),
        u('element', {tagName: 'ol', properties: {}}, [
          u('text', '\n'),
          u(
            'element',
            {tagName: 'li', properties: {id: 'fn1', role: 'doc-endnote'}},
            [
              u('text', 'Charlie'),
              u(
                'element',
                {
                  tagName: 'a',
                  properties: {
                    href: '#fnref1',
                    className: ['footnote-back'],
                    role: 'doc-backlink'
                  }
                },
                [u('text', '↩')]
              )
            ]
          ),
          u('text', '\n'),
          u(
            'element',
            {tagName: 'li', properties: {id: 'fn2', role: 'doc-endnote'}},
            [
              u('text', 'Delta'),
              u(
                'element',
                {
                  tagName: 'a',
                  properties: {
                    href: '#fnref2',
                    className: ['footnote-back'],
                    role: 'doc-backlink'
                  }
                },
                [u('text', '↩')]
              )
            ]
          ),
          u('text', '\n')
        ]),
        u('text', '\n')
      ]
    )
  ])

  t.deepEqual(mdast, hast, 'should order the footnote section by usage')

  t.end()
})
