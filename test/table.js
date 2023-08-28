import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {toHast} from 'mdast-util-to-hast'

test('table', async function (t) {
  await t.test('should transform `table`', async function () {
    assert.deepEqual(
      toHast(
        {
          type: 'table',
          align: ['left', 'right'],
          children: [
            {
              type: 'tableRow',
              children: [
                {type: 'tableCell', children: [{type: 'text', value: 'alpha'}]},
                {
                  type: 'tableCell',
                  children: [
                    {type: 'html', value: '<code>'},
                    {type: 'text', value: 'bravo'},
                    {type: 'html', value: '</code>'}
                  ]
                }
              ]
            },
            {
              type: 'tableRow',
              children: [
                {
                  type: 'tableCell',
                  children: [{type: 'text', value: 'charlie'}],
                  data: {
                    hProperties: {
                      className: ['foo', 'bar']
                    }
                  }
                }
              ]
            }
          ]
        },
        {allowDangerousHtml: true}
      ),
      h('table', [
        '\n',
        h('thead', [
          '\n',
          h('tr', [
            '\n',
            h('th', {align: 'left'}, 'alpha'),
            '\n',
            h('th', {align: 'right'}, [
              {type: 'raw', value: '<code>'},
              'bravo',
              {type: 'raw', value: '</code>'}
            ]),
            '\n'
          ]),
          '\n'
        ]),
        '\n',
        h('tbody', [
          '\n',
          h('tr', [
            '\n',
            h('td', {align: 'left', className: ['foo', ''bar']}, 'charlie'),
            '\n',
            h('td', {align: 'right'}),
            '\n'
          ]),
          '\n'
        ]),
        '\n'
      ])
    )
  })

  await t.test('should not add a `tbody` if w/o second row', async function () {
    assert.deepEqual(
      toHast({
        type: 'table',
        children: [
          {
            type: 'tableRow',
            children: [
              {type: 'tableCell', children: [{type: 'text', value: 'delta'}]}
            ]
          }
        ]
      }),
      h('table', [
        '\n',
        h('thead', ['\n', h('tr', ['\n', h('th', 'delta'), '\n']), '\n']),
        '\n'
      ])
    )
  })

  await t.test('should handle a table node w/o rows', async function () {
    assert.deepEqual(toHast({type: 'table', children: []}), h('table', ['\n']))
  })

  await t.test('should handle a table row node w/ cells', async function () {
    assert.deepEqual(
      toHast({
        type: 'tableRow',
        children: [
          {type: 'tableCell', children: [{type: 'text', value: 'a'}]},
          {type: 'tableCell', children: [{type: 'text', value: 'b'}]}
        ]
      }),
      h('tr', ['\n', h('td', 'a'), '\n', h('td', 'b'), '\n'])
    )
  })

  await t.test('should handle a table row node w/o cells', async function () {
    assert.deepEqual(toHast({type: 'tableRow', children: []}), h('tr', '\n'))
  })

  await t.test(
    'should handle a table cell node w/ children',
    async function () {
      assert.deepEqual(
        toHast({type: 'tableCell', children: [{type: 'text', value: 'a'}]}),
        h('td', 'a')
      )
    }
  )

  await t.test(
    'should handle a table cell node w/o children',
    async function () {
      assert.deepEqual(toHast({type: 'tableCell', children: []}), h('td'))
    }
  )
})
