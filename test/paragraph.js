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
test('Paragraph', function (t) {
  t.deepEqual(
    to(u('paragraph', [u('text', 'bravo')])),
    u('element', {tagName: 'p', properties: {}}, [u('text', 'bravo')]),
    'should transform `paragraph` to a `p` element'
  );

  t.end();
});
