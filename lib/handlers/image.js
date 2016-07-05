/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:image
 * @fileoverview Handle `image`.
 */

'use strict';

/* eslint-env commonjs */

/* Dependencies. */
var normalize = require('normalize-uri');

/* Expose. */
module.exports = image;

/**
 * Transform an image.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function image(h, node) {
  var props = {src: normalize(node.url), alt: node.alt};

  if (node.title != null) {
    props.title = node.title;
  }

  return h(node, 'img', props);
}
