'use strict';

var normalize = require('normalize-uri');

module.exports = image;

/* Transform an image. */
function image(h, node) {
  var props = {src: normalize(node.url), alt: node.alt};

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title;
  }

  return h(node, 'img', props);
}
