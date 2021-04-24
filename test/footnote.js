import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Footnote', function (t) {
  t.deepEqual(
    toHast(u('root', [u('footnote', [u('text', 'bravo')])])),
    u('root', [
      u('element', {tagName: 'sup', properties: {id: 'fnref-1'}}, [
        u(
          'element',
          {
            tagName: 'a',
            properties: {href: '#fn-1', className: ['footnote-ref']}
          },
          [u('text', '1')]
        )
      ]),
      u('text', '\n'),
      u('element', {tagName: 'div', properties: {className: ['footnotes']}}, [
        u('text', '\n'),
        u('element', {tagName: 'hr', properties: {}}, []),
        u('text', '\n'),
        u('element', {tagName: 'ol', properties: {}}, [
          u('text', '\n'),
          u('element', {tagName: 'li', properties: {id: 'fn-1'}}, [
            u('text', 'bravo'),
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
    ]),
    'should render `footnote`s (#1)'
  )

  t.deepEqual(
    toHast(
      u('root', [
        u('footnoteDefinition', {identifier: '1'}, [
          u('paragraph', [u('text', 'bravo')])
        ]),
        u('footnoteReference', {identifier: '1'}),
        u('footnote', [u('text', 'charlie')])
      ])
    ),
    u('root', [
      u('element', {tagName: 'sup', properties: {id: 'fnref-1'}}, [
        u(
          'element',
          {
            tagName: 'a',
            properties: {href: '#fn-1', className: ['footnote-ref']}
          },
          [u('text', '1')]
        )
      ]),
      u('text', '\n'),
      u('element', {tagName: 'sup', properties: {id: 'fnref-2'}}, [
        u(
          'element',
          {
            tagName: 'a',
            properties: {href: '#fn-2', className: ['footnote-ref']}
          },
          [u('text', '2')]
        )
      ]),
      u('text', '\n'),
      u('element', {tagName: 'div', properties: {className: ['footnotes']}}, [
        u('text', '\n'),
        u('element', {tagName: 'hr', properties: {}}, []),
        u('text', '\n'),
        u('element', {tagName: 'ol', properties: {}}, [
          u('text', '\n'),
          u('element', {tagName: 'li', properties: {id: 'fn-1'}}, [
            u('text', 'bravo'),
            u(
              'element',
              {
                tagName: 'a',
                properties: {href: '#fnref-1', className: ['footnote-backref']}
              },
              [u('text', '↩')]
            )
          ]),
          u('text', '\n'),
          u('element', {tagName: 'li', properties: {id: 'fn-2'}}, [
            u('text', 'charlie'),
            u(
              'element',
              {
                tagName: 'a',
                properties: {href: '#fnref-2', className: ['footnote-backref']}
              },
              [u('text', '↩')]
            )
          ]),
          u('text', '\n')
        ]),
        u('text', '\n')
      ])
    ]),
    'should render `footnote`s (#2)'
  )

  t.deepEqual(
    toHast(
      u('root', [
        u('footnoteDefinition', {identifier: '1'}, [
          u('blockquote', [u('paragraph', [u('text', 'alpha')])])
        ]),
        u('paragraph', [u('footnoteReference', {identifier: '1'})])
      ])
    ),
    u('root', [
      u('element', {tagName: 'p', properties: {}}, [
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
      u('element', {tagName: 'div', properties: {className: ['footnotes']}}, [
        u('text', '\n'),
        u('element', {tagName: 'hr', properties: {}}, []),
        u('text', '\n'),
        u('element', {tagName: 'ol', properties: {}}, [
          u('text', '\n'),
          u('element', {tagName: 'li', properties: {id: 'fn-1'}}, [
            u('text', '\n'),
            u('element', {tagName: 'blockquote', properties: {}}, [
              u('text', '\n'),
              u('element', {tagName: 'p', properties: {}}, [
                u('text', 'alpha')
              ]),
              u('text', '\n')
            ]),
            u('text', '\n'),
            u('element', {tagName: 'p', properties: {}}, [
              u(
                'element',
                {
                  tagName: 'a',
                  properties: {
                    href: '#fnref-1',
                    className: ['footnote-backref']
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
      ])
    ]),
    'should render `footnote`s (#3)'
  )

  t.end()
})
