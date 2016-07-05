/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:inline-code
 * @fileoverview Handle `inlineCode`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = inlineCode;

/* Dependencies. */
var collapse = require('collapse-white-space');
var u = require('unist-builder');

/**
 * Transform inline code.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function inlineCode(h, node) {
  return h(node, 'code', [u('text', collapse(node.value))]);
}
