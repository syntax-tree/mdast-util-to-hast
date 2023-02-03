import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('image', () => {
  assert.deepEqual(
    toHast({type: 'image', url: 'alpha', alt: 'bravo', title: 'charlie'}),
    h('img', {
      src: 'alpha',
      alt: 'bravo',
      title: 'charlie'
    }),
    'should transform `image` to `img`'
  )

  assert.deepEqual(
    toHast({type: 'image', url: 'delta', alt: 'echo'}),
    h('img', {src: 'delta', alt: 'echo'}),
    'should transform `image` to `img` (missing `title`)'
  )
})
