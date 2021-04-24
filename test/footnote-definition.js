import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('FootnoteDefinition', function (t) {
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
      u('element', {tagName: 'sup', properties: {id: 'fnref-zulu'}}, [
        u(
          'element',
          {
            tagName: 'a',
            properties: {href: '#fn-zulu', className: ['footnote-ref']}
          },
          [u('text', 'zulu')]
        )
      ]),
      u('text', '\n'),
      u('element', {tagName: 'div', properties: {className: ['footnotes']}}, [
        u('text', '\n'),
        u('element', {tagName: 'hr', properties: {}}, []),
        u('text', '\n'),
        u('element', {tagName: 'ol', properties: {}}, [
          u('text', '\n'),
          u('element', {tagName: 'li', properties: {id: 'fn-zulu'}}, [
            u('text', 'alpha'),
            u(
              'element',
              {
                tagName: 'a',
                properties: {
                  href: '#fnref-zulu',
                  className: ['footnote-backref']
                }
              },
              [u('text', '↩')]
            )
          ]),
          u('text', '\n')
        ]),
        u('text', '\n')
      ])
    ]),
    'should use the first `footnoteDefinition` if multiple exist'
  )

  t.end()
})
