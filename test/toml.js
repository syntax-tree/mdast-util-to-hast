import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('TOML', (t) => {
  // @ts-expect-error: custom node.
  t.equal(toHast(u('toml', 'kilo: "lima"')), null, 'should ignore `toml`')

  t.end()
})
