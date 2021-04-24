import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Strong', function (t) {
  t.deepEqual(
    toHast(u('strong', [u('text', 'echo')])),
    u('element', {tagName: 'strong', properties: {}}, [u('text', 'echo')]),
    'should transform `strong` to `strong`'
  )

  t.end()
})
