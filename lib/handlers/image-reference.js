/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:image-reference
 * @fileoverview Handle `imageReference`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = imageReference;

/* Dependencies. */
var normalize = require('normalize-uri');
var failsafe = require('../failsafe');

/**
 * Transform a reference to an image.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function imageReference(h, node) {
  var def = h.definition(node.identifier);
  var props = {src: normalize((def && def.url) || ''), alt: node.alt};

  if (def && def.title != null) {
    props.title = def.title;
  }

  return failsafe(h, node, def) || h(node, 'img', props);
}
