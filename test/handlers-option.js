import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'
import {all} from '../lib/all.js'

test('handlers option', function (t) {
  t.deepEqual(
    toHast(u('paragraph', [u('text', 'bravo')]), {
      handlers: {
        paragraph(h, node) {
          node.children[0].value = 'changed'
          return h(node, 'p', all(h, node))
        }
      }
    }),
    u('element', {tagName: 'p', properties: {}}, [u('text', 'changed')]),
    'should override default handler'
  )

  var customMdast = u('paragraph', [
    u('custom', 'with value'),
    u('custom', [u('image', {url: 'with-children.png'})]),
    u('text', 'bravo')
  ])

  t.deepEqual(
    toHast(customMdast, {}),
    u('element', {tagName: 'p', properties: {}}, [
      u('text', 'with value'),
      u('element', {tagName: 'div', properties: {}}, [
        u(
          'element',
          {
            tagName: 'img',
            properties: {src: 'with-children.png', alt: undefined}
          },
          []
        )
      ]),
      u('text', 'bravo')
    ]),
    'should use default unknown-handler'
  )

  t.deepEqual(
    toHast(customMdast, {
      // @ts-ignore `hast` expected, but this returns unknown mdast nodes.
      unknownHandler(_, node) {
        return node
      }
    }),
    u('element', {tagName: 'p', properties: {}}, [
      u('custom', 'with value'),
      u('custom', [u('image', {url: 'with-children.png'})]),
      u('text', 'bravo')
    ]),
    'should use an `unknownHandler`'
  )

  t.deepEqual(
    toHast(customMdast, {passThrough: ['custom']}),
    u('element', {tagName: 'p', properties: {}}, [
      u('custom', 'with value'),
      u('custom', [
        u(
          'element',
          {
            tagName: 'img',
            properties: {src: 'with-children.png', alt: undefined}
          },
          []
        )
      ]),
      u('text', 'bravo')
    ]),
    'should use `passThrough`'
  )

  t.end()
})
