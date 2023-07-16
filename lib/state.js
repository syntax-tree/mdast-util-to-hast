/**
 * @typedef {import('hast').Element} HastElement
 * @typedef {import('hast').ElementContent} HastElementContent
 * @typedef {import('hast').Nodes} HastNodes
 * @typedef {import('hast').Properties} HastProperties
 * @typedef {import('hast').RootContent} HastRootContent
 * @typedef {import('hast').Text} HastText
 *
 * @typedef {import('mdast').Definition} MdastDefinition
 * @typedef {import('mdast').FootnoteDefinition} MdastFootnoteDefinition
 * @typedef {import('mdast').Nodes} MdastNodes
 * @typedef {import('mdast').Parents} MdastParents
 */

/**
 * @typedef EmbeddedHastFields
 *   hast fields.
 * @property {string | undefined} [hName]
 *   Generate a specific element with this tag name instead.
 * @property {HastProperties | undefined} [hProperties]
 *   Generate an element with these properties instead.
 * @property {Array<HastElementContent> | undefined} [hChildren]
 *   Generate an element with this content instead.
 *
 *   To do: type data!
 *
 * @typedef {Record<string, unknown> & EmbeddedHastFields} MdastData
 *   mdast data with embedded hast fields.
 *
 *   To do: type data!
 *
 * @typedef {MdastNodes & {data?: MdastData | undefined}} MdastNodeWithData
 *   mdast node with embedded hast data.
 *
 *   To do: type data!
 *
 * @callback Handler
 *   Handle a node.
 * @param {State} state
 *   Info passed around.
 * @param {any} node
 *   mdast node to handle.
 * @param {MdastParents | undefined} parent
 *   Parent of `node`.
 * @returns {Array<HastElementContent> | HastElementContent | undefined}
 *   hast node.
 *
 * @typedef State
 *   Info passed around.
 * @property {(node: MdastNodes) => Array<HastElementContent>} all
 *   Transform the children of an mdast parent to hast.
 * @property {<Type extends HastNodes>(from: MdastNodes, to: Type) => HastElement | Type} applyData
 *   Honor the `data` of `from`, and generate an element instead of `node`.
 * @property {Map<string, MdastDefinition>} definitionById
 *   Definitions by their identifier.
 * @property {Map<string, MdastFootnoteDefinition>} footnoteById
 *   Footnote definitions by their identifier.
 * @property {Map<string, number>} footnoteCounts
 *   Counts for how often the same footnote was called.
 * @property {Array<string>} footnoteOrder
 *   Identifiers of order when footnote calls first appear in tree order.
 * @property {Handlers} handlers
 *   Applied handlers.
 * @property {(node: MdastNodes, parent: MdastParents | undefined) => Array<HastElementContent> | HastElementContent | undefined} one
 *   Transform an mdast node to hast.
 * @property {Options} options
 *   Configuration.
 * @property {(from: MdastNodes, node: HastNodes) => void} patch
 *   Copy a node’s positional info.
 * @property {<Type extends HastRootContent>(nodes: Array<Type>, loose?: boolean | undefined) => Array<HastText | Type>} wrap
 *   Wrap `nodes` with line endings between each node, adds initial/final line endings when `loose`.
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [allowDangerousHtml=false]
 *   Whether to persist raw HTML in markdown in the hast tree (default:
 *   `false`).
 * @property {string | null | undefined} [clobberPrefix='user-content-']
 *   Prefix to use before the `id` attribute on footnotes to prevent it from
 *   *clobbering*(default: `'user-content-'`).
 * @property {string | null | undefined} [footnoteBackLabel='Back to content']
 *   Label to use from backreferences back to their footnote call (affects
 *   screen readers) (default: `'Back to content'`).
 * @property {string | null | undefined} [footnoteLabel='Footnotes']
 *   Label to use for the footnotes section (affects screen readers) (default:
 *   `'Footnotes'`).
 * @property {HastProperties | null | undefined} [footnoteLabelProperties={className: ['sr-only']}]
 *   Properties to use on the footnote label (note that `id: 'footnote-label'`
 *   is always added as footnote calls use it with `aria-describedby` to
 *   provide an accessible label) (default: `{className: ['sr-only']}`).
 * @property {string | null | undefined} [footnoteLabelTagName='h2']
 *   Tag name to use for the footnote label (default: `'h2'`).
 * @property {Handlers | null | undefined} [handlers]
 *   Extra handlers for nodes (optional).
 * @property {Array<string> | null | undefined} [passThrough]
 *   List of custom mdast node types to pass through (keep) in hast (note that
 *   the node itself is passed, but eventual children are transformed)
 *   (optional).
 * @property {Handler | null | undefined} [unknownHandler]
 *   Handler for all unknown nodes (optional).
 *
 * @typedef {Record<string, Handler>} Handlers
 *   Handle nodes.
 */

