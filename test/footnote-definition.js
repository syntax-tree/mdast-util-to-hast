'use strict';

var test = require('tape');
var u = require('unist-builder');
var to = require('..');

test('FootnoteDefinition', function (t) {
  t.equal(
    to(u('footnoteDefinition', {
      identifier: 'zulu'
    }, [u('paragraph', [u('text', 'alpha')])])),
    null,
    'should ignore `footnoteDefinition`'
  );

  t.end();
});
