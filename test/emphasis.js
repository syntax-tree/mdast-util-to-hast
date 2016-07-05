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
test('Emphasis', function (t) {
  t.deepEqual(
    to(u('emphasis', [u('text', 'delta')])),
    u('element', {tagName: 'em', properties: {}}, [u('text', 'delta')]),
    'should transform `emphasis` to `em`'
  );

  t.end();
});
