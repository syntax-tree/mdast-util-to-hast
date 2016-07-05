/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:list
 * @fileoverview Handle `list`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = list;

/* Dependencies. */
var wrap = require('../wrap');
var all = require('../all');

/**
 * Transform a list.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function list(h, node) {
  var props = {};
  var name = node.ordered ? 'ol' : 'ul';

  if (typeof node.start === 'number' && node.start !== 1) {
    props.start = node.start;
  }

  return h(node, name, props, wrap(all(h, node), true));
}