import {visit} from 'unist-util-visit'
import {position} from 'unist-util-position'
import {handlers as defaultHandlers} from './handlers/index.js'

const own = {}.hasOwnProperty

/**
 * Create `state` from an mdast tree.
 *
 * @param {MdastNodes} tree
 *   mdast node to transform.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {State}
 *   `state` function.
 */
export function createState(tree, options) {
  const settings = options || {}
  /** @type {Map<string, MdastDefinition>} */
  const definitionById = new Map()
  /** @type {Map<string, MdastFootnoteDefinition>} */
  const footnoteById = new Map()
  /** @type {Map<string, number>} */
  const footnoteCounts = new Map()
  /** @type {Handlers} */
  // @ts-expect-error: the root handler returns a root.
  // Hard to type.
  const handlers = {...defaultHandlers, ...settings.handlers}

  /** @type {State} */
  const state = {
    all,
    applyData,
    definitionById,
    footnoteById,
    footnoteCounts,
    footnoteOrder: [],
    handlers,
    one,
    options: settings,
    patch,
    wrap
  }

  visit(tree, function (node) {
    if (node.type === 'definition' || node.type === 'footnoteDefinition') {
      const map = node.type === 'definition' ? definitionById : footnoteById
      const id = String(node.identifier).toUpperCase()

      // Mimick CM behavior of link definitions.
      // See: <https://github.com/syntax-tree/mdast-util-definitions/blob/9032189/lib/index.js#L20-L21>.
      if (!map.has(id)) {
        // @ts-expect-error: node type matches map.
        map.set(id, node)
      }
    }
  })

  return state

  /**
   * Transform an mdast node into a hast node.
   *
   * @param {MdastNodes} node
   *   mdast node.
   * @param {MdastParents | undefined} [parent]
   *   Parent of `node`.
   * @returns {Array<HastElementContent> | HastElementContent | undefined}
   *   Resulting hast node.
   */
  function one(node, parent) {
    const type = node.type

    if (own.call(state.handlers, type)) {
      return state.handlers[type](state, node, parent)
    }

    if (state.options.passThrough && state.options.passThrough.includes(type)) {
      // To do: next major: deep clone.
      // @ts-expect-error: types of passed through nodes are expected to be added manually.
      return 'children' in node ? {...node, children: state.all(node)} : node
    }

    const unknown = state.options.unknownHandler || defaultUnknownHandler

    return unknown(state, node, parent)
  }

  /**
   * Transform the children of an mdast node into hast nodes.
   *
   * @param {MdastNodes} parent
   *   mdast node to compile
   * @returns {Array<HastElementContent>}
   *   Resulting hast nodes.
   */
  function all(parent) {
    /** @type {Array<HastElementContent>} */
    const values = []

    if ('children' in parent) {
      const nodes = parent.children
      let index = -1
      while (++index < nodes.length) {
        const result = state.one(nodes[index], parent)

        // To do: see if we van clean this? Can we merge texts?
        if (result) {
          if (index && nodes[index - 1].type === 'break') {
            if (!Array.isArray(result) && result.type === 'text') {
              result.value = result.value.replace(/^\s+/, '')
            }

            if (!Array.isArray(result) && result.type === 'element') {
              const head = result.children[0]

              if (head && head.type === 'text') {
                head.value = head.value.replace(/^\s+/, '')
              }
            }
          }

          if (Array.isArray(result)) {
            values.push(...result)
          } else {
            values.push(result)
          }
        }
      }
    }

    return values
  }
}

