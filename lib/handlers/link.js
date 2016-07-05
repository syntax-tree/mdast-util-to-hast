/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:link
 * @fileoverview Handle `link`.
 */

'use strict';

/* eslint-env commonjs */

/* Dependencies. */
var normalize = require('normalize-uri');
var all = require('../all');

/* Expose. */
module.exports = link;

/**
 * Transform a link.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function link(h, node) {
  var props = {href: normalize(node.url)};

  if (node.title != null) {
    props.title = node.title;
  }

  return h(node, 'a', props, all(h, node));
}
