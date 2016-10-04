/**
 * @author rhysd
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
var trimLines = require('trim-lines');
var to = require('..');

/* Tests. */
test('Custom handlers', function (t) {
  var handlers = {};
  handlers.text = function (h, node) {
    var value = trimLines(node.value);

    return h.augment(node, h(node, 'span', {className: 'custom-class'}, [u('text', value)]));
  };

  t.deepEqual(
    to(u('text', 'this will be decorated'), {customHandlers: handlers}),
    u('element', {tagName: 'span', properties: {className: 'custom-class'}}, [
      u('text', 'this will be decorated')
    ])
  );

  t.end();
});

