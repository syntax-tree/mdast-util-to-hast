import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Delete', (t) => {
  t.deepEqual(
    toHast(u('delete', [u('text', 'foxtrot')])),
    u('element', {tagName: 'del', properties: {}}, [u('text', 'foxtrot')]),
    'should transform `delete` to `del`'
  )

  t.end()
})
