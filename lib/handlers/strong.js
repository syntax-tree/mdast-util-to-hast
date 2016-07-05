/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:strong
 * @fileoverview Handle `strong`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = strong;

/* Dependencies. */
var all = require('../all');

/**
 * Transform importance.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function strong(h, node) {
  return h(node, 'strong', all(h, node));
}
