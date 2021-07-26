import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('InlineCode', (t) => {
  t.deepEqual(
    toHast(u('inlineCode', 'juliett()')),
    u('element', {tagName: 'code', properties: {}}, [u('text', 'juliett()')]),
    'should transform `inlineCode` to a `code` element'
  )

  t.deepEqual(
    toHast(u('inlineCode', 'a\tb')),
    u('element', {tagName: 'code', properties: {}}, [u('text', 'a\tb')]),
    'should support tabs in inline code'
  )

  t.deepEqual(
    toHast(u('inlineCode', 'a\nb')),
    u('element', {tagName: 'code', properties: {}}, [u('text', 'a b')]),
    'should change eols to spaces in inline code'
  )

  t.end()
})
