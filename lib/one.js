'use strict';

module.exports = one;

var u = require('unist-builder');
var has = require('has');
var all = require('./all');

/* Transform an unknown node. */
function unknown(h, node) {
  if ('value' in node) {
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
