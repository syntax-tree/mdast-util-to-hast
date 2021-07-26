import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('toHast()', (t) => {
  t.throws(
    () => {
      // @ts-ignore runtime.
      toHast(u('bar', [true]))
    },
    /Expected node, got `true`/,
    'should throw on non-nodes'
  )

  t.deepEqual(
    toHast(u('strong', {data: {hName: 'b'}}, [u('text', 'tango')])),
    u('element', {tagName: 'b', properties: {}}, [u('text', 'tango')]),
    'should prefer `data.hName` to tag-names'
  )

  t.deepEqual(
    toHast(
      u(
        'strong',
        {
          data: {
            hChildren: [
              u('element', {tagName: 'i', properties: {}}, [u('text', 'tango')])
            ]
          }
        },
        [u('text', 'uniform')]
      )
    ),
    u('element', {tagName: 'strong', properties: {}}, [
      u('element', {tagName: 'i', properties: {}}, [u('text', 'tango')])
    ]),
    'should prefer `data.hChildren` to children'
  )

  t.deepEqual(
    toHast(
      u(
        'emphasis',
        {
          position: {
            start: {line: 2, column: 3},
            end: {line: 2, column: 12}
          }
        },
        [u('text', 'tango')]
      )
    ),
    u(
      'element',
      {
        tagName: 'em',
        properties: {},
        position: {
          start: {line: 2, column: 3, offset: null},
          end: {line: 2, column: 12, offset: null}
        }
      },
      [u('text', 'tango')]
    ),
    'should patch `position`s when given'
  )

  t.deepEqual(
    toHast(
      u(
        'code',
        {
          position: {
            start: {line: 1, column: 1},
            end: {line: 3, column: 4}
          }
        },
        'tango'
      )
    ),
    u(
      'element',
      {
        tagName: 'pre',
        properties: {},
        position: {
          start: {line: 1, column: 1, offset: null},
          end: {line: 3, column: 4, offset: null}
        }
      },
      [
        u(
          'element',
          {
            tagName: 'code',
            properties: {},
            position: {
              start: {line: 1, column: 1, offset: null},
              end: {line: 3, column: 4, offset: null}
            }
          },
          [u('text', 'tango\n')]
        )
      ]
    ),
    'should patch `position`s on `pre` and `code`'
  )

  t.deepEqual(
    toHast(u('foo', 'tango')),
    u('text', 'tango'),
    'should transform unknown texts to `text`'
  )

  t.deepEqual(
    toHast(u('bar', [u('text', 'tango')])),
    u('element', {tagName: 'div', properties: {}}, [u('text', 'tango')]),
    'should transform unknown parents to `div`'
  )

  t.deepEqual(
    toHast(u('bar')),
    u('element', {tagName: 'div', properties: {}}, []),
    'should transform unknown nodes to `div`'
  )

  t.deepEqual(
    toHast(
      u(
        'foo',
        {
          data: {
            hName: 'code',
            hProperties: {className: 'charlie'},
            hChildren: [u('text', 'tango')]
          }
        },
        'tango'
      )
    ),
    u('element', {tagName: 'code', properties: {className: 'charlie'}}, [
      u('text', 'tango')
    ]),
    'should transform unknown nodes with `data.h*` properties'
  )

  t.deepEqual(
    toHast(u('foo', {data: {hChildren: [u('text', 'tango')]}}, 'tango')),
    u('element', {tagName: 'div', properties: {}}, [u('text', 'tango')]),
    'should transform unknown nodes with `data.hChildren` only to `div`'
  )

  t.deepEqual(
    toHast(u('foo', {data: {hProperties: {className: 'charlie'}}}, 'tango')),
    u('element', {tagName: 'div', properties: {className: 'charlie'}}, []),
    'should transform unknown nodes with `data.hProperties` only to a `element` node'
  )

  t.end()
})
