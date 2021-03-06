import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Definition', function (t) {
  t.equal(
    toHast(
      u('definition', {
        url: 'https://uniform.whiskey',
        identifier: 'x-ray',
        title: 'yankee'
      })
    ),
    null,
    'should ignore `definition`'
  )

  t.deepEqual(
    toHast(
      u('paragraph', [
        u('linkReference', {identifier: 'alpha'}, [u('text', 'bravo')]),
        u('definition', {identifier: 'alpha', url: 'https://charlie.com'}),
        u('definition', {identifier: 'alpha', url: 'https://delta.com'})
      ])
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u('element', {tagName: 'a', properties: {href: 'https://charlie.com'}}, [
        u('text', 'bravo')
      ])
    ]),
    'should prefer the first definition by default'
  )

  t.end()
})
