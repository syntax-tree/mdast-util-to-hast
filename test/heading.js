'use strict';

var test = require('tape');
var u = require('unist-builder');
var to = require('..');

test('Heading', function (t) {
  t.deepEqual(
    to(u('heading', {depth: 4}, [u('text', 'echo')])),
    u('element', {tagName: 'h4', properties: {}}, [u('text', 'echo')]),
    'should transform `heading` to a `h[1-6]` element'
  );

  t.end();
});
