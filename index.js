/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:to-hast
 * @fileoverview Transform MDAST to HAST.
 */

'use strict';

/* eslint-env commonjs */

/* Dependencies. */
var visit = require('unist-util-visit');
var position = require('unist-util-position');
var definitions = require('mdast-util-definitions');
var collapse = require('collapse-white-space');
var normalize = require('normalize-uri');
var trimLines = require('trim-lines');
var detab = require('detab');
var trim = require('trim');
var xtend = require('xtend');
var u = require('unist-builder');

/* Compilers. */
var handlers = {};

/**
 * Wrap `nodes` with newlines between each entry.
 * Optionally adds newlines at the start and end.
 *
 * @param {Array.<Node>} nodes - Nodes to wrap.
 * @param {boolean} loose - Whether to inject newlines at
 *   the start, and end (in case nodes has entries).
 * @return {Array.<Node>} - Wrapped nodes.
 */
function wrapInLines(nodes, loose) {
    var result = [];
    var index = -1;
    var length = nodes.length;

    if (loose) {
        result.push(u('text', '\n'));
    }

    while (++index < length) {
        if (index) {
            result.push(u('text', '\n'));
        }

        result.push(nodes[index]);
    }

    if (loose && nodes.length) {
        result.push(u('text', '\n'));
    }

    return result;
}

/**
 * Return the content of a reference without definition
 * as markdown.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @param {Node?} [definition] - Definition node.
 * @return {Array.<string>?} - Node, list of nodes, or nothing.
 */
function failsafe(h, node, definition) {
    var subtype = node.referenceType;

    if (subtype !== 'collapsed' && subtype !== 'full' && !definition) {
        if (node.type === 'imageReference') {
            return u('text', '![' + node.alt + ']');
        }

        return [u('text', '[')].concat(all(h, node), u('text', ']'));
    }
}

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
            data: { hProperties: { id: 'fn-' + def.identifier } },
            children: def.children.concat({
                type: 'link',
                url: '#fnref-' + def.identifier,
                data: { hProperties: { className: ['footnote-backref'] } },
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
    }, wrapInLines([
        thematicBreak(h),
        list(h, {
            type: 'list',
            ordered: true,
            children: listItems
        })
    ], true));
}

/**
 * Transform an unknown node.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function unknown(h, node) {
    if ('value' in node) {
        return h.wrap(node, u('text', node.value));
    }

    return h(node, 'div', all(h, node));
}

/**
 * Visit a node.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Object} node - Node.
 * @param {Object?} [parent] - `node`s parent.
 * @return {Node} - HAST node.
 * @throws {Error} - When `node` is not an MDAST node.
 */
function one(h, node, parent) {
    var type = node && node.type;
    var fn = handlers[type];

    /* Fail on non-nodes. */
    if (!type) {
        throw new Error('Expected node, got `' + node + '`');
    }

    return (typeof fn === 'function' ? fn : unknown)(h, node, parent);
}

/**
 * Transform the children of `parent`.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} parent - Parent to visit.
 * @return {Array.<Node>} - HAST nodes.
 */
function all(h, parent) {
    var nodes = parent.children || [];
    var length = nodes.length;
    var values = [];
    var index = -1;
    var result;
    var head;

    while (++index < length) {
        result = one(h, nodes[index], parent);

        if (result) {
            if (index && nodes[index - 1].type === 'break') {
                if (result.value) {
                    result.value = trim.left(result.value);
                }

                head = result.children && result.children[0];

                if (head && head.value) {
                    head.value = trim.left(head.value);
                }
            }

            values = values.concat(result);
        }
    }

    return values;
}

/**
 * Transform a `root`.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function root(h, node) {
    return h.wrap(node, u('root', wrapInLines(all(h, node))));
}

/**
 * Transform a block quote.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function blockquote(h, node) {
    return h(node, 'blockquote', wrapInLines(all(h, node), true));
}

/**
 * Transform an inline footnote.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function footnote(h, node) {
    var footnotes = h.footnotes;
    var index = -1;
    var length = footnotes.length;
    var identifiers = [];
    var identifier;

    while (++index < length) {
        identifiers[index] = footnotes[index].identifier;
    }

    identifier = 1;

    while (identifiers.indexOf(String(identifier)) !== -1) {
        identifier++;
    }

    identifier = String(identifier);

    footnotes.push({
        type: 'footnoteDefinition',
        identifier: identifier,
        children: node.children,
        position: node.position
    });

    return footnoteReference(h, {
        type: 'footnoteReference',
        identifier: identifier,
        position: node.position
    });
}

/**
 * Transform a list.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function list(h, node) {
    var props = {};

    if (typeof node.start === 'number' && node.start !== 1) {
        props.start = node.start;
    }

    return h(
        node,
        node.ordered ? 'ol' : 'ul',
        props,
        wrapInLines(all(h, node), true)
    );
}

/**
 * Transform a list-item.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @param {Node} parent - Parent of `node`.
 * @return {Node} - HAST node.
 */
