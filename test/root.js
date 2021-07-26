import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Root', (t) => {
  t.deepEqual(toHast(u('root', [])), u('root', []), 'should map `root`s')

  t.end()
})
