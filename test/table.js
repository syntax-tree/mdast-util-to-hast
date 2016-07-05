/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module mdast-util-to-hast
 * @fileoverview Test suite for `mdast-util-to-hast`.
 */

'use strict';

/* eslint-env node */

/* Dependencies. */
var test = require('tape');
var u = require('unist-builder');
var to = require('..');

/* Tests. */
test('Table', function (t) {
  t.deepEqual(
    to(u('table', {align: ['left', 'right']}, [
      u('tableRow', [
        u('tableCell', [u('text', 'yankee')]),
        u('tableCell', [u('text', 'zulu')])
      ]),
      u('tableRow', [
        u('tableCell', [u('text', 'alpha')])
      ])
    ])),
    u('element', {tagName: 'table', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'thead', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'tr', properties: {}}, [
          u('text', '\n'),
          u('element', {tagName: 'th', properties: {align: 'left'}}, [
            u('text', 'yankee')
          ]),
          u('text', '\n'),
          u('element', {tagName: 'th', properties: {align: 'right'}}, [
            u('text', 'zulu')
          ]),
          u('text', '\n')
        ]),
        u('text', '\n')
      ]),
      u('text', '\n'),
      u('element', {tagName: 'tbody', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'tr', properties: {}}, [
          u('text', '\n'),
          u('element', {tagName: 'td', properties: {align: 'left'}}, [
            u('text', 'alpha')
          ]),
          u('text', '\n'),
          u('element', {tagName: 'td', properties: {align: 'right'}}, []),
          u('text', '\n')
        ]),
        u('text', '\n')
      ]),
      u('text', '\n')
    ]),
    'should transform `table`'
  );

  t.end();
});