/**
 * Copy a node’s positional info.
 *
 * @param {MdastNodes} from
 *   mdast node to copy from.
 * @param {HastNodes} to
 *   hast node to copy into.
 * @returns {void}
 *   Nothing.
 */
function patch(from, to) {
  if (from.position) to.position = position(from)
}

/**
 * Honor the `data` of `from` and maybe generate an element instead of `to`.
 *
 * @template {HastNodes} Type
 *   Node type.
 * @param {MdastNodes} from
 *   mdast node to use data from.
 * @param {Type} to
 *   hast node to change.
 * @returns {HastElement | Type}
 *   Nothing.
 */
function applyData(from, to) {
  /** @type {HastElement | Type} */
  let result = to

  // Handle `data.hName`, `data.hProperties, `data.hChildren`.
  if (from && from.data) {
    const hName = from.data.hName
    const hChildren = from.data.hChildren
    const hProperties = from.data.hProperties

    if (typeof hName === 'string') {
      // Transforming the node resulted in an element with a different name
      // than wanted:
      if (result.type === 'element') {
        result.tagName = hName
      }
      // Transforming the node resulted in a non-element, which happens for
      // raw, text, and root nodes (unless custom handlers are passed).
      // The intent is likely to keep the content around (otherwise: pass
      // `hChildren`).
      else {
        result = {type: 'element', tagName: hName, properties: {}, children: []}

        // To do: next major: take the children from the `root`, or inject the
        // raw/text/comment or so into the element?
        // if ('children' in node) {
        //   // @ts-expect-error: assume `children` are allowed in elements.
        //   result.children = node.children
        // } else {
        //   // @ts-expect-error: assume `node` is allowed in elements.
        //   result.children.push(node)
        // }
      }
    }

    if (result.type === 'element' && hProperties) {
      result.properties = {...result.properties, ...hProperties}
    }

    if (
      'children' in result &&
      result.children &&
      hChildren !== null &&
      hChildren !== undefined
    ) {
      // @ts-expect-error: assume valid children are defined.
      result.children = hChildren
    }
  }

  return result
}

/**
 * Transform an unknown node.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdastNodes} node
 *   Unknown mdast node.
 * @returns {HastElement | HastText}
 *   Resulting hast node.
 */
function defaultUnknownHandler(state, node) {
  const data = node.data || {}
  /** @type {HastElement | HastText} */
  const result =
    'value' in node &&
    !(own.call(data, 'hProperties') || own.call(data, 'hChildren'))
      ? {type: 'text', value: node.value}
      : {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: state.all(node)
        }

  state.patch(node, result)
  return state.applyData(node, result)
}

/**
 * Wrap `nodes` with line endings between each node.
 *
 * @template {HastRootContent} Type
 *   Node type.
 * @param {Array<Type>} nodes
 *   List of nodes to wrap.
 * @param {boolean | undefined} [loose=false]
 *   Whether to add line endings at start and end (default: `false`).
 * @returns {Array<HastText | Type>}
 *   Wrapped nodes.
 */
export function wrap(nodes, loose) {
  /** @type {Array<HastText | Type>} */
  const result = []
  let index = -1

  if (loose) {
    result.push({type: 'text', value: '\n'})
  }

  while (++index < nodes.length) {
    if (index) result.push({type: 'text', value: '\n'})
    result.push(nodes[index])
  }

  if (loose && nodes.length > 0) {
    result.push({type: 'text', value: '\n'})
  }

  return result
}
