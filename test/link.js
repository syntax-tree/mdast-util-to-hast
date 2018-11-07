'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('Link', function(t) {
  t.deepEqual(
    to(
      u(
        'link',
        {
          url: 'https://golf.hotel',
          title: 'India'
        },
        [u('text', 'juliett')]
      )
    ),
    u(
      'element',
      {
        tagName: 'a',
        properties: {
          href: 'https://golf.hotel',
          title: 'India'
        }
      },
      [u('text', 'juliett')]
    ),
    'should transform `link` to `a`'
  )

  t.deepEqual(
    to(
      u(
        'link',
        {
          url: 'https://kilo.lima'
        },
        [u('text', 'mike')]
      )
    ),
    u(
      'element',
      {
        tagName: 'a',
        properties: {
          href: 'https://kilo.lima'
        }
      },
      [u('text', 'mike')]
    ),
    'should transform `link` to `a` (missing `title`)'
  )

  t.deepEqual(
    to(
      u(
        'link',
        {
          url: 'https://github.com/facebook/react/pulls?q=is%3Apr%20is%3Aclosed'
        },
        [u('text', 'Alpha')]
      )
    ),
    u(
      'element',
      {
        tagName: 'a',
        properties: {
          href:
            'https://github.com/facebook/react/pulls?q=is%3Apr%20is%3Aclosed'
        }
      },
      [u('text', 'Alpha')]
    ),
    'should correctly decode/encode urls'
  )

  t.end()
})
