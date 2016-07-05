/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module mdast-util-to-hast
 * @fileoverview Test suite for `mdast-util-to-hast`.
 */

'use strict';

/* eslint-env node */

/* Dependencies. */
var test = require('tape');
var u = require('unist-builder');
var to = require('..');

/* Tests. */
test('FootnoteReference', function (t) {
  t.deepEqual(
    to(u('footnoteReference', {
      identifier: 'alpha'
    })),
    u('element', {tagName: 'sup', properties: {
      id: 'fnref-alpha'
    }}, [
      u('element', {tagName: 'a', properties: {
        href: '#fn-alpha',
        className: ['footnote-ref']
      }}, [u('text', 'alpha')])
    ]),
    'should render `footnoteReference`s'
  );

  t.end();
});
