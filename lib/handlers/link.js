'use strict';

var normalize = require('normalize-uri');
var all = require('../all');

module.exports = link;

/* Transform a link. */
function link(h, node) {
  var props = {href: normalize(node.url)};

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title;
  }

  if (node.relation !== null && node.relation !== undefined) {
    props.rel = node.relation;
  }
  return h(node, 'a', props, all(h, node));
}
