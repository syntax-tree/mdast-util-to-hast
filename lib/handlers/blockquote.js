/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:blockquote
 * @fileoverview Handle a `blockquote`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = blockquote;

/* Dependencies. */
var wrap = require('../wrap');
var all = require('../all');

/**
 * Transform a block quote.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function blockquote(h, node) {
  return h(node, 'blockquote', wrap(all(h, node), true));
}
