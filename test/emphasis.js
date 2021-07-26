import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Emphasis', (t) => {
  t.deepEqual(
    toHast(u('emphasis', [u('text', 'delta')])),
    u('element', {tagName: 'em', properties: {}}, [u('text', 'delta')]),
    'should transform `emphasis` to `em`'
  )

  t.end()
})
