/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:paragraph
 * @fileoverview Handle `paragraph`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = paragraph;

/* Dependencies. */
var all = require('../all');

/**
 * Transform a paragraph.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function paragraph(h, node) {
  return h(node, 'p', all(h, node));
}
