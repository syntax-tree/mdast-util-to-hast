import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('definition', async function (t) {
  await t.test('should ignore `definition`', async function () {
    assert.deepEqual(
      toHast({
        type: 'definition',
        identifier: 'alpha',
        url: 'bravo'
      }),
      {type: 'root', children: []}
    )
  })

  await t.test('should prefer the first definition', async function () {
    assert.deepEqual(
      toHast({
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'linkReference',
                identifier: 'charlie',
                referenceType: 'shortcut',
                children: [{type: 'text', value: 'charlie'}]
              }
            ]
          },
          {type: 'definition', identifier: 'charlie', url: 'delta'},
          {type: 'definition', identifier: 'charlie', url: 'echo'}
        ]
      }),
      h(null, [h('p', [h('a', {href: 'delta'}, 'charlie')])])
    )
  })
})
