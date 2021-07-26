import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('Image', (t) => {
  t.deepEqual(
    toHast(
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
    toHast(
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
