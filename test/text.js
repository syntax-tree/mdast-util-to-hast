import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Nodes', function (t) {
  t.deepEqual(
    toHast(u('text', 'alpha')),
    u('text', 'alpha'),
    'should map `text`s'
  )

  t.deepEqual(
    toHast(u('text', 'alpha \n \n bravo')),
    u('text', 'alpha\n\nbravo'),
    'should trim spaces and tabs around eols'
  )

  t.deepEqual(
    toHast(u('text', {data: {hName: 'span'}}, 'charlie')),
    u('element', {tagName: 'span', properties: {}}, []),
    'should transform text nodes w/ `hName` to an `element`'
  )

  t.deepEqual(
    toHast(u('text', {data: {hProperties: {className: 'delta'}}}, 'echo')),
    {type: 'text', value: 'echo'},
    'should not transform text nodes w/ `hProperties` w/o `hName` to an `element`'
  )

  t.deepEqual(
    toHast(
      u(
        'text',
        {data: {hName: 'span', hProperties: {className: ['foxtrot']}}},
        'golf'
      )
    ),
    u('element', {tagName: 'span', properties: {className: ['foxtrot']}}, []),
    'should transform text nodes w/ `hProperties` and `hName` to an `element`'
  )

  t.deepEqual(
    toHast(
      u('text', {data: {hChildren: [{type: 'text', value: 'hotel'}]}}, 'india')
    ),
    {type: 'text', value: 'india'},
    'should not transform text nodes w/ `hChildren` w/o `hName` to an `element`'
  )

  t.deepEqual(
    toHast(
      u(
        'text',
        {data: {hName: 'span', hChildren: [{type: 'text', value: 'juliett'}]}},
        'kilo'
      )
    ),
    u('element', {tagName: 'span', properties: {}}, [
      {type: 'text', value: 'juliett'}
    ]),
    'should transform text nodes w/ `hChildren` and `hName` to an `element`'
  )

  t.end()
})
