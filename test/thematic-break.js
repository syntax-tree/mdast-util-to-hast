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
test('ThematicBreak', function (t) {
  t.deepEqual(
    to(u('thematicBreak')),
    u('element', {tagName: 'hr', properties: {}}, []),
    'should transform `thematicBreak` to `hr`'
  );

  t.end();
});
