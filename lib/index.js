/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('mdast').Definition} Definition
 * @typedef {import('mdast').FootnoteDefinition} FootnoteDefinition
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('hast').Text} Text
 * @typedef {import('hast').Comment} Comment
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Root} Root
 * @typedef {import('unist-util-position').NodeLike} NodeLikeWithPosition
 * @typedef {import('unist-util-position').PositionLike} PositionLike
 * @typedef {import('unist-util-visit').Visitor<FootnoteDefinition>} FootnoteDefinitionVisitor
 *
 * @typedef {Element|Text|Comment} Content
 *
 * @typedef EmbeddedHastFields
 * @property {string} [hName] Defines the tag name of an element
 * @property {Properties} [hProperties] Defines the properties of an element
 * @property {Array.<Content>} [hChildren] Defines the (hast) children of an element
 *
 * @typedef {Object.<string, unknown> & EmbeddedHastFields} Data unist data with embedded hast fields
 *
 * @typedef {Node & {data?: Data}} NodeWithData unist node with embedded hast data
 *
 * @callback Handler
 * @param {H} h Handle context
 * @param {Node} node mdast node to handle
 * @param {Parent|null} parent Parent of `node`
 * @returns {Content|Array.<Content>|null|undefined} hast node
 *
 * @callback HFunctionProps
 * @param {Node|PositionLike|null|undefined} node mdast node or unist position
 * @param {string} tagName HTML tag name
 * @param {Properties} props Properties
 * @param {Array.<Content>?} [children] hast content
 * @returns {Element}
 *
 * @callback HFunctionNoProps
 * @param {Node|PositionLike|null|undefined} node mdast node or unist position
 * @param {string} tagName HTML tag name
 * @param {Array.<Content>?} [children] hast content
 * @returns {Element}
 *
 * @typedef HFields
 * @property {boolean} dangerous Whether HTML is allowed
 * @property {(identifier: string) => Definition|null} definition Definition cache
 * @property {Object.<string, FootnoteDefinition>} footnoteById Footnote cache
 * @property {Array.<string>} footnoteOrder Order in which footnotes occur
 * @property {Handlers} handlers Applied handlers
 * @property {Handler} unknownHandler Handler for any none not in `passThrough` or otherwise handled
 * @property {(left: NodeWithData|PositionLike|null|undefined, right: Content) => Content} augment Like `h` but lower-level and usable on non-elements.
 * @property {Array.<string>} passThrough List of node types to pass through untouched (except for their children).
 *
 * @typedef Options
 * @property {boolean} [allowDangerousHtml=false] Whether to allow `html` nodes and inject them as `raw` HTML
 * @property {Handlers} [handlers] Object mapping mdast nodes to functions handling them
 * @property {Array.<string>} [passThrough] List of custom mdast node types to pass through (keep) in hast
 * @property {Handler} [unknownHandler] Handler for all unknown nodes.
 *
 * @typedef {Record.<string, Handler>} Handlers Map of node types to handlers
 * @typedef {HFunctionProps & HFunctionNoProps & HFields} H Handle context
 */

import {u} from 'unist-builder'
import {visit} from 'unist-util-visit'
import {pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'
import {definitions} from 'mdast-util-definitions'
import {one} from './traverse.js'
import {footer} from './footer.js'
import {handlers} from './handlers/index.js'

var own = {}.hasOwnProperty

/**
 * Factory to transform.
 * @param {Node} tree mdast node
 * @param {Options} [options] Configuration
 * @returns {H} `h` function
 */
function factory(tree, options) {
  var settings = options || {}
  var dangerous = settings.allowDangerousHtml || false
  /** @type {Object.<string, FootnoteDefinition>} */
  var footnoteById = {}

  h.dangerous = dangerous
  h.definition = definitions(tree)
  h.footnoteById = footnoteById
  /** @type {Array.<string>} */
  h.footnoteOrder = []
  h.augment = augment
  h.handlers = {...handlers, ...settings.handlers}
  h.unknownHandler = settings.unknownHandler
  h.passThrough = settings.passThrough

  visit(tree, 'footnoteDefinition', onfootnotedefinition)

  // @ts-ignore Hush, it’s fine!
  return h

  /**
   * Finalise the created `right`, a hast node, from `left`, an mdast node.
   * @param {(NodeWithData|PositionLike)?} left
   * @param {Content} right
   * @returns {Content}
   */
  function augment(left, right) {
    /** @type {Data} */
    var data
    /** @type {NodeLikeWithPosition} */
    var ctx

    // Handle `data.hName`, `data.hProperties, `data.hChildren`.
    if (left && 'data' in left && left.data) {
      data = left.data

      if (data.hName) {
        if (right.type !== 'element') {
          right = {
            type: 'element',
            tagName: '',
            properties: {},
            children: []
          }
        }

        right.tagName = data.hName
      }

      if (right.type === 'element' && data.hProperties) {
        right.properties = {...right.properties, ...data.hProperties}
      }

      if ('children' in right && right.children && data.hChildren) {
        right.children = data.hChildren
      }
    }

    if (left) {
      // @ts-ignore looks like a node vs. position.
      ctx = 'type' in left ? left : {position: left}

      if (!generated(ctx)) {
        right.position = {start: pointStart(ctx), end: pointEnd(ctx)}
      }
    }

    return right
  }

  /**
   * Create an element for `node`.
   *
   * @type {HFunctionProps}
   */
  function h(node, tagName, props, children) {
    if (Array.isArray(props)) {
      children = props
      props = {}
    }

    // @ts-ignore augmenting an element yields an element.
    return augment(node, {
      type: 'element',
      tagName,
      properties: props || {},
      children: children || []
    })
  }

  /**
   * @type {FootnoteDefinitionVisitor}
   */
  function onfootnotedefinition(definition) {
    var id = String(definition.identifier).toUpperCase()

    // Mimick CM behavior of link definitions.
    // See: <https://github.com/syntax-tree/mdast-util-definitions/blob/8290999/index.js#L26>.
    if (!own.call(footnoteById, id)) {
      footnoteById[id] = definition
    }
  }
}

/**
 * Transform `tree` (an mdast node) to a hast node.
 *
 * @param {Node} tree mdast node
 * @param {Options} [options] Configuration
 * @returns {Node} hast node
 */
export function toHast(tree, options) {
  var h = factory(tree, options)
  var node = one(h, tree, null)
  var foot = footer(h)

  if (foot) {
    // @ts-ignore If there’s a footer, there were definitions, meaning block
    // content.
    // So assume `node` is a parent node.
    node.children.push(u('text', '\n'), foot)
  }

  return Array.isArray(node) ? {type: 'root', children: node} : node
}
