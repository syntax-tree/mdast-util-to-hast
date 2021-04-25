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
  /** @type {Array.<BlockContent>} */
  var content
  /** @type {string} */
  var marker

  while (++index < footnoteOrder.length) {
    def = footnoteById[footnoteOrder[index].toUpperCase()]

    if (!def) {
      continue
    }

    marker = String(index + 1)

    content = [...def.children]
    backReference = {
      type: 'link',
      url: '#fnref' + marker,
      data: {hProperties: {className: ['footnote-back'], role: 'doc-backlink'}},
      children: [{type: 'text', value: '↩'}]
    }

    if (
      content[content.length - 1] &&
      content[content.length - 1].type === 'paragraph'
    ) {
      // @ts-ignore it’s a paragraph, TypeScript…
      content[content.length - 1].children.push(backReference)
    } else {
      // @ts-ignore Indeed, link directly added in block content.
      content.push(backReference)
    }

    listItems.push({
      type: 'listItem',
      data: {hProperties: {id: 'fn' + marker, role: 'doc-endnote'}},
      children: content,
      position: def.position
    })
  }

  if (listItems.length === 0) {
    return null
  }

  return h(
    null,
    'section',
    {className: ['footnotes'], role: 'doc-endnotes'},
    wrap(
      [].concat(
        thematicBreak(h),
        list(h, {type: 'list', ordered: true, children: listItems})
      ),
      true
    )
  )
}
