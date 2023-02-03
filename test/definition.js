import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('definition', () => {
  assert.equal(
    toHast({
      type: 'definition',
      identifier: 'alpha',
      url: 'bravo'
    }),
    null,
    'should ignore `definition`'
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
    h(null, [h('p', [h('a', {href: 'delta'}, 'charlie')])]),
    'should prefer the first definition'
  )
})
