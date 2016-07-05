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
test('Image', function (t) {
  t.deepEqual(
    to(u('image', {
      url: 'http://november.oscar',
      alt: 'papa',
      title: 'québec'
    })),
    u('element', {tagName: 'img', properties: {
      src: 'http://november.oscar',
      alt: 'papa',
      title: 'québec'
    }}, []),
    'should transform `image` to `img`'
  );

  t.deepEqual(
    to(u('image', {
      url: 'http://romeo.sierra',
      alt: 'tango'
    })),
    u('element', {tagName: 'img', properties: {
      src: 'http://romeo.sierra',
      alt: 'tango'
    }}, []),
    'should transform `image` to `img` (missing `title`)'
  );

  t.end();
});
