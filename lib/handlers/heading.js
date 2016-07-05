/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:heading
 * @fileoverview Handle `heading`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = heading;

/* Dependencies. */
var all = require('../all');

/**
 * Transform a heading.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function heading(h, node) {
  return h(node, 'h' + node.depth, all(h, node));
}
