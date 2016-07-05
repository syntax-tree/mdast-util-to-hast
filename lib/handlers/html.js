/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:html
 * @fileoverview Handle `html`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = html;

/* Dependencies. */
var u = require('unist-builder');

/**
 * Return either a `raw` node, in dangerous mode, or
 * nothing.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node|null} - Nothing.
 */
function html(h, node) {
  return h.dangerous ? h.augment(node, u('raw', node.value)) : null;
}
