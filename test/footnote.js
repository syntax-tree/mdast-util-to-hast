/**
 * @typedef {import('hast').ElementContent} ElementContent
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {toHtml} from 'hast-util-to-html'
import {gfm} from 'micromark-extension-gfm'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmFromMarkdown} from 'mdast-util-gfm'
import {toHast} from '../index.js'

test('footnote', async function (t) {
  await t.test('should render `footnote`s (#1)', async function () {
    const tree = toHast({
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
      // @ts-expect-error: to do: remove when `to-html` is released.
      toHtml(tree),
      `<p><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<blockquote>
<p>delta</p>
</blockquote>
<a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a>
</li>
</ol>
</section>`
    )
  })

  await t.test('should render footnotes in tables', async function () {
    const tree = toHast(
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
      // @ts-expect-error: to do: remove when `to-html` is released.
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
<p>a <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a></p>
</li>
<li id="user-content-fn-2">
<p>b <a href="#user-content-fnref-2" data-footnote-backref="" aria-label="Back to reference 2" class="data-footnote-backref">↩</a></p>
</li>
</ol>
</section>`
    )
  })

  await t.test('should render footnotes in table cells', async function () {
    const tree = toHast(
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
      // @ts-expect-error: to do: remove when `to-html` is released.
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
<p>a <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a></p>
</li>
<li id="user-content-fn-2">
<p>b <a href="#user-content-fnref-2" data-footnote-backref="" aria-label="Back to reference 2" class="data-footnote-backref">↩</a></p>
</li>
</ol>
</section>`
    )
  })

  await t.test(
    'should render reused and resursive footnotes',
    async function () {
      const tree = toHast(
        fromMarkdown('Call[^1][^1]\n\n[^1]: Recursion[^1][^1]', {
          extensions: [gfm()],
          mdastExtensions: [gfmFromMarkdown()]
        })
      )
      assert(tree, 'expected node')
      assert.equal(
        // @ts-expect-error: to do: remove when `to-html` is released.
        toHtml(tree),
        `<p>Call<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup><sup><a href="#user-content-fn-1" id="user-content-fnref-1-2" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>Recursion<sup><a href="#user-content-fn-1" id="user-content-fnref-1-3" data-footnote-ref aria-describedby="footnote-label">1</a></sup><sup><a href="#user-content-fn-1" id="user-content-fnref-1-4" data-footnote-ref aria-describedby="footnote-label">1</a></sup> <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a> <a href="#user-content-fnref-1-2" data-footnote-backref="" aria-label="Back to reference 1-2" class="data-footnote-backref">↩<sup>2</sup></a> <a href="#user-content-fnref-1-3" data-footnote-backref="" aria-label="Back to reference 1-3" class="data-footnote-backref">↩<sup>3</sup></a> <a href="#user-content-fnref-1-4" data-footnote-backref="" aria-label="Back to reference 1-4" class="data-footnote-backref">↩<sup>4</sup></a></p>
</li>
</ol>
</section>`
      )
    }
  )

  await t.test(
    'should support `footnoteLabel`, `footnoteBackLabel`',
    async function () {
      const tree = toHast(
        fromMarkdown('[^1]\n[^1]: a', {
          extensions: [gfm()],
          mdastExtensions: [gfmFromMarkdown()]
        }),
        {footnoteLabel: 'Voetnoten', footnoteBackLabel: 'Terug naar de inhoud'}
      )
      assert(tree, 'expected node')
      assert.equal(
        // @ts-expect-error: to do: remove when `to-html` is released.
        toHtml(tree),
        `<p><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Voetnoten</h2>
<ol>
<li id="user-content-fn-1">
<p>a <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Terug naar de inhoud" class="data-footnote-backref">↩</a></p>
</li>
</ol>
</section>`
      )
    }
  )

  await t.test(
    'should support `footnoteBackLabel` as a function',
    async function () {
      assert.equal(
        toHtml(
          // @ts-expect-error: to do: remove when `to-html` is released.
          toHast(
            fromMarkdown('[^1]\n[^1]: a', {
              extensions: [gfm()],
              mdastExtensions: [gfmFromMarkdown()]
            }),
            {
              footnoteBackLabel(referenceIndex, rereferenceIndex) {
                return (
                  'Terug naar referentie ' +
                  (referenceIndex + 1) +
                  (rereferenceIndex > 1 ? '-' + rereferenceIndex : '')
                )
              }
            }
          )
        ),
        `<p><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>a <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Terug naar referentie 1" class="data-footnote-backref">↩</a></p>
</li>
</ol>
</section>`
      )
    }
  )

  await t.test(
    'should support `footnoteBackContent` as `string`',
    async function () {
      assert.equal(
        toHtml(
          // @ts-expect-error: to do: remove when `to-html` is released.
          toHast(
            fromMarkdown('[^1]\n[^1]: a', {
              extensions: [gfm()],
              mdastExtensions: [gfmFromMarkdown()]
            }),
            {footnoteBackContent: '⬆️'}
          )
        ),
        `<p><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>a <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">⬆️</a></p>
</li>
</ol>
</section>`
      )
    }
  )

  await t.test(
    'should support `footnoteBackContent` as a function`',
    async function () {
      assert.equal(
        toHtml(
          // @ts-expect-error: to do: remove when `to-html` is released.
          toHast(
            fromMarkdown('[^1]\n[^1]: a', {
              extensions: [gfm()],
              mdastExtensions: [gfmFromMarkdown()]
            }),
            {
              footnoteBackContent(_, rereferenceIndex) {
                /** @type {Array<ElementContent>} */
                const result = [{type: 'text', value: '⬆️'}]

                if (rereferenceIndex > 1) {
                  result.push({
                    type: 'element',
                    tagName: 'sup',
                    properties: {},
                    children: [{type: 'text', value: String(rereferenceIndex)}]
                  })
                }

                return result
              }
            }
          )
        ),
        `<p><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>a <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">⬆️</a></p>
</li>
</ol>
</section>`
      )
    }
  )

  await t.test('should support an empty `clobberPrefix`', async function () {
    const tree = toHast(
      fromMarkdown('[^1]\n[^1]: a', {
        extensions: [gfm()],
        mdastExtensions: [gfmFromMarkdown()]
      }),
      {clobberPrefix: ''}
    )
    assert(tree, 'expected node')
    assert.equal(
      // @ts-expect-error: to do: remove when `to-html` is released.
      toHtml(tree),
      `<p><sup><a href="#fn-1" id="fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="fn-1">
<p>a <a href="#fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a></p>
</li>
</ol>
</section>`
    )
  })

  await t.test('should support a `footnoteLabelTagName`', async function () {
    const tree = toHast(
      fromMarkdown('[^1]\n[^1]: a', {
        extensions: [gfm()],
        mdastExtensions: [gfmFromMarkdown()]
      }),
      {footnoteLabelTagName: 'h1'}
    )
    assert(tree, 'expected node')
    assert.equal(
      // @ts-expect-error: to do: remove when `to-html` is released.
      toHtml(tree),
      `<p><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h1 class="sr-only" id="footnote-label">Footnotes</h1>
<ol>
<li id="user-content-fn-1">
<p>a <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a></p>
</li>
</ol>
</section>`
    )
  })

  await t.test('should support a `footnoteLabelProperties`', async function () {
    const tree = toHast(
      fromMarkdown('[^1]\n[^1]: a', {
        extensions: [gfm()],
        mdastExtensions: [gfmFromMarkdown()]
      }),
      {footnoteLabelProperties: {}}
    )
    assert(tree, 'expected node')
    assert.equal(
      // @ts-expect-error: to do: remove when `to-html` is released.
      toHtml(tree),
      `<p><sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>a <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a></p>
</li>
</ol>
</section>`
    )
  })

  await t.test('should support funky footnote identifiers', async function () {
    const tree = toHast(
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
      // @ts-expect-error: to do: remove when `to-html` is released.
      toHtml(tree),
      `<p>a<sup><a href="#user-content-fn-__proto__" id="user-content-fnref-__proto__" data-footnote-ref aria-describedby="footnote-label">1</a></sup> b<sup><a href="#user-content-fn-__proto__" id="user-content-fnref-__proto__-2" data-footnote-ref aria-describedby="footnote-label">1</a></sup> c<sup><a href="#user-content-fn-constructor" id="user-content-fnref-constructor" data-footnote-ref aria-describedby="footnote-label">2</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-__proto__">
<p>d <a href="#user-content-fnref-__proto__" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a> <a href="#user-content-fnref-__proto__-2" data-footnote-backref="" aria-label="Back to reference 1-2" class="data-footnote-backref">↩<sup>2</sup></a></p>
</li>
<li id="user-content-fn-constructor">
<p>e <a href="#user-content-fnref-constructor" data-footnote-backref="" aria-label="Back to reference 2" class="data-footnote-backref">↩</a></p>
</li>
</ol>
</section>`
    )
  })
})
