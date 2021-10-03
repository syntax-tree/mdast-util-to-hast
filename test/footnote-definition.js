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
      u('element', {tagName: 'sup', properties: {}}, [
        u(
          'element',
          {
            tagName: 'a',
            properties: {
              href: '#user-content-fn-zulu',
              id: 'user-content-fnref-zulu',
              dataFootnoteRef: true,
              ariaDescribedBy: 'footnote-label'
            }
          },
          [u('text', '1')]
        )
      ]),
      u('text', '\n'),
      u(
        'element',
        {
          tagName: 'section',
          properties: {dataFootnotes: true, className: ['footnotes']}
        },
        [
          u(
            'element',
            {
              tagName: 'h2',
              properties: {id: 'footnote-label', className: ['sr-only']}
            },
            [u('text', 'Footnotes')]
          ),
          u('text', '\n'),
          u('element', {tagName: 'ol', properties: {}}, [
            u('text', '\n'),
            u(
              'element',
              {tagName: 'li', properties: {id: 'user-content-fn-zulu'}},
              [
                u('text', '\n'),
                u('element', {tagName: 'p', properties: {}}, [
                  u('text', 'alpha '),
                  u(
                    'element',
                    {
                      tagName: 'a',
                      properties: {
                        href: '#user-content-fnref-zulu',
                        dataFootnoteBackref: true,
                        className: ['data-footnote-backref'],
                        ariaLabel: 'Back to content'
                      }
                    },
                    [u('text', '↩')]
                  )
                ]),
                u('text', '\n')
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
