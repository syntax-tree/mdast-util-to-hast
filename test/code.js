import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('code', () => {
  assert.deepEqual(
    toHast({type: 'code', value: 'alpha()\nbravo.charlie()'}),
    h('pre', [h('code', 'alpha()\nbravo.charlie()\n')]),
    'should transform `code` to a `pre` element (#1)'
  )

  assert.deepEqual(
    toHast({type: 'code', value: ''}),
    h('pre', [h('code', '')]),
    'should transform `code` to a `pre` element (#2)'
  )

  assert.deepEqual(
    toHast({type: 'code', lang: 'js', value: 'delta()'}),
    h('pre', [h('code', {className: ['language-js']}, 'delta()\n')]),
    'should transform `code` to a `pre` element with language class'
  )

  assert.deepEqual(
    toHast({type: 'code', lang: 'js', meta: 'echo', value: 'foxtrot()'}),
    h('pre', [
      {
        type: 'element',
        tagName: 'code',
        properties: {className: ['language-js']},
        data: {meta: 'echo'},
        children: [{type: 'text', value: 'foxtrot()\n'}]
      }
    ]),
    'should support `meta`'
  )

  assert.deepEqual(
    toHast({type: 'code', value: '\ta'}),
    h('pre', [h('code', '\ta\n')]),
    'should support tabs in code'
  )
})
