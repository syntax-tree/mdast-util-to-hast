/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:handlers:list-item
 * @fileoverview Handle `listItem`.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = listItem;

/* Dependencies. */
var u = require('unist-builder');
var wrap = require('../wrap');
var all = require('../all');

/**
 * Transform a list-item.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @param {Node} parent - Parent of `node`.
 * @return {Node} - HAST node.
 */
function listItem(h, node, parent) {
  var children = node.children;
  var head = children[0];
  var single = (!parent || !parent.loose) && head.children && children.length === 1;
  var result = all(h, single ? head : node);
  var container;
  var props = {};

  if (typeof node.checked === 'boolean') {
    if (!single && head.type !== 'paragraph') {
      result.unshift(h(null, 'p', []));
    }

    container = single ? result : result[0].children;

    if (container.length) {
      container.unshift(u('text', ' '));
    }

    container.unshift(h(null, 'input', {
      type: 'checkbox',
      checked: node.checked,
      disabled: true
    }));

    /* according to github-markdown-css, this class hides bullet. */
    props.className = 'task-list-item';
  }

  if (!single && result.length) {
    result = wrap(result, true);
  }

  return h(node, 'li', props, result);
}
