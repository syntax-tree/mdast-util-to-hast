'use strict';

var test = require('tape');
var u = require('unist-builder');
var to = require('..');

test('FootnoteReference', function (t) {
  t.deepEqual(
    to(u('footnoteReference', {
      identifier: 'alpha'
    })),
    u('element', {tagName: 'sup', properties: {
      id: 'fnref-alpha'
    }}, [
      u('element', {tagName: 'a', properties: {
        href: '#fn-alpha',
        className: ['footnote-ref']
      }}, [u('text', 'alpha')])
    ]),
    'should render `footnoteReference`s'
  );

  t.end();
});
