/**
 * @typedef {import('hast').Content} HastContent
 * @typedef {import('hast').Element} HastElement
 * @typedef {import('hast').ElementContent} HastElementContent
 * @typedef {import('hast').Properties} HastProperties
 * @typedef {import('hast').Root} HastRoot
 *
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('mdast').Definition} MdastDefinition
 * @typedef {import('mdast').FootnoteDefinition} MdastFootnoteDefinition
 * @typedef {import('mdast').Parent} MdastParent
 * @typedef {import('mdast').Root} MdastRoot
 */

/**
 * @typedef {HastRoot | HastContent} HastNodes
 * @typedef {MdastRoot | MdastContent} MdastNodes
 * @typedef {Extract<MdastNodes, MdastParent>} MdastParents
 *
 * @typedef EmbeddedHastFields
 *   hast fields.
 * @property {string | null | undefined} [hName]
 *   Generate a specific element with this tag name instead.
 * @property {HastProperties | null | undefined} [hProperties]
 *   Generate an element with these properties instead.
 * @property {Array<HastElementContent> | null | undefined} [hChildren]
 *   Generate an element with this content instead.
 *
 * @typedef {Record<string, unknown> & EmbeddedHastFields} MdastData
 *   mdast data with embedded hast fields.
 *
 * @typedef {MdastNodes & {data?: MdastData | null | undefined}} MdastNodeWithData
 *   mdast node with embedded hast data.
 *
 * @typedef PointLike
 *   Point-like value.
 * @property {number | null | undefined} [line]
 *   Line.
 * @property {number | null | undefined} [column]
 *   Column.
 * @property {number | null | undefined} [offset]
 *   Offset.
 *
 * @typedef PositionLike
 *   Position-like value.
 * @property {PointLike | null | undefined} [start]
 *   Point-like value.
 * @property {PointLike | null | undefined} [end]
 *   Point-like value.
 *
 * @callback Handler
 *   Handle a node.
 * @param {H} h
 *   Handle context.
 * @param {any} node
 *   mdast node to handle.
 * @param {MdastParents | null | undefined} parent
 *   Parent of `node`.
 * @returns {HastElementContent | Array<HastElementContent> | null | undefined}
 *   hast node.
 *
 * @callback HFunctionProps
 *   Signature of `h` for when props are passed.
 * @param {MdastNodes | PositionLike | null | undefined} node
 *   mdast node or unist position.
 * @param {string} tagName
 *   HTML tag name.
 * @param {HastProperties} props
 *   Properties.
 * @param {Array<HastElementContent> | null | undefined} [children]
 *   hast content.
 * @returns {HastElement}
 *   Compiled element.
 *
 * @callback HFunctionNoProps
 *   Signature of `h` for when no props are passed.
 * @param {MdastNodes | PositionLike | null | undefined} node
 *   mdast node or unist position.
 * @param {string} tagName
 *   HTML tag name.
 * @param {Array<HastElementContent> | null | undefined} [children]
 *   hast content.
 * @returns {HastElement}
 *   Compiled element.
 *
 * @typedef HFields
 *   Info on `h`.
 * @property {boolean} dangerous
 *   Whether HTML is allowed.
 * @property {string} clobberPrefix
 *   Prefix to use to prevent DOM clobbering.
 * @property {string} footnoteLabel
 *   Label to use to introduce the footnote section.
 * @property {string} footnoteLabelTagName
 *   HTML used for the footnote label.
 * @property {HastProperties} footnoteLabelProperties
 *   Properties on the HTML tag used for the footnote label.
 * @property {string} footnoteBackLabel
 *   Label to use to go back to a footnote call from the footnote section.
 * @property {(identifier: string) => MdastDefinition | null} definition
 *   Definition cache.
 * @property {Record<string, MdastFootnoteDefinition>} footnoteById
 *   Footnote cache.
 * @property {Array<string>} footnoteOrder
 *   Order in which footnotes occur.
 * @property {Record<string, number>} footnoteCounts
 *   Counts the same footnote was used.
 * @property {Handlers} handlers
 *   Applied handlers.
 * @property {Handler} unknownHandler
 *   Handler for any none not in `passThrough` or otherwise handled.
 * @property {(origin: MdastNodes, node: HastNodes) => void} patch
 *   Copy a node’s positional info.
 * @property {<Type extends HastNodes>(origin: MdastNodes, node: Type) => Type | HastElement} applyData
 *   Honor the `data` of `origin`, and generate an element instead of `node`.
 * @property {(left: MdastNodeWithData | PositionLike | null | undefined, right: HastElementContent) => HastElementContent} augment
 *   Like `h` but lower-level and usable on non-elements.
 * @property {Array<string>} passThrough
 *   List of node types to pass through untouched (except for their children).
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [allowDangerousHtml=false]
 *   Whether to allow `html` nodes and inject them as `raw` HTML.
 * @property {string | null | undefined} [clobberPrefix='user-content-']
 *   Prefix to use before the `id` attribute to prevent it from *clobbering*.
 *   attributes.
 *   DOM clobbering is this:
 *
 *   ```html
 *   <p id=x></p>
 *   <script>alert(x)</script>
 *   ```
 *
 *   Elements by their ID are made available in browsers on the `window` object.
 *   Using a prefix prevents this from being a problem.
 * @property {string | null | undefined} [footnoteLabel='Footnotes']
 *   Label to use for the footnotes section.
 *   Affects screen reader users.
 *   Change it if you’re authoring in a different language.
 * @property {string | null | undefined} [footnoteLabelTagName='h2']
 *   HTML tag to use for the footnote label.
 *   Can be changed to match your document structure and play well with your choice of css.
 * @property {HastProperties | null | undefined} [footnoteLabelProperties={className: ['sr-only']}]
 *   Properties to use on the footnote label.
 *   A 'sr-only' class is added by default to hide this from sighted users.
 *   Change it to make the label visible, or add classes for other purposes.
 * @property {string | null | undefined} [footnoteBackLabel='Back to content']
 *   Label to use from backreferences back to their footnote call.
 *   Affects screen reader users.
 *   Change it if you’re authoring in a different language.
 * @property {Handlers | null | undefined} [handlers]
 *   Object mapping mdast nodes to functions handling them
 * @property {Array<string> | null | undefined} [passThrough]
 *   List of custom mdast node types to pass through (keep) in hast
 * @property {Handler | null | undefined} [unknownHandler]
 *   Handler for all unknown nodes.
 *
 * @typedef {Record<string, Handler>} Handlers
 *   Map of node types to handlers
 *
 * @typedef {HFunctionProps & HFunctionNoProps & HFields} H
 *   Handle context
 */

