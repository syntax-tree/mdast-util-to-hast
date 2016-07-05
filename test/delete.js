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
test('Delete', function (t) {
  t.deepEqual(
    to(u('delete', [u('text', 'foxtrot')])),
    u('element', {tagName: 'del', properties: {}}, [u('text', 'foxtrot')]),
    'should transform `delete` to `del`'
  );

  t.end();
});