function listItem(h, node, parent) {
    var head = node.children[0];
    var single;
    var result;
    var container;

    single = (!parent || !parent.loose) &&
        node.children.length === 1 &&
        head.children;

    result = all(h, single ? head : node);

    if (typeof node.checked === 'boolean') {
        if (!single && head.type !== 'paragraph') {
            result.unshift(h(null, 'p', []));
        }

        container = single ? result : result[0].children;

        if (container.length) {
            container.unshift(u('text', ' '));
        }

        container.unshift(h(null, 'input', {
            type: 'checkbox',
            checked: node.checked,
            disabled: true
        }));
    }

    if (!single && result.length) {
        result = wrapInLines(result, true);
    }

    return h(node, 'li', result);
}

/**
 * Transform a heading.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function heading(h, node) {
    return h(node, 'h' + node.depth, all(h, node));
}

/**
 * Transform a paragraph.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function paragraph(h, node) {
    return h(node, 'p', all(h, node));
}

/**
 * Transform a code block.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function code(h, node) {
    var value = node.value ? detab(node.value + '\n') : '';
    var lang = node.lang && node.lang.match(/^[^\ \t]+(?=[\ \t]|$)/);
    var props = {};

    if (lang) {
        props.className = ['language-' + lang];
    }

    return h(node.position, 'pre', [
        h(node, 'code', props, [u('text', value)])
    ]);
}

/**
 * Transform a table.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function table(h, node) {
    var rows = node.children;
    var index = rows.length;
    var align = node.align;
    var alignLength = align.length;
    var pos;
    var result = [];
    var row;
    var out;
    var name;
    var cell;
    var head;
    var rest;

    while (index--) {
        row = rows[index].children;
        name = index === 0 ? 'th' : 'td';
        pos = alignLength;
        out = [];

        while (pos--) {
            cell = row[pos];
            out[pos] = h(cell, name, {
                align: align[pos]
            }, cell ? wrapInLines(all(h, cell)) : []);
        }

        result[index] = h(rows[index], 'tr', wrapInLines(out, true));
    }

    head = result[0].position;
    rest = {
        start: position.start(result[1]),
        end: position.end(result[result.length - 1])
    };

    return h(node, 'table', wrapInLines([
        h(head, 'thead', wrapInLines([result[0]], true)),
        h(rest, 'tbody', wrapInLines(result.slice(1), true))
    ], true));
}

/**
 * Transform a thematic break / horizontal rule.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function thematicBreak(h, node) {
    return h(node, 'hr');
}

/**
 * Transform inline code.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function inlineCode(h, node) {
    return h(node, 'code', [u('text', collapse(node.value))]);
}

/**
 * Transform importance.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function strong(h, node) {
    return h(node, 'strong', all(h, node));
}

/**
 * Transform emphasis
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function emphasis(h, node) {
    return h(node, 'em', all(h, node));
}

/**
 * Transform deletions.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function strikethrough(h, node) {
    return h(node, 'del', all(h, node));
}

/**
 * Transform an inline break.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Array.<Node>} - HAST nodes.
 */
function hardBreak(h, node) {
    return [h(node, 'br'), u('text', '\n')];
}

/**
 * Transform a link.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function link(h, node) {
    var props = {href: normalize(node.url)};

    if (node.title != null) {
        props.title = node.title
    }

    return h(node, 'a', props, all(h, node));
}

/**
 * Transform an image.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function image(h, node) {
    var props = {
        src: normalize(node.url),
        alt: node.alt
    };

    if (node.title != null) {
        props.title = node.title
    }

    return h(node, 'img', props);
}

/**
 * Transform a reference to a footnote.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function footnoteReference(h, node) {
    var identifier = node.identifier;

    return h(node.position, 'sup', { id: 'fnref-' + identifier }, [
        h(node, 'a', {
            href: '#fn-' + identifier,
            className: ['footnote-ref']
        }, [u('text', identifier)])
    ]);
}

/**
 * Transform a reference to a link.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function linkReference(h, node) {
    var def = h.definition(node.identifier);
    var props = {
        href: normalize((def && def.url) || '')
    };

    if (def && def.title != null) {
        props.title = def.title;
    }

    return failsafe(h, node, def) || h(node, 'a', props, all(h, node));
}

/**
 * Transform a reference to an image.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST node.
 */