import {visit} from 'unist-util-visit'
import {position, pointStart, pointEnd} from 'unist-util-position'
import {generated} from 'unist-util-generated'
import {definitions} from 'mdast-util-definitions'
import {one} from './traverse.js'
import {footer} from './footer.js'
import {handlers} from './handlers/index.js'

const own = {}.hasOwnProperty

/**
 * Create `h` from an mdast tree.
 *
 * @param {MdastNodes} tree
 *   mdast node to transform.
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {H}
 *   `h` function.
 */
function factory(tree, options) {
  const settings = options || {}
  const dangerous = settings.allowDangerousHtml || false
  /** @type {Record<string, MdastFootnoteDefinition>} */
  const footnoteById = {}

  h.dangerous = dangerous
  h.clobberPrefix =
    settings.clobberPrefix === undefined || settings.clobberPrefix === null
      ? 'user-content-'
      : settings.clobberPrefix
  h.footnoteLabel = settings.footnoteLabel || 'Footnotes'
  h.footnoteLabelTagName = settings.footnoteLabelTagName || 'h2'
  h.footnoteLabelProperties = settings.footnoteLabelProperties || {
    className: ['sr-only']
  }
  h.footnoteBackLabel = settings.footnoteBackLabel || 'Back to content'
  h.definition = definitions(tree)
  h.footnoteById = footnoteById
  /** @type {Array<string>} */
  h.footnoteOrder = []
  /** @type {Record<string, number>} */
  h.footnoteCounts = {}
  h.patch = patch
  h.applyData = applyData
  h.augment = augment
  h.handlers = {...handlers, ...settings.handlers}
  h.unknownHandler = settings.unknownHandler
  h.passThrough = settings.passThrough

  visit(tree, 'footnoteDefinition', (definition) => {
    const id = String(definition.identifier).toUpperCase()

    // Mimick CM behavior of link definitions.
    // See: <https://github.com/syntax-tree/mdast-util-definitions/blob/8290999/index.js#L26>.
    if (!own.call(footnoteById, id)) {
      footnoteById[id] = definition
    }
  })

  // @ts-expect-error Hush, it’s fine!
  return h

  /**
   * Finalise the created `right`, a hast node, from `left`, an mdast node.
   *
   * @param {MdastNodeWithData | PositionLike | null | undefined} left
   * @param {HastElementContent} right
   * @returns {HastElementContent}
   */
  /* c8 ignore start */
  // To do: next major: remove.
  function augment(left, right) {
    // Handle `data.hName`, `data.hProperties, `data.hChildren`.
    if (left && 'data' in left && left.data) {
      /** @type {MdastData} */
      const data = left.data

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
      const ctx = 'type' in left ? left : {position: left}

      if (!generated(ctx)) {
        // @ts-expect-error: fine.
        right.position = {start: pointStart(ctx), end: pointEnd(ctx)}
      }
    }

    return right
  }
  /* c8 ignore stop */

  /**
   * Create an element for `node`.
   *
   * @type {HFunctionProps}
   */
  /* c8 ignore start */
  // To do: next major: remove.
  function h(node, tagName, props, children) {
    if (Array.isArray(props)) {
      children = props
      props = {}
    }

    // @ts-expect-error augmenting an element yields an element.
    return augment(node, {
      type: 'element',
      tagName,
      properties: props || {},
      children: children || []
    })
  }
  /* c8 ignore stop */
}

