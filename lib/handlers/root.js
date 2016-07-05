/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:root
 * @fileoverview Handle `root`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = root;

/* Dependencies. */
var u = require('unist-builder');
var wrap = require('../wrap');
var all = require('../all');

/**
 * Transform a `root`.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function root(h, node) {
  return h.augment(node, u('root', wrap(all(h, node))));
}
