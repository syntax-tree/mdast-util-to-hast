import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from 'mdast-util-to-hast'

test('imageReference', async function (t) {
  await t.test(
    'should fall back on `imageReference`s without definition',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'imageReference',
          referenceType: 'shortcut',
          identifier: 'alpha',
          alt: 'bravo'
        }),
        {type: 'root', children: [{type: 'text', value: '![bravo]'}]}
      )
    }
  )

  await t.test('should fall back on full `imageReference`s', async function () {
    assert.deepEqual(
      toHast({
        type: 'imageReference',
        identifier: 'charlie',
        referenceType: 'full',
        alt: 'delta'
      }),
      {type: 'root', children: [{type: 'text', value: '![delta][charlie]'}]}
    )
  })

  await t.test(
    'should fall back on collapsed `imageReference`s',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'imageReference',
          identifier: 'echo',
          referenceType: 'collapsed',
          alt: 'foxtrot'
        }),
        {type: 'root', children: [{type: 'text', value: '![foxtrot][]'}]}
      )
    }
  )

  await t.test(
    'should transform `imageReference`s to `img`s (1)',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'root',
          children: [
            // @ts-expect-error: check how missing `referenceType` is handled.
            {type: 'imageReference', identifier: 'golf', alt: 'hotel'},
            {type: 'definition', identifier: 'golf', url: 'india', title: 'x'}
          ]
        }),
        h(null, [h('img', {src: 'india', alt: 'hotel', title: 'x'})])
      )
    }
  )

  await t.test(
    'should transform `imageReference`s with an empty defined url to `img`s',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'root',
          children: [
            // @ts-expect-error: check how missing `referenceType` is handled.
            {type: 'imageReference', identifier: 'juliett', alt: 'kilo'},
            {type: 'definition', identifier: 'juliett', url: ''}
          ]
        }),
        h(null, [h('img', {src: '', alt: 'kilo'})])
      )
    }
  )

  await t.test(
    'should fall back on the label on a full `imageReference` (GH-22)',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'imageReference',
          identifier: 'lima',
          label: 'Lima',
          referenceType: 'full',
          alt: 'mike'
        }),
        {type: 'root', children: [{type: 'text', value: '![mike][Lima]'}]}
      )
    }
  )
})
