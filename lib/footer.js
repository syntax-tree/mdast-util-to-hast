/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast:footnotes
 * @fileoverview Generate the footnote footer.
 */

'use strict';

/* eslint-env commonjs */

/* Expose. */
module.exports = generateFootnotes;

/* Dependencies. */
var thematicBreak = require('./handlers/thematic-break');
var list = require('./handlers/list');
var wrap = require('./wrap');

/**
 * Transform all footnote definitions, if any.
 *
 * @param {Function} h - Hyperscript DSL.
 * @return {Node?} - Compiled footnotes, if any.
 */
function generateFootnotes(h) {
  var footnotes = h.footnotes;
  var length = footnotes.length;
  var index = -1;
  var listItems = [];
  var def;

  if (!length) {
    return null;
  }

  while (++index < length) {
    def = footnotes[index];

    listItems[index] = {
      type: 'listItem',
      data: {hProperties: {id: 'fn-' + def.identifier}},
      children: def.children.concat({
        type: 'link',
        url: '#fnref-' + def.identifier,
        data: {hProperties: {className: ['footnote-backref']}},
        children: [{
          type: 'text',
          value: '↩'
        }]
      }),
      position: def.position
    };
  }

  return h(null, 'div', {
    className: ['footnotes']
  }, wrap([
    thematicBreak(h),
    list(h, {
      type: 'list',
      ordered: true,
      children: listItems
    })
  ], true));
}
