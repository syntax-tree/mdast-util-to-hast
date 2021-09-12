import test from 'tape'
import {u} from 'unist-builder'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfm} from 'micromark-extension-gfm'
import {gfmFromMarkdown} from 'mdast-util-gfm'
import {footnote} from 'micromark-extension-footnote'
import {footnoteFromMarkdown} from 'mdast-util-footnote'
import {toHtml} from 'hast-util-to-html'
import {toHast} from '../index.js'

test('Footnote', (t) => {
  t.deepEqual(
    toHast(u('root', [u('footnote', [u('text', 'bravo')])])),
    u('root', [
      u(
        'element',
        {
          tagName: 'a',
          properties: {
            href: '#fn1',
            className: ['footnote-ref'],
            id: 'fnref1',
            role: 'doc-noteref'
          }
        },
        [u('element', {tagName: 'sup', properties: {}}, [u('text', '1')])]
      ),
      u('text', '\n'),
      u(
        'element',
        {
          tagName: 'section',
          properties: {className: ['footnotes'], role: 'doc-endnotes'}
        },
        [
          u('text', '\n'),
          u('element', {tagName: 'hr', properties: {}}, []),
          u('text', '\n'),
          u('element', {tagName: 'ol', properties: {}}, [
            u('text', '\n'),
            u(
              'element',
              {tagName: 'li', properties: {id: 'fn1', role: 'doc-endnote'}},
              [
                u('text', 'bravo'),
                u(
                  'element',
                  {
                    tagName: 'a',
                    properties: {
                      href: '#fnref1',
                      className: ['footnote-back'],
                      role: 'doc-backlink'
                    }
                  },
                  [u('text', '↩')]
                )
              ]
            ),
            u('text', '\n')
          ]),
          u('text', '\n')
        ]
      )
    ]),
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
    u('root', [
      u(
        'element',
        {
          tagName: 'a',
          properties: {
            href: '#fn1',
            className: ['footnote-ref'],
            id: 'fnref1',
            role: 'doc-noteref'
          }
        },
        [u('element', {tagName: 'sup', properties: {}}, [u('text', '1')])]
      ),
      u('text', '\n'),
      u(
        'element',
        {
          tagName: 'a',
          properties: {
            href: '#fn2',
            className: ['footnote-ref'],
            id: 'fnref2',
            role: 'doc-noteref'
          }
        },
        [u('element', {tagName: 'sup', properties: {}}, [u('text', '2')])]
      ),
      u('text', '\n'),
      u(
        'element',
        {
          tagName: 'section',
          properties: {className: ['footnotes'], role: 'doc-endnotes'}
        },
        [
          u('text', '\n'),
          u('element', {tagName: 'hr', properties: {}}, []),
          u('text', '\n'),
          u('element', {tagName: 'ol', properties: {}}, [
            u('text', '\n'),
            u(
              'element',
              {tagName: 'li', properties: {id: 'fn1', role: 'doc-endnote'}},
              [
                u('text', 'bravo'),
                u(
                  'element',
                  {
                    tagName: 'a',
                    properties: {
                      href: '#fnref1',
                      className: ['footnote-back'],
                      role: 'doc-backlink'
                    }
                  },
                  [u('text', '↩')]
                )
              ]
            ),
            u('text', '\n'),
            u(
              'element',
              {tagName: 'li', properties: {id: 'fn2', role: 'doc-endnote'}},
              [
                u('text', 'charlie'),
                u(
                  'element',
                  {
                    tagName: 'a',
                    properties: {
                      href: '#fnref2',
                      className: ['footnote-back'],
                      role: 'doc-backlink'
                    }
                  },
                  [u('text', '↩')]
                )
              ]
            ),
            u('text', '\n')
          ]),
          u('text', '\n')
        ]
      )
    ]),
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
    u('root', [
      u('element', {tagName: 'p', properties: {}}, [
        u(
          'element',
          {
            tagName: 'a',
            properties: {
              href: '#fn1',
              className: ['footnote-ref'],
              id: 'fnref1',
              role: 'doc-noteref'
            }
          },
          [u('element', {tagName: 'sup', properties: {}}, [u('text', '1')])]
        )
      ]),
      u('text', '\n'),
      u(
        'element',
        {
          tagName: 'section',
          properties: {className: ['footnotes'], role: 'doc-endnotes'}
        },
        [
          u('text', '\n'),
          u('element', {tagName: 'hr', properties: {}}, []),
          u('text', '\n'),
          u('element', {tagName: 'ol', properties: {}}, [
            u('text', '\n'),
            u(
              'element',
              {tagName: 'li', properties: {id: 'fn1', role: 'doc-endnote'}},
              [
                u('text', '\n'),
                u('element', {tagName: 'blockquote', properties: {}}, [
                  u('text', '\n'),
                  u('element', {tagName: 'p', properties: {}}, [
                    u('text', 'alpha')
                  ]),
                  u('text', '\n')
                ]),
                u('text', '\n'),
                u(
                  'element',
                  {
                    tagName: 'a',
                    properties: {
                      href: '#fnref1',
                      className: ['footnote-back'],
                      role: 'doc-backlink'
                    }
                  },
                  [u('text', '↩')]
                ),
                u('text', '\n')
              ]
            ),
            u('text', '\n')
          ]),
          u('text', '\n')
        ]
      )
    ]),
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
            extensions: [gfm(), footnote()],
            mdastExtensions: [gfmFromMarkdown, footnoteFromMarkdown]
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
<td><a href="#fn1" class="footnote-ref" id="fnref1" role="doc-noteref"><sup>1</sup></a></td>
</tr>
<tr>
<td><a href="#fn2" class="footnote-ref" id="fnref2" role="doc-noteref"><sup>2</sup></a></td>
</tr>
</tbody>
</table>
<section class="footnotes" role="doc-endnotes">
<hr>
<ol>
<li id="fn1" role="doc-endnote">a<a href="#fnref1" class="footnote-back" role="doc-backlink">↩</a></li>
<li id="fn2" role="doc-endnote">b<a href="#fnref2" class="footnote-back" role="doc-backlink">↩</a></li>
</ol>
</section>`,
    'should render footnotes in tables'
  )

  t.end()
})
