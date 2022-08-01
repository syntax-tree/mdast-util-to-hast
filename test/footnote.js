import test from 'tape'
import {u} from 'unist-builder'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfm} from 'micromark-extension-gfm'
import {gfmFromMarkdown} from 'mdast-util-gfm'
import {toHtml} from 'hast-util-to-html'
import {toHast} from '../index.js'

test('Footnote', (t) => {
  t.deepEqual(
    toHast(u('root', [u('footnote', [u('text', 'bravo')])])),
    {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'sup',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'a',
              properties: {
                href: '#user-content-fn-1',
                id: 'user-content-fnref-1',
                dataFootnoteRef: true,
                ariaDescribedBy: 'footnote-label'
              },
              children: [{type: 'text', value: '1'}]
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'element',
          tagName: 'section',
          properties: {dataFootnotes: true, className: ['footnotes']},
          children: [
            {
              type: 'element',
              tagName: 'h2',
              properties: {id: 'footnote-label', className: ['sr-only']},
              children: [{type: 'text', value: 'Footnotes'}]
            },
            {type: 'text', value: '\n'},
            {
              type: 'element',
              tagName: 'ol',
              properties: {},
              children: [
                {type: 'text', value: '\n'},
                {
                  type: 'element',
                  tagName: 'li',
                  properties: {id: 'user-content-fn-1'},
                  children: [
                    {type: 'text', value: '\n'},
                    {
                      type: 'element',
                      tagName: 'p',
                      properties: {},
                      children: [
                        {type: 'text', value: 'bravo '},
                        {
                          type: 'element',
                          tagName: 'a',
                          properties: {
                            href: '#user-content-fnref-1',
                            dataFootnoteBackref: true,
                            className: ['data-footnote-backref'],
                            ariaLabel: 'Back to content'
                          },
                          children: [{type: 'text', value: '↩'}]
                        }
                      ]
                    },
                    {type: 'text', value: '\n'}
                  ]
                },
                {type: 'text', value: '\n'}
              ]
            },
            {type: 'text', value: '\n'}
          ]
        }
      ]
    },
    'should render `footnote`s (#1)'
  )

  t.deepEqual(
    toHast(
      u('root', [
        u('footnoteDefinition', {identifier: '1'}, [
          u('paragraph', [u('text', 'bravo')])
        ]),
        u('footnoteReference', {identifier: '1'}),
        u('footnote', [u('text', 'charlie')])
      ])
    ),
    {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'sup',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'a',
              properties: {
                href: '#user-content-fn-1',
                id: 'user-content-fnref-1',
                dataFootnoteRef: true,
                ariaDescribedBy: 'footnote-label'
              },
              children: [{type: 'text', value: '1'}]
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'element',
          tagName: 'sup',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'a',
              properties: {
                href: '#user-content-fn-2',
                id: 'user-content-fnref-2',
                dataFootnoteRef: true,
                ariaDescribedBy: 'footnote-label'
              },
              children: [{type: 'text', value: '2'}]
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'element',
          tagName: 'section',
          properties: {dataFootnotes: true, className: ['footnotes']},
          children: [
            {
              type: 'element',
              tagName: 'h2',
              properties: {id: 'footnote-label', className: ['sr-only']},
              children: [{type: 'text', value: 'Footnotes'}]
            },
            {type: 'text', value: '\n'},
            {
              type: 'element',
              tagName: 'ol',
              properties: {},
              children: [
                {type: 'text', value: '\n'},
                {
                  type: 'element',
                  tagName: 'li',
                  properties: {id: 'user-content-fn-1'},
                  children: [
                    {type: 'text', value: '\n'},
                    {
                      type: 'element',
                      tagName: 'p',
                      properties: {},
                      children: [
                        {type: 'text', value: 'bravo '},
                        {
                          type: 'element',
                          tagName: 'a',
                          properties: {
                            href: '#user-content-fnref-1',
                            dataFootnoteBackref: true,
                            className: ['data-footnote-backref'],
                            ariaLabel: 'Back to content'
                          },
                          children: [{type: 'text', value: '↩'}]
                        }
                      ]
                    },
                    {type: 'text', value: '\n'}
                  ]
                },
                {type: 'text', value: '\n'},
                {
                  type: 'element',
                  tagName: 'li',
                  properties: {id: 'user-content-fn-2'},
                  children: [
                    {type: 'text', value: '\n'},
                    {
                      type: 'element',
                      tagName: 'p',
                      properties: {},
                      children: [
                        {type: 'text', value: 'charlie '},
                        {
                          type: 'element',
                          tagName: 'a',
                          properties: {
                            href: '#user-content-fnref-2',
                            dataFootnoteBackref: true,
                            className: ['data-footnote-backref'],
                            ariaLabel: 'Back to content'
                          },
                          children: [{type: 'text', value: '↩'}]
                        }
                      ]
                    },
                    {type: 'text', value: '\n'}
                  ]
                },
                {type: 'text', value: '\n'}
              ]
            },
            {type: 'text', value: '\n'}
          ]
        }
      ]
    },
    'should render `footnote`s (#2)'
  )

  t.deepEqual(
    toHast(
      u('root', [
        u('footnoteDefinition', {identifier: '1'}, [
          u('blockquote', [u('paragraph', [u('text', 'alpha')])])
        ]),
        u('paragraph', [u('footnoteReference', {identifier: '1'})])
      ])
    ),
    {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'sup',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'a',
                  properties: {
                    href: '#user-content-fn-1',
                    id: 'user-content-fnref-1',
                    dataFootnoteRef: true,
                    ariaDescribedBy: 'footnote-label'
                  },
                  children: [{type: 'text', value: '1'}]
                }
              ]
            }
          ]
        },
        {type: 'text', value: '\n'},
        {
          type: 'element',
          tagName: 'section',
          properties: {dataFootnotes: true, className: ['footnotes']},
          children: [
            {
              type: 'element',
              tagName: 'h2',
              properties: {id: 'footnote-label', className: ['sr-only']},
              children: [{type: 'text', value: 'Footnotes'}]
            },
            {type: 'text', value: '\n'},
            {
              type: 'element',
              tagName: 'ol',
              properties: {},
              children: [
                {type: 'text', value: '\n'},
                {
                  type: 'element',
                  tagName: 'li',
                  properties: {id: 'user-content-fn-1'},
                  children: [
                    {type: 'text', value: '\n'},
                    {
                      type: 'element',
                      tagName: 'blockquote',
                      properties: {},
                      children: [
                        {type: 'text', value: '\n'},
                        {
                          type: 'element',
                          tagName: 'p',
                          properties: {},
                          children: [{type: 'text', value: 'alpha'}]
                        },
                        {type: 'text', value: '\n'}
                      ]
                    },
                    {type: 'text', value: '\n'},
                    {
                      type: 'element',
                      tagName: 'a',
                      properties: {
                        href: '#user-content-fnref-1',
                        dataFootnoteBackref: true,
                        className: ['data-footnote-backref'],
                        ariaLabel: 'Back to content'
                      },
                      children: [{type: 'text', value: '↩'}]
                    },
                    {type: 'text', value: '\n'}
                  ]
                },
                {type: 'text', value: '\n'}
              ]
            },
            {type: 'text', value: '\n'}
          ]
        }
      ]
    },
    'should render `footnote`s (#3)'
  )

  t.equal(
    toHtml(
      // @ts-expect-error: fine.
      toHast(
        fromMarkdown(
          `| Footnotes |
| ---- |
| [^1] |
| [^2] |

[^1]: a
[^2]: b`,
          {
            extensions: [gfm()],
            mdastExtensions: [gfmFromMarkdown()]
          }
        )
      )
    ),
    `<table>
<thead>
<tr>
<th>Footnotes</th>
</tr>
</thead>
<tbody>
<tr>
<td><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></td>
</tr>
<tr>
<td><sup><a href="#user-content-fn-2" id="user-content-fnref-2" data-footnote-ref aria-describedby="footnote-label">2</a></sup></td>
</tr>
</tbody>
</table>
<section data-footnotes class="footnotes"><h2 id="footnote-label" class="sr-only">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>a <a href="#user-content-fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
<li id="user-content-fn-2">
<p>b <a href="#user-content-fnref-2" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>`,
    'should render footnotes in tables'
  )

  t.equal(
    toHtml(
      // @ts-expect-error: fine.
      toHast(
        fromMarkdown(
          `| [^1] | [^2] |
| ---- | ---- |

[^1]: a
[^2]: b`,
          {
            extensions: [gfm()],
            mdastExtensions: [gfmFromMarkdown()]
          }
        )
      )
    ),
    `<table>
<thead>
<tr>
<th><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></th>
<th><sup><a href="#user-content-fn-2" id="user-content-fnref-2" data-footnote-ref aria-describedby="footnote-label">2</a></sup></th>
</tr>
</thead>
</table>
<section data-footnotes class="footnotes"><h2 id="footnote-label" class="sr-only">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>a <a href="#user-content-fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
<li id="user-content-fn-2">
<p>b <a href="#user-content-fnref-2" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>`,
    'should render footnotes in table cells'
  )

  t.equal(
    toHtml(
      // @ts-expect-error: fine.
      toHast(
        fromMarkdown('Call[^1][^1]\n\n[^1]: Recursion[^1][^1]', {
          extensions: [gfm()],
          mdastExtensions: [gfmFromMarkdown()]
        })
      )
    ),
    `<p>Call<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup><sup><a href="#user-content-fn-1" id="user-content-fnref-1-2" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 id="footnote-label" class="sr-only">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>Recursion<sup><a href="#user-content-fn-1" id="user-content-fnref-1-3" data-footnote-ref aria-describedby="footnote-label">1</a></sup><sup><a href="#user-content-fn-1" id="user-content-fnref-1-4" data-footnote-ref aria-describedby="footnote-label">1</a></sup> <a href="#user-content-fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a> <a href="#user-content-fnref-1-2" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩<sup>2</sup></a> <a href="#user-content-fnref-1-3" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩<sup>3</sup></a> <a href="#user-content-fnref-1-4" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩<sup>4</sup></a></p>
</li>
</ol>
</section>`,
    'should render reused and resursive footnotes'
  )

  t.equal(
    toHtml(
      // @ts-expect-error: fine.
      toHast(
        fromMarkdown('[^1]\n[^1]: a', {
          extensions: [gfm()],
          mdastExtensions: [gfmFromMarkdown()]
        }),
        {footnoteLabel: 'Voetnoten', footnoteBackLabel: 'Terug naar de inhoud'}
      )
    ),
    '<p><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>\n<section data-footnotes class="footnotes"><h2 id="footnote-label" class="sr-only">Voetnoten</h2>\n<ol>\n<li id="user-content-fn-1">\n<p>a <a href="#user-content-fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Terug naar de inhoud">↩</a></p>\n</li>\n</ol>\n</section>',
    'should support `footnoteLabel`, `footnoteBackLabel`'
  )

  t.equal(
    toHtml(
      // @ts-expect-error: fine.
      toHast(
        fromMarkdown('[^1]\n[^1]: a', {
          extensions: [gfm()],
          mdastExtensions: [gfmFromMarkdown()]
        }),
        {clobberPrefix: ''}
      )
    ),
    '<p><sup><a href="#fn-1" id="fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>\n<section data-footnotes class="footnotes"><h2 id="footnote-label" class="sr-only">Footnotes</h2>\n<ol>\n<li id="fn-1">\n<p>a <a href="#fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>\n</li>\n</ol>\n</section>',
    'should support an empty `clobberPrefix`'
  )

  t.match(
    toHtml(
      // @ts-expect-error: fine.
      toHast(
        fromMarkdown('[^1]\n[^1]: a', {
          extensions: [gfm()],
          mdastExtensions: [gfmFromMarkdown()]
        }),
        {footnoteLabelTagName: 'h1'}
      )
    ),
    /<h1 id="footnote-label" class="sr-only">Footnotes<\/h1>/,
    'should support a `footnoteLabelTagName`'
  )

  t.match(
    toHtml(
      // @ts-expect-error: fine.
      toHast(
        fromMarkdown('[^1]\n[^1]: a', {
          extensions: [gfm()],
          mdastExtensions: [gfmFromMarkdown()]
        }),
        {footnoteLabelProperties: {}}
      )
    ),
    /<h2>Footnotes<\/h2>/,
    'should support a `footnoteLabelProperties`'
  )

  t.end()
})
