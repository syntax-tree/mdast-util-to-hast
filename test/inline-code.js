'use strict';

var test = require('tape');
var u = require('unist-builder');
var to = require('..');

test('InlineCode', function (t) {
  t.deepEqual(
    to(u('inlineCode', 'juliett()')),
    u('element', {tagName: 'code', properties: {}}, [
      u('text', 'juliett()')
    ]),
    'should transform `inlineCode` to a `code` element'
  );

  t.end();
});
