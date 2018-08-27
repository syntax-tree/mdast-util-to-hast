'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('LinkReference', function(t) {
  t.deepEqual(
    to(u('linkReference', {identifier: 'bravo'}, [u('text', 'bravo')])),
    [u('text', '[bravo]')],
    'should fall back on `linkReference`s without definition'
  )

  t.deepEqual(
    to(
      u('linkReference', {identifier: 'delta', referenceType: 'full'}, [
        u('text', 'echo')
      ])
    ),
    [u('text', '[echo][delta]')],
    'should fall back on full `linkReference`s'
  )

  t.deepEqual(
    to(
      u('linkReference', {identifier: 'hotel', referenceType: 'collapsed'}, [
        u('text', 'hotel')
      ])
    ),
    [u('text', '[hotel][]')],
    'should fall back on collapsed `linkReference`s'
  )

  t.deepEqual(
    to(
      u('linkReference', {identifier: 'bravo', referenceType: 'full'}, [
        u('inlineCode', 'alpha')
      ])
    ),
    [
      u('text', '['),
      u('element', {tagName: 'code', properties: {}}, [u('text', 'alpha')]),
      u('text', '][bravo]')
    ],
    'should support link references with non-text content'
  )

  t.deepEqual(
    to(
      u('paragraph', [
        u('linkReference', {identifier: 'juliett'}, [u('text', 'kilo')]),
        u('definition', {
          identifier: 'juliett',
          url: 'https://kilo.lima/mike',
          title: 'november'
        })
      ])
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u(
        'element',
        {
          tagName: 'a',
          properties: {href: 'https://kilo.lima/mike', title: 'november'}
        },
        [u('text', 'kilo')]
      )
    ]),
    'should transform `linkReference`s to `a`s'
  )

  t.deepEqual(
    to(
      u('paragraph', [
        u('linkReference', {identifier: 'juliett'}, [u('text', 'kilo')]),
        u('definition', {identifier: 'juliett', url: ''})
      ])
    ),
    u('element', {tagName: 'p', properties: {}}, [
      u('element', {tagName: 'a', properties: {href: ''}}, [u('text', 'kilo')])
    ]),
    'should transform `linkReference`s with an empty defined url to `a`s'
  )

  t.deepEqual(
    to(
      u(
        'linkReference',
        {identifier: 'oscar', label: 'Oscar', referenceType: 'full'},
        [u('text', 'papa')]
      )
    ),
    [u('text', '[papa][Oscar]')],
    'should fall back on the label on a full `linkReference` (GH-22)'
  )

  t.end()
})
