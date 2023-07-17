import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from 'mdast-util-to-hast'

test('root', async function (t) {
  await t.test('should map `root`s', async function () {
    assert.deepEqual(toHast({type: 'root', children: []}), h(null))
  })

  await t.test('should transform root nodes w/ `hName`', async function () {
    assert.deepEqual(
      toHast({
        type: 'root',
        children: [{type: 'text', value: 'alpha'}],
        data: {hName: 'article'}
      }),
      h('article', 'alpha')
    )
  })

  await t.test(
    'should transform root nodes w/ `hName`, `hProperties`',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'root',
          children: [{type: 'text', value: 'alpha'}],
          data: {hName: 'article', hProperties: {className: ['bravo']}}
        }),
        h('article.bravo', 'alpha')
      )
    }
  )

  await t.test(
    'should transform root nodes w/ `hName`, `hChildren`',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'root',
          children: [{type: 'text', value: 'alpha'}],
          data: {
            hName: 'article',
            hChildren: [
              {
                type: 'element',
                tagName: 'section',
                properties: {},
                children: [{type: 'text', value: 'bravo'}]
              }
            ]
          }
        }),
        h('article', h('section', 'bravo'))
      )
    }
  )
})
