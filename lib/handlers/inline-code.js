'use strict';

module.exports = inlineCode;

var collapse = require('collapse-white-space');
var u = require('unist-builder');

/* Transform inline code. */
function inlineCode(h, node) {
  var lang = node.lang && node.lang.match(/^[^\ \t]+(?=[\ \t]|$)/);
  var props = {};

  if (lang) {
    props.className = ['language-' + lang];
  }

  return h(node, 'code', props, [u('text', collapse(node.value))]);
}
