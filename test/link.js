import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('link', () => {
  assert.deepEqual(
    toHast({
      type: 'link',
      url: 'alpha',
      title: 'bravo',
      children: [{type: 'text', value: 'charlie'}]
    }),
    h('a', {href: 'alpha', title: 'bravo'}, ['charlie']),
    'should transform `link` to `a`'
  )

  assert.deepEqual(
    toHast({
      type: 'link',
      url: 'delta',
      children: [{type: 'text', value: 'echo'}]
    }),
    h('a', {href: 'delta'}, ['echo']),
    'should transform `link` to `a` (w/o `title`)'
  )

  assert.deepEqual(
    toHast({
      type: 'link',
      url: 'https://github.com/facebook/react/pulls?q=is%3Apr%20is%3Aclosed',
      children: [{type: 'text', value: 'foxtrot'}]
    }),
    h(
      'a',
      {href: 'https://github.com/facebook/react/pulls?q=is%3Apr%20is%3Aclosed'},
      ['foxtrot']
    ),
    'should correctly decode/encode urls'
  )

  assert.deepEqual(
    toHast({
      type: 'link',
      url: 'https://a.com/b.png#c=d&e=f',
      children: [{type: 'text', value: 'golf'}]
    }),
    h('a', {href: 'https://a.com/b.png#c=d&e=f'}, ['golf']),
    'should correctly decode/encode dangerous characters'
  )
})
