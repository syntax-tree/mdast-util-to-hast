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
test('Definition', function (t) {
  t.equal(
    to(u('definition', {
      url: 'http://uniform.whiskey',
      identifier: 'x-ray',
      title: 'yankee'
    })),
    null,
    'should ignore `definition`'
  );

  t.end();
});
