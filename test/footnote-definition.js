import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from 'mdast-util-to-hast'

test('footnoteDefinition', async function (t) {
  await t.test('should ignore `footnoteDefinition`', async function () {
    assert.deepEqual(
      toHast({
        type: 'footnoteDefinition',
        identifier: 'alpha',
        children: [
          {type: 'paragraph', children: [{type: 'text', value: 'bravo'}]}
        ]
      }),
      {type: 'root', children: []}
    )
  })

  await t.test('should support a `footnoteDefinition`', async function () {
    assert.deepEqual(
      toHast({
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{type: 'footnoteReference', identifier: 'charlie'}]
          },
          {
            type: 'footnoteDefinition',
            identifier: 'charlie',
            children: [
              {type: 'paragraph', children: [{type: 'text', value: 'delta'}]}
            ]
          }
        ]
      }),
      h(null, [
        h('p', [
          h('sup', [
            h(
              'a#user-content-fnref-charlie',
              {
                href: '#user-content-fn-charlie',
                dataFootnoteRef: true,
                ariaDescribedBy: ['footnote-label']
              },
              '1'
            )
          ])
        ]),
        '\n',
        h('section.footnotes', {dataFootnotes: true}, [
          h('h2#footnote-label.sr-only', 'Footnotes'),
          '\n',
          h('ol', [
            '\n',
            h('li#user-content-fn-charlie', [
              '\n',
              h('p', [
                'delta ',
                h(
                  'a',
                  {
                    href: '#user-content-fnref-charlie',
                    dataFootnoteBackref: '',
                    ariaLabel: 'Back to reference 1',
                    className: ['data-footnote-backref']
                  },
                  '↩'
                )
              ]),
              '\n'
            ]),
            '\n'
          ]),
          '\n'
        ])
      ])
    )
  })

  await t.test(
    'should use the first `footnoteDefinition` if multiple exist',
    async function () {
      assert.deepEqual(
        toHast({
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{type: 'footnoteReference', identifier: 'echo'}]
            },
            {
              type: 'footnoteDefinition',
              identifier: 'echo',
              children: [
                {
                  type: 'paragraph',
                  children: [{type: 'text', value: 'foxtrot'}]
                }
              ]
            },
            {
              type: 'footnoteDefinition',
              identifier: 'echo',
              children: [
                {type: 'paragraph', children: [{type: 'text', value: 'golf'}]}
              ]
            }
          ]
        }),
        h(null, [
          h('p', [
            h('sup', [
              h(
                'a#user-content-fnref-echo',
                {
                  href: '#user-content-fn-echo',
                  dataFootnoteRef: true,
                  ariaDescribedBy: ['footnote-label']
                },
                '1'
              )
            ])
          ]),
          '\n',
          h('section.footnotes', {dataFootnotes: true}, [
            h('h2#footnote-label.sr-only', 'Footnotes'),
            '\n',
            h('ol', [
              '\n',
              h('li#user-content-fn-echo', [
                '\n',
                h('p', [
                  'foxtrot ',
                  h(
                    'a',
                    {
                      href: '#user-content-fnref-echo',
                      dataFootnoteBackref: '',
                      ariaLabel: 'Back to reference 1',
                      className: ['data-footnote-backref']
                    },
                    '↩'
                  )
                ]),
                '\n'
              ]),
              '\n'
            ]),
            '\n'
          ])
        ])
      )
    }
  )
})