function imageReference(h, node) {
    var def = h.definition(node.identifier);
    var props = {
        src: normalize((def && def.url) || ''),
        alt: node.alt
    };

    if (def && def.title != null) {
        props.title = def.title;
    }

    return failsafe(h, node, def) || h(node, 'img', props);
}

/**
 * Transform text.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node} - HAST text node.
 */
function text(h, node) {
    return h.wrap(node, u('text', trimLines(node.value)));
}

/**
 * Return either a `raw` node, in dangerous mode, or
 * nothing.
 *
 * @param {Function} h - Hyperscript DSL.
 * @param {Node} node - Node to compile.
 * @return {Node|null} - Nothing.
 */
function html(h, node) {
    if (h.dangerous) {
        return h.wrap(node, u('raw', node.value));
    }

    return null;
}

/**
 * Return nothing for nodes which are ignored.
 *
 * @return {null} - Nothing.
 */
function ignore() {
    return null;
}

/* Handlers. */
handlers.root = root;
handlers.paragraph = paragraph;
handlers.blockquote = blockquote;
handlers.heading = heading;
handlers.code = code;
handlers.inlineCode = inlineCode;
handlers.yaml = ignore;
handlers.html = html;
handlers.list = list;
handlers.listItem = listItem;
handlers.table = table;
handlers.thematicBreak = thematicBreak;
handlers.break = hardBreak;
handlers.emphasis = emphasis;
handlers.strong = strong;
handlers.delete = strikethrough;
handlers.link = link;
handlers.image = image;
handlers.footnote = footnote;
handlers.linkReference = linkReference;
handlers.imageReference = imageReference;
handlers.footnoteReference = footnoteReference;
handlers.definition = ignore;
handlers.footnoteDefinition = ignore;
handlers.text = text;

/**
 * Factory to transform.
 *
 * @param {Node} tree - MDAST tree.
 * @param {Object?} options - Configuration.
 * @return {Function} - Hyperscript-like DSL.
 */
function factory(tree, options) {
    var dangerous = (options || {}).allowDangerousHTML;

    /**
     * Finalise the created of `right`, a HAST node, from
     * `left`, an MDAST node.
     *
     * @param {Node} left - MDAST node.
     * @param {Node} right - HAST node.
     */
    function wrap(left, right) {
        var data;
        var ctx;

        /* handle `data.hName`, `data.hProperties, `hChildren`. */
        if (left && 'data' in left) {
            data = left.data;

            if (right.type === 'element' && data.hName) {
                right.tagName = data.hName;
            }

            if (right.type === 'element' && data.hProperties) {
                right.properties = xtend(right.properties, data.hProperties);
            }

            if (right.children && data.hChildren) {
                right.children = data.hChildren;
            }
        }

        ctx = left && left.position ? left : {position: left};

        if (!position.generated(ctx)) {
            right.position = {
                start: position.start(ctx),
                end: position.end(ctx)
            };
        }

        return right;
    }

    /**
     * Create an element for a `node`.
     *
     * @param {Node} node - MDAST node to compile for.
     * @param {string} tagName - Proposed tag-name.
     * @param {Object?} [props={}] - Properties.
     * @param {Array.<Node>} children - HAST children.
     */
    function h(node, tagName, props, children) {
        if (
            children == null &&
            typeof props === 'object' &&
            'length' in props
        ) {
            children = props;
            props = {};
        }

        return wrap(node, {
            type: 'element',
            tagName: tagName,
            properties: props || {},
            children: children || []
        });
    }

    h.dangerous = dangerous;
    h.definition = definitions(tree);
    h.footnotes = [];
    h.wrap = wrap;

    visit(tree, 'footnoteDefinition', function (definition) {
        h.footnotes.push(definition);
    });

    return h;
}

/**
 * Transform `tree`, which is an MDAST node, to a HAST node.
 *
 * @param {Node} tree - MDAST Node.
 * @param {Object} [options] - Configuration.
 * @return {Node} - HAST Node.
 */
function toHAST(tree, options) {
    var h = factory(tree, options)
    var node = one(h, tree);
    var footnotes = generateFootnotes(h);

    if (node && node.children && footnotes) {
        node.children = node.children.concat(u('text', '\n'), footnotes);
    }

    return node;
}

/* Expose. */
module.exports = toHAST;
