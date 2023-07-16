import assert from 'node:assert/strict'
import test from 'node:test'
import {toHast} from '../index.js'

test('HTML', async function (t) {
  await t.test('should ignore `html`', async function () {
    assert.equal(toHast({type: 'html', value: '<alpha></alpha>'}), undefined)
  })

  await t.test(
    'should transform `html` to `raw` if `allowDangerousHtml` is given',
    async function () {
      assert.deepEqual(
        toHast(
          {type: 'html', value: '<alpha></alpha>'},
          {allowDangerousHtml: true}
        ),
        {type: 'raw', value: '<alpha></alpha>'}
      )
    }
  )
})
