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
test('FootnoteDefinition', function (t) {
  t.equal(
    to(u('footnoteDefinition', {
      identifier: 'zulu'
    }, [u('paragraph', [u('text', 'alpha')])])),
    null,
    'should ignore `footnoteDefinition`'
  );

  t.end();
});
