import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from 'mdast-util-to-hast'

test('linkReference', async function (t) {
  await t.test(
    'should fall back on `linkReference`s without definition',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'linkReference',
          identifier: 'alpha',
          referenceType: 'shortcut',
          children: [{type: 'text', value: 'alpha'}]
        }),
        h(null, '[alpha]')
      )
    }
  )

  await t.test('should fall back on full `linkReference`s', async function () {
    assert.deepEqual(
      toHast({
        type: 'linkReference',
        identifier: 'bravo',
        referenceType: 'full',
        children: [{type: 'text', value: 'charlie'}]
      }),
      h(null, '[charlie][bravo]')
    )
  })

  await t.test(
    'should fall back on collapsed `linkReference`s',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'linkReference',
          identifier: 'delta',
          referenceType: 'collapsed',
          children: [{type: 'text', value: 'delta'}]
        }),
        h(null, '[delta][]')
      )
    }
  )

  await t.test(
    'should fall back on the label on a full `linkReference` (GH-22)',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'linkReference',
          identifier: 'x',
          label: 'X',
          referenceType: 'full',
          children: [{type: 'text', value: 'y'}]
        }),
        h(null, '[y][X]')
      )
    }
  )

  await t.test(
    'should support link references with non-text content',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'linkReference',
          identifier: 'echo',
          referenceType: 'full',
          children: [{type: 'inlineCode', value: 'foxtrot'}]
        }),
        h(null, ['[', h('code', 'foxtrot'), '][echo]'])
      )
    }
  )

  await t.test('should transform `linkReference`s to `a`s', async function () {
    assert.deepEqual(
      toHast({
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'linkReference',
                identifier: 'golf',
                referenceType: 'full',
                children: [{type: 'text', value: 'hotel'}]
              }
            ]
          },
          {type: 'definition', identifier: 'golf', url: 'india', title: 'x'}
        ]
      }),
      h(null, [h('p', [h('a', {href: 'india', title: 'x'}, 'hotel')])])
    )
  })

  await t.test(
    'should transform `linkReference`s with an empty defined url to `a`s',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'linkReference',
                  identifier: 'juliett',
                  referenceType: 'full',
                  children: [{type: 'text', value: 'kilo'}]
                }
              ]
            },
            {type: 'definition', identifier: 'juliett', url: ''}
          ]
        }),
        h(null, [h('p', [h('a', {href: ''}, 'kilo')])])
      )
    }
  )
})
