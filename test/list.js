'use strict';

var test = require('tape');
var u = require('unist-builder');
var to = require('..');

test('List', function (t) {
  t.deepEqual(
    to(u('list', {ordered: true}, [
      u('listItem', [u('paragraph', [u('text', 'uniform')])])
    ])),
    u('element', {tagName: 'ol', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'li', properties: {}}, [
        u('text', 'uniform')
      ]),
      u('text', '\n')
    ]),
    'should transform ordered lists to `ol`'
  );

  t.deepEqual(
    to(u('list', {ordered: false}, [
      u('listItem', [u('paragraph', [u('text', 'whiskey')])])
    ])),
    u('element', {tagName: 'ul', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'li', properties: {}}, [
        u('text', 'whiskey')
      ]),
      u('text', '\n')
    ]),
    'should transform unordered lists to `ul`'
  );

  t.deepEqual(
    to(u('list', {ordered: true, start: 3}, [
      u('listItem', [u('paragraph', [u('text', 'x-ray')])])
    ])),
    u('element', {tagName: 'ol', properties: {start: 3}}, [
      u('text', '\n'),
      u('element', {tagName: 'li', properties: {}}, [
        u('text', 'x-ray')
      ]),
      u('text', '\n')
    ]),
    'should support `start` in ordered lists'
  );

  t.end();
});
