/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:code
 * @fileoverview Handle `code`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = code;

/* Dependencies. */
var detab = require('detab');
var u = require('unist-builder');

/**
 * Transform a code block.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function code(h, node) {
  var value = node.value ? detab(node.value + '\n') : '';
  var lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/);
  var props = {};

  if (lang) {
    props.className = ['language-' + lang];
  }

  return h(node.position, 'pre', [
    h(node, 'code', props, [u('text', value)])
  ]);
}
