'use strict';

var test = require('tape');
var u = require('unist-builder');
var to = require('..');

test('Image', function (t) {
  t.deepEqual(
    to(u('image', {
      url: 'http://november.oscar',
      alt: 'papa',
      title: 'québec'
    })),
    u('element', {tagName: 'img', properties: {
      src: 'http://november.oscar',
      alt: 'papa',
      title: 'québec'
    }}, []),
    'should transform `image` to `img`'
  );

  t.deepEqual(
    to(u('image', {
      url: 'http://romeo.sierra',
      alt: 'tango'
    })),
    u('element', {tagName: 'img', properties: {
      src: 'http://romeo.sierra',
      alt: 'tango'
    }}, []),
    'should transform `image` to `img` (missing `title`)'
  );

  t.end();
});
