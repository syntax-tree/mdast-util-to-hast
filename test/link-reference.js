/**
 * @typedef {import('mdast').LinkReference} LinkReference
 * @typedef {import('mdast').Paragraph} Paragraph
 */

import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('LinkReference', (t) => {
  t.deepEqual(
    toHast(
      /** @type {LinkReference} */ (
        u('linkReference', {identifier: 'bravo'}, [u('text', 'bravo')])
      )
    ),
    u('root', [u('text', '[bravo]')]),
    'should fall back on `linkReference`s without definition'
  )

  t.deepEqual(
    toHast(
      /** @type {LinkReference} */ (
        u('linkReference', {identifier: 'delta', referenceType: 'full'}, [
          u('text', 'echo')
        ])
      )
    ),
    u('root', [u('text', '[echo][delta]')]),
    'should fall back on full `linkReference`s'
  )

  t.deepEqual(
    toHast(
      /** @type {LinkReference} */ (
        u('linkReference', {identifier: 'hotel', referenceType: 'collapsed'}, [
          u('text', 'hotel')
        ])
      )
    ),
    u('root', [u('text', '[hotel][]')]),
    'should fall back on collapsed `linkReference`s'
  )

  t.deepEqual(
    toHast(
      /** @type {LinkReference} */ (
        u('linkReference', {identifier: 'bravo', referenceType: 'full'}, [
          u('inlineCode', 'alpha')
        ])
      )
    ),
    u('root', [
      u('text', '['),
      u('element', {tagName: 'code', properties: {}}, [u('text', 'alpha')]),
      u('text', '][bravo]')
    ]),
    'should support link references with non-text content'
  )

  t.deepEqual(
    toHast(
      /** @type {Paragraph} */ (
        u('paragraph', [
          u('linkReference', {identifier: 'juliett'}, [u('text', 'kilo')]),
          u('definition', {
            identifier: 'juliett',
            url: 'https://kilo.lima/mike',
            title: 'november'
          })
        ])
      )
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u(
        'element',
        {
          tagName: 'a',
          properties: {href: 'https://kilo.lima/mike', title: 'november'}
        },
        [u('text', 'kilo')]
      )
    ]),
    'should transform `linkReference`s to `a`s'
  )

  t.deepEqual(
    toHast(
      /** @type {Paragraph} */ (
        u('paragraph', [
          u('linkReference', {identifier: 'juliett'}, [u('text', 'kilo')]),
          u('definition', {identifier: 'juliett', url: ''})
        ])
      )
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u('element', {tagName: 'a', properties: {href: ''}}, [u('text', 'kilo')])
    ]),
    'should transform `linkReference`s with an empty defined url to `a`s'
  )

  t.deepEqual(
    toHast(
      /** @type {LinkReference} */ (
        u(
          'linkReference',
          {identifier: 'oscar', label: 'Oscar', referenceType: 'full'},
          [u('text', 'papa')]
        )
      )
    ),
    u('root', [u('text', '[papa][Oscar]')]),
    'should fall back on the label on a full `linkReference` (GH-22)'
  )

  t.end()
})
