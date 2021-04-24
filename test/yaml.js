import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('YAML', function (t) {
  t.equal(toHast(u('yaml', 'kilo: "lima"')), null, 'should ignore `yaml`')

  t.end()
})
