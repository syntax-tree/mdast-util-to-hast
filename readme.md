# mdast-util-to-hast [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Transform [MDAST][] to [HAST][].

## Installation

[npm][npm-install]:

```bash
npm install mdast-util-to-hast
```

## Usage

Dependencies:

```javascript
var inspect = require('unist-util-inspect');
var remark = require('remark');
var toHAST = require('mdast-util-to-hast');
```

Transform:

```javascript
var hast = toHAST(remark().parse('## Hello **World**!'));
console.log(inspect(hast));
```

Yields:

```txt
root[1] (1:1-1:20, 0-19)
└─ element[3] (1:1-1:20, 0-19) [tagName="h2"]
   ├─ text: "Hello " (1:4-1:10, 3-9)
   ├─ element[1] (1:10-1:19, 9-18) [tagName="strong"]
   │  └─ text: "World" (1:12-1:17, 11-16)
   └─ text: "!" (1:19-1:20, 18-19)
```

## API

### `toHAST(node[, options])`

Transform the given [MDAST][] tree to a [HAST][] tree.

###### `options.allowDangerousHTML`

Whether to allow `html` nodes and inject them as raw HTML (`boolean`,
default: `false`).  Only do this when compiling later with
`hast-util-to-html`.

###### `options.customHandlers`

It allows to define customized node handlers.
You can customize how to transform a MDAST node to a HAST node for
each type of node.

Below is an example to add some properties to `text` node.

```javascript
var trimLines = require('trim-lines');
var u = require('unist-builder');

var handlers = {};
handlers.text = function(h, node) {
  var value = trimLines(node.value);

  if (node.className) {
    return h.augment(node, u('span', {className: node.className}, [u('text', value)]));
  }

  return h.augment(node, u('text', value));
};

var hast = toHAST(node, {customHandlers: handlers});
```

To see default node handlers, please see [lib/handlers](lib/handlers).

###### Returns

[`HASTNode`][hast].

###### Note

*   [`yaml`][mdast-yaml] and [`html`][mdast-html] nodes are ignored;
*   [`position`][unist-position]s are properly patched;
*   Unknown nodes with `children` are transformed to `div` elements;
*   Unknown nodes with `value` are transformed to `text` nodes;
*   If `node.data.hName` is set, it’s used as the HAST element’s tag-name;
*   If `node.data.hProperties` is set, it’s mixed into the HAST element’s
    properties;
*   If `node.data.hChildren` is set, it’s used as the element’s HAST
    children;

## Related

*   [`hast-util-sanitize`][hast-util-sanitize]

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/mdast-util-to-hast.svg

[travis]: https://travis-ci.org/wooorm/mdast-util-to-hast

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/mdast-util-to-hast.svg

[codecov]: https://codecov.io/github/wooorm/mdast-util-to-hast

[npm-install]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[mdast]: https://github.com/wooorm/mdast

[hast]: https://github.com/wooorm/hast

[mdast-yaml]: https://github.com/wooorm/mdast#yaml

[mdast-html]: https://github.com/wooorm/mdast#html

[unist-position]: https://github.com/wooorm/unist#location

[hast-util-sanitize]: https://github.com/wooorm/hast-util-sanitize
