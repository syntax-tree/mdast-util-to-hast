import assert from 'node:assert/strict'
import test from 'node:test'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfm} from 'micromark-extension-gfm'
import {gfmFromMarkdown} from 'mdast-util-gfm'
import {toHtml} from 'hast-util-to-html'
import {toHast} from '../index.js'

test('footnote', () => {
  let tree = toHast({
    type: 'root',
    children: [{type: 'footnote', children: [{type: 'text', value: 'alpha'}]}]
  })
  assert(tree, 'expected node')
  assert.equal(
    toHtml(tree),
    `<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>alpha <a href="#user-content-fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>`,
    'should render `footnote`s (#1)'
  )

  tree = toHast({
    type: 'root',
    children: [
      {
        type: 'footnoteDefinition',
        identifier: '1',
        children: [
          {type: 'paragraph', children: [{type: 'text', value: 'bravo'}]}
        ]
      },
      {
        type: 'paragraph',
        children: [{type: 'footnoteReference', identifier: '1'}]
      },
      {type: 'footnote', children: [{type: 'text', value: 'charlie'}]}
    ]
  })
  assert(tree, 'expected node')
  assert.equal(
    toHtml(tree),
    `<p><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<sup><a href="#user-content-fn-2" id="user-content-fnref-2" data-footnote-ref aria-describedby="footnote-label">2</a></sup>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>bravo <a href="#user-content-fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
<li id="user-content-fn-2">
<p>charlie <a href="#user-content-fnref-2" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>`,
    'should render `footnote`s (#2)'
  )

  tree = toHast({
    type: 'root',
    children: [
      {
        type: 'footnoteDefinition',
        identifier: '1',
        children: [
          {
            type: 'blockquote',
            children: [
              {type: 'paragraph', children: [{type: 'text', value: 'delta'}]}
            ]
          }
        ]
      },
      {
        type: 'paragraph',
        children: [{type: 'footnoteReference', identifier: '1'}]
      }
    ]
  })
  assert(tree, 'expected node')
  assert.equal(
    toHtml(tree),
    `<p><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<blockquote>
<p>delta</p>
</blockquote>
<a href="#user-content-fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a>
</li>
</ol>
</section>`,
    'should render `footnote`s (#3)'
  )

  tree = toHast(
    fromMarkdown(
      `| Footnotes |
| ---- |
| [^1] |
| [^2] |

[^1]: a
[^2]: b`,
      {extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()]}
    )
  )
  assert(tree, 'expected node')
  assert.equal(
    toHtml(tree),
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
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
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

  tree = toHast(
    fromMarkdown(
      `| [^1] | [^2] |
| ---- | ---- |

[^1]: a
[^2]: b`,
      {extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()]}
    )
  )
  assert(tree, 'expected node')
  assert.equal(
    toHtml(tree),
    `<table>
<thead>
<tr>
<th><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></th>
<th><sup><a href="#user-content-fn-2" id="user-content-fnref-2" data-footnote-ref aria-describedby="footnote-label">2</a></sup></th>
</tr>
</thead>
</table>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
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

  tree = toHast(
    fromMarkdown('Call[^1][^1]\n\n[^1]: Recursion[^1][^1]', {
      extensions: [gfm()],
      mdastExtensions: [gfmFromMarkdown()]
    })
  )
  assert(tree, 'expected node')
  assert.equal(
    toHtml(tree),
    `<p>Call<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup><sup><a href="#user-content-fn-1" id="user-content-fnref-1-2" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>Recursion<sup><a href="#user-content-fn-1" id="user-content-fnref-1-3" data-footnote-ref aria-describedby="footnote-label">1</a></sup><sup><a href="#user-content-fn-1" id="user-content-fnref-1-4" data-footnote-ref aria-describedby="footnote-label">1</a></sup> <a href="#user-content-fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a> <a href="#user-content-fnref-1-2" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩<sup>2</sup></a> <a href="#user-content-fnref-1-3" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩<sup>3</sup></a> <a href="#user-content-fnref-1-4" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩<sup>4</sup></a></p>
</li>
</ol>
</section>`,
    'should render reused and resursive footnotes'
  )

  tree = toHast(
    fromMarkdown('[^1]\n[^1]: a', {
      extensions: [gfm()],
      mdastExtensions: [gfmFromMarkdown()]
    }),
    {footnoteLabel: 'Voetnoten', footnoteBackLabel: 'Terug naar de inhoud'}
  )
  assert(tree, 'expected node')
  assert.equal(
    toHtml(tree),
    `<p><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Voetnoten</h2>
<ol>
<li id="user-content-fn-1">
<p>a <a href="#user-content-fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Terug naar de inhoud">↩</a></p>
</li>
</ol>
</section>`,
    'should support `footnoteLabel`, `footnoteBackLabel`'
  )

  tree = toHast(
    fromMarkdown('[^1]\n[^1]: a', {
      extensions: [gfm()],
      mdastExtensions: [gfmFromMarkdown()]
    }),
    {clobberPrefix: ''}
  )
  assert(tree, 'expected node')
  assert.equal(
    toHtml(tree),
    `<p><sup><a href="#fn-1" id="fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="fn-1">
<p>a <a href="#fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>`,
    'should support an empty `clobberPrefix`'
  )

  tree = toHast(
    fromMarkdown('[^1]\n[^1]: a', {
      extensions: [gfm()],
      mdastExtensions: [gfmFromMarkdown()]
    }),
    {footnoteLabelTagName: 'h1'}
  )
  assert(tree, 'expected node')
  assert.equal(
    toHtml(tree),
    `<p><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h1 class="sr-only" id="footnote-label">Footnotes</h1>
<ol>
<li id="user-content-fn-1">
<p>a <a href="#user-content-fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>`,
    'should support a `footnoteLabelTagName`'
  )

  tree = toHast(
    fromMarkdown('[^1]\n[^1]: a', {
      extensions: [gfm()],
      mdastExtensions: [gfmFromMarkdown()]
    }),
    {footnoteLabelProperties: {}}
  )
  assert(tree, 'expected node')
  assert.equal(
    toHtml(tree),
    `<p><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>a <a href="#user-content-fnref-1" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>`,
    'should support a `footnoteLabelProperties`'
  )

  tree = toHast(
    fromMarkdown(
      'a[^__proto__] b[^__proto__] c[^constructor]\n\n[^__proto__]: d\n[^constructor]: e',
      {
        extensions: [gfm()],
        mdastExtensions: [gfmFromMarkdown()]
      }
    )
  )
  assert(tree, 'expected node')
  assert.equal(
    toHtml(tree),
    `<p>a<sup><a href="#user-content-fn-__proto__" id="user-content-fnref-__proto__" data-footnote-ref aria-describedby="footnote-label">1</a></sup> b<sup><a href="#user-content-fn-__proto__" id="user-content-fnref-__proto__-2" data-footnote-ref aria-describedby="footnote-label">1</a></sup> c<sup><a href="#user-content-fn-constructor" id="user-content-fnref-constructor" data-footnote-ref aria-describedby="footnote-label">2</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-__proto__">
<p>d <a href="#user-content-fnref-__proto__" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a> <a href="#user-content-fnref-__proto__-2" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩<sup>2</sup></a></p>
</li>
<li id="user-content-fn-constructor">
<p>e <a href="#user-content-fnref-constructor" data-footnote-backref class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>`,
    'should support funky footnote identifiers'
  )
})
