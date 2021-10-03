import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('FootnoteReference', (t) => {
  t.deepEqual(
    toHast(u('footnoteReference', {identifier: 'alpha'})),
    u('element', {tagName: 'sup', properties: {}}, [
      u(
        'element',
        {
          tagName: 'a',
          properties: {
            href: '#user-content-fn-alpha',
            id: 'user-content-fnref-alpha',
            dataFootnoteRef: true,
            ariaDescribedBy: 'footnote-label'
          }
        },
        [u('text', '1')]
      )
    ]),
    'should render `footnoteReference`s'
  )

  t.deepEqual(
    toHast(u('footnoteReference', {identifier: 'alpha', label: 'Alpha'})),
    u('element', {tagName: 'sup', properties: {}}, [
      u(
        'element',
        {
          tagName: 'a',
          properties: {
            href: '#user-content-fn-alpha',
            id: 'user-content-fnref-alpha',
            dataFootnoteRef: true,
            ariaDescribedBy: 'footnote-label'
          }
        },
        [u('text', '1')]
      )
    ]),
    'should render `footnoteReference`s (#2)'
  )

  t.deepEqual(
    // @ts-expect-error: supposed to be string.
    toHast(u('footnoteReference', {identifier: 1})),
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
    ]),
    'should not fail on non-string identifiers'
  )

  t.end()
})
