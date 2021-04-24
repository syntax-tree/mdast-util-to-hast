import test from 'tape'
import {u} from 'unist-builder'
import {toHast} from '../index.js'

test('HTML', function (t) {
  t.equal(toHast(u('html', '<mike></mike>')), null, 'should ignore `html`')

  t.deepEqual(
    toHast(u('html', '<mike></mike>'), {allowDangerousHtml: true}),
    u('raw', '<mike></mike>'),
    'should transform `html` to `raw` if `allowDangerousHtml` is given'
  )

  t.deepEqual(
    toHast(u('html', '<mike></mike>'), {allowDangerousHTML: true}),
    u('raw', '<mike></mike>'),
    'should still transform `html` to `raw` if deprecated `allowDangerousHTML` is given'
  )

  t.end()
})
