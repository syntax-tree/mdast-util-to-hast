/**
 * @typedef {import('mdast').Paragraph} Paragraph
 */

import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Definition', (t) => {
  t.equal(
    toHast(
      u('definition', {
        url: 'https://uniform.whiskey',
        identifier: 'x-ray',
        title: 'yankee'
      })
    ),
    null,
    'should ignore `definition`'
  )

  t.deepEqual(
    toHast(
      /** @type {Paragraph} */ (
        u('paragraph', [
          u('linkReference', {identifier: 'alpha', referenceType: 'shortcut'}, [
            u('text', 'bravo')
          ]),
          u('definition', {identifier: 'alpha', url: 'https://charlie.com'}),
          u('definition', {identifier: 'alpha', url: 'https://delta.com'})
        ])
      )
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u('element', {tagName: 'a', properties: {href: 'https://charlie.com'}}, [
        u('text', 'bravo')
      ])
    ]),
    'should prefer the first definition by default'
  )

  t.end()
})
