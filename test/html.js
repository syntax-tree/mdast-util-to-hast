import assert from 'node:assert/strict'
import test from 'node:test'
import {toHast} from '../index.js'

test('HTML', () => {
  assert.equal(
    toHast({type: 'html', value: '<alpha></alpha>'}),
    null,
    'should ignore `html`'
  )

  assert.deepEqual(
    toHast(
      {type: 'html', value: '<alpha></alpha>'},
      {allowDangerousHtml: true}
    ),
    {type: 'raw', value: '<alpha></alpha>'},
    'should transform `html` to `raw` if `allowDangerousHtml` is given'
  )
})
