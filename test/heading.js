/**
 * @typedef {import('mdast').Heading} Heading
 */

import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Heading', (t) => {
  t.deepEqual(
    toHast(
      /** @type {Heading} */ (u('heading', {depth: 4}, [u('text', 'echo')]))
    ),
    u('element', {tagName: 'h4', properties: {}}, [u('text', 'echo')]),
    'should transform `heading` to a `h[1-6]` element'
  )

  t.end()
})
