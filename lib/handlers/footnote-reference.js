/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:footnote-reference
 * @fileoverview Handle `footnoteReference`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = footnoteReference;

/* Dependencies. */
var u = require('unist-builder');

/**
 * Transform a reference to a footnote.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function footnoteReference(h, node) {
  var identifier = node.identifier;

  return h(node.position, 'sup', {id: 'fnref-' + identifier}, [
    h(node, 'a', {
      href: '#fn-' + identifier,
      className: ['footnote-ref']
    }, [u('text', identifier)])
  ]);
}
