import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('FootnoteDefinition', (t) => {
  t.deepEqual(
    toHast(
      u('root', [
        u('footnoteDefinition', {identifier: 'zulu'}, [
          u('paragraph', [u('text', 'alpha')])
        ])
      ])
    ),
    u('root', []),
    'should ignore `footnoteDefinition`'
  )

  t.deepEqual(
    toHast(
      u('root', [
        u('footnoteReference', {identifier: 'zulu'}),
        u('footnoteDefinition', {identifier: 'zulu'}, [
          u('paragraph', [u('text', 'alpha')])
        ]),
        u('footnoteDefinition', {identifier: 'zulu'}, [
          u('paragraph', [u('text', 'bravo')])
        ])
      ])
    ),
    u('root', [
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
      ),
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
                u('text', 'alpha'),
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
            u('text', '\n')
          ]),
          u('text', '\n')
        ]
      )
    ]),
    'should use the first `footnoteDefinition` if multiple exist'
  )

  t.end()
})
