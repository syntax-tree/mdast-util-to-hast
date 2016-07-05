/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:emphasis
 * @fileoverview Handle `emphasis`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = emphasis;

/* Dependencies. */
var all = require('../all');

/**
 * Transform emphasis
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function emphasis(h, node) {
  return h(node, 'em', all(h, node));
}
