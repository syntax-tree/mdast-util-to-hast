import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from 'mdast-util-to-hast'

test('link', async function (t) {
  await t.test('should transform `link` to `a`', async function () {
    assert.deepEqual(
      toHast({
        type: 'link',
        url: 'alpha',
        title: 'bravo',
        children: [{type: 'text', value: 'charlie'}]
      }),
      h('a', {href: 'alpha', title: 'bravo'}, ['charlie'])
    )
  })

  await t.test(
    'should transform `link` to `a` (w/o `title`)',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'link',
          url: 'delta',
          children: [{type: 'text', value: 'echo'}]
        }),
        h('a', {href: 'delta'}, ['echo'])
      )
    }
  )

  await t.test('should correctly decode/encode urls', async function () {
    assert.deepEqual(
      toHast({
        type: 'link',
        url: 'https://github.com/facebook/react/pulls?q=is%3Apr%20is%3Aclosed',
        children: [{type: 'text', value: 'foxtrot'}]
      }),
      h(
        'a',
        {
          href: 'https://github.com/facebook/react/pulls?q=is%3Apr%20is%3Aclosed'
        },
        ['foxtrot']
      )
    )
  })

  await t.test(
    'should correctly decode/encode dangerous characters',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'link',
          url: 'https://a.com/b.png#c=d&e=f',
          children: [{type: 'text', value: 'golf'}]
        }),
        h('a', {href: 'https://a.com/b.png#c=d&e=f'}, ['golf'])
      )
    }
  )
})
