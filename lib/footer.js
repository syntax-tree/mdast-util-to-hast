/**
 * @typedef {import('mdast').BlockContent} BlockContent
 * @typedef {import('mdast').FootnoteDefinition} FootnoteDefinition
 * @typedef {import('mdast').Link} Link
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('./index.js').H} H
 */

import {thematicBreak} from './handlers/thematic-break.js'
import {list} from './handlers/list.js'
import {wrap} from './wrap.js'

/**
 * @param {H} h
 */
export function footer(h) {
  var footnoteById = h.footnoteById
  var footnoteOrder = h.footnoteOrder
  var index = -1
  /** @type {Array.<ListItem>} */
  var listItems = []
  /** @type {FootnoteDefinition} */
  var def
  /** @type {Link} */
  var backReference
  /** @type {Paragraph} */
  var tail
  /** @type {Array.<BlockContent>} */
  var content

  while (++index < footnoteOrder.length) {
    def = footnoteById[footnoteOrder[index].toUpperCase()]

    if (!def) {
      continue
    }

    content = [...def.children]
    backReference = {
      type: 'link',
      url: '#fnref-' + def.identifier,
      data: {hProperties: {className: ['footnote-backref']}},
      children: [{type: 'text', value: '↩'}]
    }

    if (
      content[content.length - 1] &&
      content[content.length - 1].type === 'paragraph'
    ) {
      // @ts-ignore it’s a paragraph, TypeScript...
      tail = content[content.length - 1]
    } else {
      tail = {type: 'paragraph', children: []}
      content.push(tail)
    }

    tail.children.push(backReference)

    listItems.push({
      type: 'listItem',
      data: {hProperties: {id: 'fn-' + def.identifier}},
      children: content,
      position: def.position
    })
  }

  if (listItems.length === 0) {
    return null
  }

  return h(
    null,
    'div',
    {className: ['footnotes']},
    wrap(
      [].concat(
        thematicBreak(h),
        list(h, {type: 'list', ordered: true, children: listItems})
      ),
      true
    )
  )
}
