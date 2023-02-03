import assert from 'node:assert/strict'
import test from 'node:test'
import {toHtml} from 'hast-util-to-html'
import {toHast} from '../index.js'

test('footnote', () => {
  const mdast = toHast({
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'alpha'},
          {type: 'footnote', children: [{type: 'text', value: 'bravo'}]}
        ]
      },
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'charlie'},
          {type: 'footnoteReference', identifier: 'x'}
        ]
      },
      {
        type: 'footnoteDefinition',
        identifier: 'x',
        children: [
          {type: 'paragraph', children: [{type: 'text', value: 'delta'}]}
        ]
      }
    ]
  })
  assert(mdast, 'expected node')

  assert.deepEqual(
    toHtml(mdast),
    `<p>alpha<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<p>charlie<sup><a href="#user-content-fn-x" id="user-content-fnref-x" data-footnote-ref aria-describedby="footnote-label">2</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>bravo <a href="#user-content-fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
<li id="user-content-fn-x">
<p>delta <a href="#user-content-fnref-x" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>`,
    'should order the footnote section by usage'
  )
})
