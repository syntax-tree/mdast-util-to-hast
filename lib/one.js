'use strict';

module.exports = one;

var u = require('unist-builder');
var has = require('has');
var all = require('./all');

/* Check if the node should be renderered a text node. */
function isTextNode(node) {
  if ('data' in node) {
    if ('hName' in node.data) {
      return false;
    }
    if ('hProperties' in node.data) {
      return false;
    }
    if ('hChildren' in node.data) {
      return false;
    }
  }
  if ('value' in node) {
    return true;
  }
  return false;
}

/* Transform an unknown node. */
function unknown(h, node) {
  if (isTextNode(node)) {
    return h.augment(node, u('text', node.value));
  }

  return h(node, 'div', all(h, node));
}

/* Visit a node. */
function one(h, node, parent) {
  var type = node && node.type;
  var fn = has(h.handlers, type) ? h.handlers[type] : null;

  /* Fail on non-nodes. */
  if (!type) {
    throw new Error('Expected node, got `' + node + '`');
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent);
}
