/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:wrap
 * @fileoverview Wrap a list of nodes in white-space.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = wrap;

/* Dependencies. */
var u = require('unist-builder');

/**
 * Wrap `nodes` with newlines between each entry.
 * Optionally adds newlines at the start and end.
 *
 * @param {Array.<Node>} nodes - Nodes to wrap.
 * @param {boolean} loose - Whether to inject newlines at
 *   the start, and end (in case nodes has entries).
 * @return {Array.<Node>} - Wrapped nodes.
 */
function wrap(nodes, loose) {
  var result = [];
  var index = -1;
  var length = nodes.length;

  if (loose) {
    result.push(u('text', '\n'));
  }

  while (++index < length) {
    if (index) {
      result.push(u('text', '\n'));
    }

    result.push(nodes[index]);
  }

  if (loose && nodes.length) {
    result.push(u('text', '\n'));
  }

  return result;
}
