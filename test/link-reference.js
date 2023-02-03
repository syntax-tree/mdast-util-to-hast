import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('linkReference', () => {
  assert.deepEqual(
    toHast({
      type: 'linkReference',
      identifier: 'alpha',
      referenceType: 'shortcut',
      children: [{type: 'text', value: 'alpha'}]
    }),
    h(null, '[alpha]'),
    'should fall back on `linkReference`s without definition'
  )

  assert.deepEqual(
    toHast({
      type: 'linkReference',
      identifier: 'bravo',
      referenceType: 'full',
      children: [{type: 'text', value: 'charlie'}]
    }),
    h(null, '[charlie][bravo]'),
    'should fall back on full `linkReference`s'
  )

  assert.deepEqual(
    toHast({
      type: 'linkReference',
      identifier: 'delta',
      referenceType: 'collapsed',
      children: [{type: 'text', value: 'delta'}]
    }),
    h(null, '[delta][]'),
    'should fall back on collapsed `linkReference`s'
  )

  assert.deepEqual(
    toHast({
      type: 'linkReference',
      identifier: 'x',
      label: 'X',
      referenceType: 'full',
      children: [{type: 'text', value: 'y'}]
    }),
    h(null, '[y][X]'),
    'should fall back on the label on a full `linkReference` (GH-22)'
  )

  assert.deepEqual(
    toHast({
      type: 'linkReference',
      identifier: 'echo',
      referenceType: 'full',
      children: [{type: 'inlineCode', value: 'foxtrot'}]
    }),
    h(null, ['[', h('code', 'foxtrot'), '][echo]']),
    'should support link references with non-text content'
  )

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
        {type: 'definition', identifier: 'golf', url: 'india'}
      ]
    }),
    h(null, [h('p', [h('a', {href: 'india'}, 'hotel')])]),
    'should transform `linkReference`s to `a`s'
  )

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
    h(null, [h('p', [h('a', {href: ''}, 'kilo')])]),
    'should transform `linkReference`s with an empty defined url to `a`s'
  )
})
