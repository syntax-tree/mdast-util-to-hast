import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Blockquote', (t) => {
  t.deepEqual(
    toHast(
      u('blockquote', [
        u('paragraph', [u('text', 'charlie')]),
        u('paragraph', [u('text', 'delta')])
      ])
    ),
    u('element', {tagName: 'blockquote', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [u('text', 'charlie')]),
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [u('text', 'delta')]),
      u('text', '\n')
    ]),
    'should transform `blockquote` to a `blockquote` element'
  )

  t.end()
})
