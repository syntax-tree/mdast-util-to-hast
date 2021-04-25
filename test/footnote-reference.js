import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('FootnoteReference', function (t) {
  t.deepEqual(
    toHast(u('footnoteReference', {identifier: 'alpha'})),
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
    'should render `footnoteReference`s'
  )

  t.deepEqual(
    toHast(u('footnoteReference', {identifier: 'alpha', label: 'Alpha'})),
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
    'should render `footnoteReference`s (#2)'
  )

  t.deepEqual(
    toHast(u('footnoteReference', {identifier: 1})),
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
    'should not fail on non-string identifiers'
  )

  t.end()
})
