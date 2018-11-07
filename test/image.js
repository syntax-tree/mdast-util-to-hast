'use strict'

var test = require('tape')
var u = require('unist-builder')
var to = require('..')

test('Image', function(t) {
  t.deepEqual(
    to(
      u('image', {
        url: 'https://november.oscar',
        alt: 'papa',
        title: 'québec'
      })
    ),
    u(
      'element',
      {
        tagName: 'img',
        properties: {
          src: 'https://november.oscar',
          alt: 'papa',
          title: 'québec'
        }
      },
      []
    ),
    'should transform `image` to `img`'
  )

  t.deepEqual(
    to(
      u('image', {
        url: 'https://romeo.sierra',
        alt: 'tango'
      })
    ),
    u(
      'element',
      {
        tagName: 'img',
        properties: {
          src: 'https://romeo.sierra',
          alt: 'tango'
        }
      },
      []
    ),
    'should transform `image` to `img` (missing `title`)'
  )

  t.end()
})
