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
test('Strong', function (t) {
  t.deepEqual(
    to(u('strong', [u('text', 'echo')])),
    u('element', {tagName: 'strong', properties: {}}, [u('text', 'echo')]),
    'should transform `strong` to `strong`'
  );

  t.end();
});