/**
 * Copy a node’s positional info.
 *
 * @param {MdastNodes} origin
 *   mdast node to copy from.
 * @param {HastNodes} node
 *   hast node to copy into.
 * @returns {void}
 *   Nothing.
 */
function patch(origin, node) {
  if (origin.position) node.position = position(origin)
}

/**
 * Honor the `data` of `origin`, and generate an element instead of `node`.
 *
 * @template {HastNodes} Type
 *   Node type.
 * @param {MdastNodes} origin
 *   mdast node to use data from.
 * @param {Type} node
 *   hast node to change.
 * @returns {Type | HastElement}
 *   Nothing.
 */
function applyData(origin, node) {
  /** @type {Type | HastElement} */
  let result = node

  // Handle `data.hName`, `data.hProperties, `data.hChildren`.
  if (origin && origin.data) {
    const hName = origin.data.hName
    const hChildren = origin.data.hChildren
    const hProperties = origin.data.hProperties

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
        result = {
          type: 'element',
          tagName: hName,
          properties: {},
          children: []
        }

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
 * Turn an mdast tree into a hast node.
 *
 * @param {MdastNodes} tree
 *   mdast tree.
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {HastNodes | null | undefined}
 *   hast tree.
 */
export function toHast(tree, options) {
  const h = factory(tree, options)
  const node = one(h, tree, null)
  const foot = footer(h)

  if (foot) {
    // @ts-expect-error If there’s a footer, there were definitions, meaning block
    // content.
    // So assume `node` is a parent node.
    node.children.push({type: 'text', value: '\n'}, foot)
  }

  // To do: next major: always return root?
  return Array.isArray(node) ? {type: 'root', children: node} : node
}

export {handlers as defaultHandlers} from './handlers/index.js'
