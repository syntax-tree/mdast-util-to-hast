/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:thematic-break
 * @fileoverview Handle `thematicBreak`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = thematicBreak;

/**
 * Transform a thematic break / horizontal rule.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function thematicBreak(h, node) {
  return h(node, 'hr');
}
