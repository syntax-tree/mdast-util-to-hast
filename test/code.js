import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Code', function (t) {
  t.deepEqual(
    toHast(u('code', 'foxtrot()\ngolf.hotel()')),
    u('element', {tagName: 'pre', properties: {}}, [
      u('element', {tagName: 'code', properties: {}}, [
        u('text', 'foxtrot()\ngolf.hotel()\n')
      ])
    ]),
    'should transform `code` to a `pre` element (#1)'
  )

  t.deepEqual(
    toHast(u('code', '')),
    u('element', {tagName: 'pre', properties: {}}, [
      u('element', {tagName: 'code', properties: {}}, [u('text', '')])
    ]),
    'should transform `code` to a `pre` element (#2)'
  )

  t.deepEqual(
    toHast(u('code', {lang: 'js'}, 'india()')),
    u('element', {tagName: 'pre', properties: {}}, [
      u(
        'element',
        {tagName: 'code', properties: {className: ['language-js']}},
        [u('text', 'india()\n')]
      )
    ]),
    'should transform `code` to a `pre` element with language class'
  )

  t.deepEqual(
    toHast(u('code', {lang: 'js', meta: 'juliett'}, 'kilo()')),
    u('element', {tagName: 'pre', properties: {}}, [
      u(
        'element',
        {
          tagName: 'code',
          properties: {className: ['language-js']},
          data: {meta: 'juliett'}
        },
        [u('text', 'kilo()\n')]
      )
    ]),
    'should support `meta`'
  )

  t.deepEqual(
    toHast(u('code', '\ta')),
    u('element', {tagName: 'pre', properties: {}}, [
      u('element', {tagName: 'code', properties: {}}, [u('text', '\ta\n')])
    ]),
    'should support tabs in code'
  )

  t.end()
})
