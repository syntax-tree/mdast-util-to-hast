import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from '../index.js'

test('footnoteReference', async function (t) {
  await t.test('should render `footnoteReference`s', async function () {
    assert.deepEqual(
      toHast({type: 'footnoteReference', identifier: 'alpha'}),
      h('sup', [
        h(
          'a',
          {
            href: '#user-content-fn-alpha',
            id: 'user-content-fnref-alpha',
            dataFootnoteRef: true,
            ariaDescribedBy: ['footnote-label']
          },
          '1'
        )
      ])
    )
  })

  await t.test('should render `footnoteReference`s (#2)', async function () {
    assert.deepEqual(
      toHast({type: 'footnoteReference', identifier: 'bravo', label: 'Bravo'}),
      h('sup', [
        h(
          'a',
          {
            href: '#user-content-fn-bravo',
            id: 'user-content-fnref-bravo',
            dataFootnoteRef: true,
            ariaDescribedBy: ['footnote-label']
          },
          '1'
        )
      ])
    )
  })

  await t.test('should not fail on non-string identifiers', async function () {
    assert.deepEqual(
      // @ts-expect-error: check how the runtime handles non-string identifiers.
      toHast({type: 'footnoteReference', identifier: 1}),
      h('sup', [
        h(
          'a',
          {
            href: '#user-content-fn-1',
            id: 'user-content-fnref-1',
            dataFootnoteRef: true,
            ariaDescribedBy: ['footnote-label']
          },
          '1'
        )
      ])
    )
  })
})
