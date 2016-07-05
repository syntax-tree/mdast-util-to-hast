/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:text
 * @fileoverview Handle `text`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = text;

/* Dependencies. */
var u = require('unist-builder');
var trimLines = require('trim-lines');

/**
 * Transform text.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST text node.
 */
function text(h, node) {
  return h.augment(node, u('text', trimLines(node.value)));
}
