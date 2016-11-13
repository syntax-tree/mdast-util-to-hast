'use strict';

var test = require('tape');
var u = require('unist-builder');
var to = require('..');

test('Paragraph', function (t) {
  t.deepEqual(
    to(u('paragraph', [u('text', 'bravo')])),
    u('element', {tagName: 'p', properties: {}}, [u('text', 'bravo')]),
    'should transform `paragraph` to a `p` element'
  );

  t.end();
});
