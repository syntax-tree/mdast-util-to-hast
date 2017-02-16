'use strict';

var test = require('tape');
var u = require('unist-builder');
var to = require('..');
var all = require('../lib/all');

test('handlers option', function (t) {
  var handlers = {
    paragraph: function (h, node) {
      node.children[0].value = 'changed';
      return h(node, 'p', all(h, node));
    }
  };

  t.deepEqual(
    to(u('paragraph', [u('text', 'bravo')]), {handlers: handlers}),
    u('element', {tagName: 'p', properties: {}}, [u('text', 'changed')]),
    'should override default handler'
  );

  t.end();
});
