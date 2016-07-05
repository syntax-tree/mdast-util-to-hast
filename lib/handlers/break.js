/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:break
 * @fileoverview Handle a `break`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = hardBreak;

/* Dependencies. */
var u = require('unist-builder');

/**
 * Transform an inline break.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Array.<Node>} - HAST nodes.
 */
function hardBreak(h, node) {
  return [h(node, 'br'), u('text', '\n')];
}
