/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast
 * @fileoverview Transform MDAST to HAST.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = toHAST;

/* Dependencies. */
var xtend = require('xtend');
var u = require('unist-builder');
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var definitions = require('mdast-util-definitions');
var one = require('./one');
var footer = require('./footer');

/**
 * Factory to transform.
 *
 * @param {Node} tree - MDAST tree.
 * @param {Object?} options - Configuration.
 * @return {Function} - Hyperscript-like DSL.
 */
function factory(tree, options) {
  options = options || {};
  var dangerous = options.allowDangerousHTML;
  var handlers = options.customHandlers || {};

  /**
   * Finalise the created `right`, a HAST node, from
   * `left`, an MDAST node.
   *
   * @param {Node} left - MDAST node.
   * @param {Node} right - HAST node.
   */
  function augment(left, right) {
    var data;
    var ctx;

    /* handle `data.hName`, `data.hProperties, `hChildren`. */
    if (left && 'data' in left) {
      data = left.data;

      if (right.type === 'element' && data.hName) {
        right.tagName = data.hName;
      }

      if (right.type === 'element' && data.hProperties) {
        right.properties = xtend(right.properties, data.hProperties);
      }

      if (right.children && data.hChildren) {
        right.children = data.hChildren;
      }
    }

    ctx = left && left.position ? left : {position: left};

    if (!position.generated(ctx)) {
      right.position = {
        start: position.start(ctx),
        end: position.end(ctx)
      };
    }

    return right;
  }

  /**
   * Create an element for a `node`.
   *
   * @param {Node} node - MDAST node to compile for.
   * @param {string} tagName - Proposed tag-name.
   * @param {Object?} [props={}] - Properties.
   * @param {Array.<Node>} children - HAST children.
   */
  function h(node, tagName, props, children) {
    if (
      children == null &&
      typeof props === 'object' &&
      'length' in props
    ) {
      children = props;
      props = {};
    }

    return augment(node, {
      type: 'element',
      tagName: tagName,
      properties: props || {},
      children: children || []
    });
  }

  h.dangerous = dangerous;
  h.customHandlers = handlers;
  h.definition = definitions(tree);
  h.footnotes = [];
  h.augment = augment;

  visit(tree, 'footnoteDefinition', function (definition) {
    h.footnotes.push(definition);
  });

  return h;
}

/**
 * Transform `tree`, which is an MDAST node, to a HAST node.
 *
 * @param {Node} tree - MDAST Node.
 * @param {Object} [options] - Configuration.
 * @return {Node} - HAST Node.
 */
function toHAST(tree, options) {
  var h = factory(tree, options);
  var node = one(h, tree);
  var footnotes = footer(h);

  if (node && node.children && footnotes) {
    node.children = node.children.concat(u('text', '\n'), footnotes);
  }

  return node;
}
