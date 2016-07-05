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
test('Link', function (t) {
  t.deepEqual(
    to(u('link', {
      url: 'http://golf.hotel',
      title: 'India'
    }, [u('text', 'juliett')])),
    u('element', {tagName: 'a', properties: {
      href: 'http://golf.hotel',
      title: 'India'
    }}, [u('text', 'juliett')]),
    'should transform `link` to `a`'
  );

  t.deepEqual(
    to(u('link', {
      url: 'http://kilo.lima'
    }, [u('text', 'mike')])),
    u('element', {tagName: 'a', properties: {
      href: 'http://kilo.lima'
    }}, [u('text', 'mike')]),
    'should transform `link` to `a` (missing `title`)'
  );

  t.end();
});
