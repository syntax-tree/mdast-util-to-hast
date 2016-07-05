/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:all
 * @fileoverview Visit all MDAST nodes.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = all;

/* Dependencies. */
var trim = require('trim');
var one = require('./one');

/**
 * Transform the children of `parent`.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} parent - Parent to visit.
 * @return {Array.<Node>} - HAST nodes.
 */
function all(h, parent) {
  var nodes = parent.children || [];
  var length = nodes.length;
  var values = [];
  var index = -1;
  var result;
  var head;

  while (++index < length) {
    result = one(h, nodes[index], parent);

    if (result) {
      if (index && nodes[index - 1].type === 'break') {
        if (result.value) {
          result.value = trim.left(result.value);
        }

        head = result.children && result.children[0];

        if (head && head.value) {
          head.value = trim.left(head.value);
        }
      }

      values = values.concat(result);
    }
  }

  return values;
}
