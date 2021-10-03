import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Footnote (mixed)', (t) => {
  const mdast = toHast(
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

  const hast = u('root', [
    u('element', {tagName: 'p', properties: {}}, [
      u('text', 'Alpha'),
      u('element', {tagName: 'sup', properties: {}}, [
        u(
          'element',
          {
            tagName: 'a',
            properties: {
              href: '#user-content-fn-1',
              id: 'user-content-fnref-1',
              dataFootnoteRef: true,
              ariaDescribedBy: 'footnote-label'
            }
          },
          [u('text', '1')]
        )
      ])
    ]),
    u('text', '\n'),
    u('element', {tagName: 'p', properties: {}}, [
      u('text', 'Bravo'),
      u('element', {tagName: 'sup', properties: {}}, [
        u(
          'element',
          {
            tagName: 'a',
            properties: {
              href: '#user-content-fn-x',
              id: 'user-content-fnref-x',
              dataFootnoteRef: true,
              ariaDescribedBy: 'footnote-label'
            }
          },
          [u('text', '2')]
        )
      ])
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
          u('element', {tagName: 'li', properties: {id: 'user-content-fn-1'}}, [
            u('text', '\n'),
            u('element', {tagName: 'p', properties: {}}, [
              u('text', 'Charlie '),
              u(
                'element',
                {
                  tagName: 'a',
                  properties: {
                    href: '#user-content-fnref-1',
                    dataFootnoteBackref: true,
                    className: ['data-footnote-backref'],
                    ariaLabel: 'Back to content'
                  }
                },
                [u('text', '↩')]
              )
            ]),
            u('text', '\n')
          ]),
          u('text', '\n'),
          u('element', {tagName: 'li', properties: {id: 'user-content-fn-x'}}, [
            u('text', '\n'),
            u('element', {tagName: 'p', properties: {}}, [
              u('text', 'Delta '),
              u(
                'element',
                {
                  tagName: 'a',
                  properties: {
                    href: '#user-content-fnref-x',
                    dataFootnoteBackref: true,
                    className: ['data-footnote-backref'],
                    ariaLabel: 'Back to content'
                  }
                },
                [u('text', '↩')]
              )
            ]),
            u('text', '\n')
          ]),
          u('text', '\n')
        ]),
        u('text', '\n')
      ]
    )
  ])

  t.deepEqual(mdast, hast, 'should order the footnote section by usage')

  t.end()
})
