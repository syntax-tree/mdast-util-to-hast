/**
 * @typedef {import('mdast').ImageReference} ImageReference
 * @typedef {import('mdast').Paragraph} Paragraph
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('imageReference', () => {
  assert.deepEqual(
    toHast(
      // @ts-expect-error: reference type missing.
      {type: 'imageReference', identifier: 'alpha', alt: 'bravo'}
    ),
    {type: 'text', value: '![bravo]'},
    'should fall back on `imageReference`s without definition'
  )

  assert.deepEqual(
    toHast({
      type: 'imageReference',
      identifier: 'charlie',
      referenceType: 'full',
      alt: 'delta'
    }),
    {type: 'text', value: '![delta][charlie]'},
    'should fall back on full `imageReference`s'
  )

  assert.deepEqual(
    toHast({
      type: 'imageReference',
      identifier: 'echo',
      referenceType: 'collapsed',
      alt: 'foxtrot'
    }),
    {type: 'text', value: '![foxtrot][]'},
    'should fall back on collapsed `imageReference`s'
  )

  assert.deepEqual(
    toHast({
      type: 'root',
      children: [
        // @ts-expect-error: reference type missing.
        {type: 'imageReference', identifier: 'golf', alt: 'hotel'},
        {type: 'definition', identifier: 'golf', url: 'india', title: 'x'}
      ]
    }),
    h(null, [h('img', {src: 'india', alt: 'hotel', title: 'x'})]),
    'should transform `imageReference`s to `img`s (1)'
  )

  assert.deepEqual(
    toHast({
      type: 'root',
      children: [
        // @ts-expect-error: reference type missing.
        {type: 'imageReference', identifier: 'juliett', alt: 'kilo'},
        {type: 'definition', identifier: 'juliett', url: ''}
      ]
    }),
    h(null, [h('img', {src: '', alt: 'kilo'})]),
    'should transform `imageReference`s with an empty defined url to `img`s'
  )

  assert.deepEqual(
    toHast({
      type: 'imageReference',
      identifier: 'lima',
      label: 'Lima',
      referenceType: 'full',
      alt: 'mike'
    }),
    {type: 'text', value: '![mike][Lima]'},
    'should fall back on the label on a full `imageReference` (GH-22)'
  )
})
