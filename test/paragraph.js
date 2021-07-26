import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Paragraph', (t) => {
  t.deepEqual(
    toHast(u('paragraph', [u('text', 'bravo')])),
    u('element', {tagName: 'p', properties: {}}, [u('text', 'bravo')]),
    'should transform `paragraph` to a `p` element'
  )

  t.end()
})
