/**
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').List} List
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('hast').Element} Element
 * @typedef {import('../index.js').Handler} Handler
 * @typedef {import('../index.js').Content} Content
 */

import {u} from 'unist-builder'
import {all} from '../traverse.js'

/**
 * @type {Handler}
 * @param {ListItem} node
 * @param {List} parent
 */
export function listItem(h, node, parent) {
  var result = all(h, node)
  var loose = parent ? listLoose(parent) : listItemLoose(node)
  /** @type {Properties} */
  var props = {}
  /** @type {Array.<Content>} */
  var wrapped = []
  /** @type {number} */
  var index
  /** @type {Element} */
  var paragraph
  /** @type {Content} */
  var child

  if (typeof node.checked === 'boolean') {
    if (
      result[0] &&
      result[0].type === 'element' &&
      result[0].tagName === 'p'
    ) {
      paragraph = result[0]
    } else {
      paragraph = h(null, 'p', [])
      result.unshift(paragraph)
    }

    if (paragraph.children.length > 0) {
      paragraph.children.unshift(u('text', ' '))
    }

    paragraph.children.unshift(
      h(null, 'input', {
        type: 'checkbox',
        checked: node.checked,
        disabled: true
      })
    )

    // According to github-markdown-css, this class hides bullet.
    // See: <https://github.com/sindresorhus/github-markdown-css>.
    props.className = ['task-list-item']
  }

  index = -1

  while (++index < result.length) {
    child = result[index]

    // Add eols before nodes, except if this is a loose, first paragraph.
    if (
      loose ||
      index !== 0 ||
      child.type !== 'element' ||
      child.tagName !== 'p'
    ) {
      wrapped.push(u('text', '\n'))
    }

    if (child.type === 'element' && child.tagName === 'p' && !loose) {
      wrapped.push(...child.children)
    } else {
      wrapped.push(child)
    }
  }

  // Add a final eol.
  if (result.length > 0 && (loose || child.tagName !== 'p')) {
    wrapped.push(u('text', '\n'))
  }

  return h(node, 'li', props, wrapped)
}

/**
 * @param {List} node
 * @return {Boolean}
 */
function listLoose(node) {
  var loose = node.spread
  var children = node.children
  var index = -1

  while (!loose && ++index < children.length) {
    loose = listItemLoose(children[index])
  }

  return loose
}

/**
 * @param {ListItem} node
 * @return {Boolean}
 */
function listItemLoose(node) {
  var spread = node.spread

  return spread === undefined || spread === null
    ? node.children.length > 1
    : spread
}
