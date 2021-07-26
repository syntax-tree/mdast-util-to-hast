import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('ThematicBreak', (t) => {
  t.deepEqual(
    toHast(u('thematicBreak')),
    u('element', {tagName: 'hr', properties: {}}, []),
    'should transform `thematicBreak` to `hr`'
  )

  t.end()
})
