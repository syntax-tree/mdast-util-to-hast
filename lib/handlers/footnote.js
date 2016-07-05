/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:footnote
 * @fileoverview Handle `footnote`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = footnote;

/* Dependencies. */
var footnoteReference = require('./footnote-reference');

/**
 * Transform an inline footnote.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function footnote(h, node) {
  var identifiers = [];
  var identifier = 1;
  var footnotes = h.footnotes;
  var length = footnotes.length;
  var index = -1;

  while (++index < length) {
    identifiers[index] = footnotes[index].identifier;
  }

  while (identifiers.indexOf(String(identifier)) !== -1) {
    identifier++;
  }

  identifier = String(identifier);

  footnotes.push({
    type: 'footnoteDefinition',
    identifier: identifier,
    children: node.children,
    position: node.position
  });

  return footnoteReference(h, {
    type: 'footnoteReference',
    identifier: identifier,
    position: node.position
  });
}
