/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:delete
 * @fileoverview Handle `delete`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = strikethrough;

/* Dependencies. */
var all = require('../all');

/**
 * Transform deletions.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function strikethrough(h, node) {
  return h(node, 'del', all(h, node));
}
