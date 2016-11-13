'use strict';

var test = require('tape');
var u = require('unist-builder');
var to = require('..');

test('Definition', function (t) {
  t.equal(
    to(u('definition', {
      url: 'http://uniform.whiskey',
      identifier: 'x-ray',
      title: 'yankee'
    })),
    null,
    'should ignore `definition`'
  );

  t.end();
});
