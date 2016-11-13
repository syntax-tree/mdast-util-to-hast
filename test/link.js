'use strict';

var test = require('tape');
var u = require('unist-builder');
var to = require('..');

test('Link', function (t) {
  t.deepEqual(
    to(u('link', {
      url: 'http://golf.hotel',
      title: 'India'
    }, [u('text', 'juliett')])),
    u('element', {tagName: 'a', properties: {
      href: 'http://golf.hotel',
      title: 'India'
    }}, [u('text', 'juliett')]),
    'should transform `link` to `a`'
  );

  t.deepEqual(
    to(u('link', {
      url: 'http://kilo.lima'
    }, [u('text', 'mike')])),
    u('element', {tagName: 'a', properties: {
      href: 'http://kilo.lima'
    }}, [u('text', 'mike')]),
    'should transform `link` to `a` (missing `title`)'
  );

  t.end();
});
