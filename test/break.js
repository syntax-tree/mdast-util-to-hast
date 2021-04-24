import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Break', function (t) {
  t.deepEqual(
    toHast(
      u('paragraph', [u('text', 'bravo'), u('break'), u('text', 'charlie')])
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u('text', 'bravo'),
      u('element', {tagName: 'br', properties: {}}, []),
      u('text', '\n'),
      u('text', 'charlie')
    ]),
    'should transform `break` to `br`'
  )

  t.deepEqual(
    toHast(
      u('paragraph', [u('text', 'alpha'), u('break'), u('text', '  bravo')])
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u('text', 'alpha'),
      u('element', {tagName: 'br', properties: {}}, []),
      u('text', '\n'),
      u('text', 'bravo')
    ]),
    'should trim text after a `br` (#1)'
  )

  t.deepEqual(
    toHast(
      u('paragraph', [
        u('text', 'alpha'),
        u('break'),
        u('emphasis', [u('text', '  bravo')])
      ])
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u('text', 'alpha'),
      u('element', {tagName: 'br', properties: {}}, []),
      u('text', '\n'),
      u('element', {tagName: 'em', properties: {}}, [u('text', 'bravo')])
    ]),
    'should trim text after a `br` (#2)'
  )

  t.end()
})
