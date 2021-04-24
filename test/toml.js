import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('TOML', function (t) {
  t.equal(toHast(u('toml', 'kilo: "lima"')), null, 'should ignore `toml`')

  t.end()
})
