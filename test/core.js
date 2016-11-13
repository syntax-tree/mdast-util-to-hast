'use strict';

var test = require('tape');
var u = require('unist-builder');
var to = require('..');

test('toHAST()', function (t) {
  t.throws(
    function () {
      to(u('bar', [true]));
    },
    /Expected node, got `true`/,
    'should throw on non-nodes'
  );

  t.deepEqual(
    to(u('strong', {data: {hName: 'b'}}, [u('text', 'tango')])),
    u('element', {tagName: 'b', properties: {}}, [u('text', 'tango')]),
    'should prefer `data.hName` to tag-names'
  );

  t.deepEqual(
    to(u('strong', {data: {
      hChildren: [u('element', {tagName: 'i', properties: {}}, [u('text', 'tango')])]
    }}, [u('text', 'uniform')])),
    u('element', {tagName: 'strong', properties: {}}, [
      u('element', {tagName: 'i', properties: {}}, [u('text', 'tango')])
    ]),
    'should prefer `data.hChildren` to children'
  );

  t.deepEqual(
    to(u('emphasis', {position: {
      start: {line: 2, column: 3},
      end: {line: 2, column: 12}
    }}, [u('text', 'tango')])),
    u('element', {
      tagName: 'em',
      properties: {},
      position: {
        start: {line: 2, column: 3, offset: null},
        end: {line: 2, column: 12, offset: null}
      }
    }, [u('text', 'tango')]),
    'should patch `position`s when given'
  );

  t.deepEqual(
    to(u('code', {position: {
      start: {line: 1, column: 1},
      end: {line: 3, column: 4}
    }}, 'tango')),
    u('element', {
      tagName: 'pre',
      properties: {},
      position: {
        start: {line: 1, column: 1, offset: null},
        end: {line: 3, column: 4, offset: null}
      }
    }, [
      u('element', {
        tagName: 'code',
        properties: {},
        position: {
          start: {line: 1, column: 1, offset: null},
          end: {line: 3, column: 4, offset: null}
        }
      }, [
        u('text', 'tango\n')
      ])
    ]),
    'should patch `position`s on `pre` and `code`'
  );

  t.deepEqual(
    to(u('foo', 'tango')),
    u('text', 'tango'),
    'should transform unknown texts to `text`'
  );

  t.deepEqual(
    to(u('bar', [u('text', 'tango')])),
    u('element', {tagName: 'div', properties: {}}, [u('text', 'tango')]),
    'should transform unknown parents to `div`'
  );

  t.deepEqual(
    to(u('bar')),
    u('element', {tagName: 'div', properties: {}}, []),
    'should transform unknown nodes to `div`'
  );

  t.end();
});
