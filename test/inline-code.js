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
test('InlineCode', function (t) {
  t.deepEqual(
    to(u('inlineCode', 'juliett()')),
    u('element', {tagName: 'code', properties: {}}, [
      u('text', 'juliett()')
    ]),
    'should transform `inlineCode` to a `code` element'
  );

  t.end();
});
