/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:failsafe
 * @fileoverview Failsafe to stringify references
 *   without definitions back to markdown.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = failsafe;

/* Dependencies. */
var u = require('unist-builder');
var all = require('./all');

/**
 * Return the content of a reference without definition
 * as markdown.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @param {Node?} [definition] - Definition node.
 * @return {Array.<string>?} - Node, list of nodes, or nothing.
 */
function failsafe(h, node, definition) {
  var subtype = node.referenceType;

  if (subtype !== 'collapsed' && subtype !== 'full' && !definition) {
    if (node.type === 'imageReference') {
      return u('text', '![' + node.alt + ']');
    }

    return [u('text', '[')].concat(all(h, node), u('text', ']'));
  }
}
