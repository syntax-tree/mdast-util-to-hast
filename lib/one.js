/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:one
 * @fileoverview Transform one MDAST node.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = one;

/* Dependencies. */
var u = require('unist-builder');
var has = require('has');
var all = require('./all');
var handlers = require('./handlers');

/**
 * Transform an unknown node.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function unknown(h, node) {
  if ('value' in node) {
    return h.augment(node, u('text', node.value));
  }

  return h(node, 'div', all(h, node));
}

/**
 * Visit a node.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Object} node - Node.
 * @param {Object?} [parent] - `node`s parent.
 * @return {Node} - HAST node.
 * @throws {Error} - When `node` is not an MDAST node.
 */
function one(h, node, parent) {
  var type = node && node.type;
  var defaultFn = has(handlers, type) ? handlers[type] : null;
  var fn = has(h.customHandlers, type) ? h.customHandlers[type] : defaultFn;

  /* Fail on non-nodes. */
  if (!type) {
    throw new Error('Expected node, got `' + node + '`');
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent);
}
