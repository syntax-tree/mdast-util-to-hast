import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from 'mdast-util-to-hast'

test('text', async function (t) {
  await t.test('should map `text`s', async function () {
    assert.deepEqual(toHast({type: 'text', value: 'alpha'}), {
      type: 'text',
      value: 'alpha'
    })
  })

  await t.test('should trim spaces and tabs around eols', async function () {
    assert.deepEqual(toHast({type: 'text', value: 'bravo \n \n charlie'}), {
      type: 'text',
      value: 'bravo\n\ncharlie'
    })
  })

  await t.test(
    'should transform text nodes w/ `hName` to an `element`',
    async function () {
      assert.deepEqual(
        toHast({type: 'text', value: 'delta', data: {hName: 'span'}}),
        h('span', 'delta')
      )
    }
  )

  await t.test(
    'should ignore `hProperties` on text nodes w/o `hName`',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'text',
          value: 'echo',
          data: {hProperties: {className: ['foxtrot']}}
        }),
        {type: 'text', value: 'echo'}
      )
    }
  )

  await t.test(
    'should transform text nodes w/ `hProperties` and `hName` to an `element`',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'text',
          value: 'golf',
          data: {hName: 'span', hProperties: {className: ['hotel']}}
        }),
        h('span.hotel', 'golf')
      )
    }
  )

  await t.test(
    'should not transform text nodes w/ `hChildren` w/o `hName` to an `element`',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'text',
          value: 'india',
          data: {hChildren: [{type: 'text', value: 'juliett'}]}
        }),
        {type: 'text', value: 'india'}
      )
    }
  )

  await t.test(
    'should transform text nodes w/ `hChildren` and `hName` to an `element`',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'text',
          value: 'kilo',
          data: {hName: 'span', hChildren: [{type: 'text', value: 'lima'}]}
        }),
        h('span', 'lima')
      )
    }
  )
})
