/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:link-reference
 * @fileoverview Handle `linkReference`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = linkReference;

/* Dependencies. */
var normalize = require('normalize-uri');
var failsafe = require('../failsafe');
var all = require('../all');

/**
 * Transform a reference to a link.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function linkReference(h, node) {
  var def = h.definition(node.identifier);
  var props = {href: normalize((def && def.url) || '')};

  if (def && def.title != null) {
    props.title = def.title;
  }

  return failsafe(h, node, def) || h(node, 'a', props, all(h, node));
}
