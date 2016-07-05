/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:table
 * @fileoverview Handle `table`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = table;

/* Dependencies. */
var position = require('unist-util-position');
var wrap = require('../wrap');
var all = require('../all');

/**
 * Transform a table.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function table(h, node) {
  var rows = node.children;
  var index = rows.length;
  var align = node.align;
  var alignLength = align.length;
  var result = [];
  var pos;
  var row;
  var out;
  var name;
  var cell;

  while (index--) {
    row = rows[index].children;
    name = index === 0 ? 'th' : 'td';
    pos = alignLength;
    out = [];

    while (pos--) {
      cell = row[pos];
      out[pos] = h(cell, name, {
        align: align[pos]
      }, cell ? wrap(all(h, cell)) : []);
    }

    result[index] = h(rows[index], 'tr', wrap(out, true));
  }

  return h(node, 'table', wrap([
    h(result[0].position, 'thead', wrap([result[0]], true)),
    h({
      start: position.start(result[1]),
      end: position.end(result[result.length - 1])
    }, 'tbody', wrap(result.slice(1), true))
  ], true));
}
