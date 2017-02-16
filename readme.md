# mdast-util-to-hast [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Transform [MDAST][] to [HAST][].

## Installation

[npm][]:

```bash
npm install mdast-util-to-hast
```

## Usage

```javascript
var inspect = require('unist-util-inspect');
var remark = require('remark');
var toHAST = require('mdast-util-to-hast');

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

###### `options.commonmark`

Set to `true` (default: `false`) to prefer the first when duplicate definitions
are found.  The default behaviour is to prefer the last duplicate definition.

###### `options.handlers`

Object mapping [MDAST nodes][mdast] to functions 
handling those elements.
Take a look at [`lib/handlers/`][handlers] for examples.

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

[travis-badge]: https://img.shields.io/travis/syntax-tree/mdast-util-to-hast.svg

[travis]: https://travis-ci.org/syntax-tree/mdast-util-to-hast

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-util-to-hast.svg

[codecov]: https://codecov.io/github/syntax-tree/mdast-util-to-hast

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[mdast]: https://github.com/syntax-tree/mdast

[hast]: https://github.com/syntax-tree/hast

[mdast-yaml]: https://github.com/syntax-tree/mdast#yaml

[mdast-html]: https://github.com/syntax-tree/mdast#html

[unist-position]: https://github.com/syntax-tree/unist#location

[hast-util-sanitize]: https://github.com/syntax-tree/hast-util-sanitize

[handlers]: lib/handlers
