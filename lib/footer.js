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
  const footnoteById = h.footnoteById
  const footnoteOrder = h.footnoteOrder
  let index = -1
  /** @type {Array.<ListItem>} */
  const listItems = []

  while (++index < footnoteOrder.length) {
    const def = footnoteById[footnoteOrder[index].toUpperCase()]

    if (!def) {
      continue
    }

    const marker = String(index + 1)
    const content = [...def.children]
    /** @type {Link} */
    const backReference = {
      type: 'link',
      url: '#fnref' + marker,
      data: {hProperties: {className: ['footnote-back'], role: 'doc-backlink'}},
      children: [{type: 'text', value: '↩'}]
    }
    const tail = content[content.length - 1]

    if (tail && tail.type === 'paragraph') {
      // @ts-ignore it’s a paragraph, TypeScript…
      tail.children.push(backReference)
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
