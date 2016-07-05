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
test('Heading', function (t) {
  t.deepEqual(
    to(u('heading', {depth: 4}, [u('text', 'echo')])),
    u('element', {tagName: 'h4', properties: {}}, [u('text', 'echo')]),
    'should transform `heading` to a `h[1-6]` element'
  );

  t.end();
});
