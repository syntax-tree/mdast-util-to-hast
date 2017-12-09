# mdast-util-to-hast [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Transform [MDAST][] to [HAST][].

> **Note**: You probably want to use [remark-rehype][].

## Installation

[npm][]:

```bash
npm install mdast-util-to-hast
```

## Usage

Say we have the following `example.md`:

```markdown
## Hello **World**!
```

...and next to it, `example.js`:

```javascript
var inspect = require('unist-util-inspect');
var unified = require('unified');
var parse = require('remark-parse');
var vfile = require('to-vfile');
var toHAST = require('mdast-util-to-hast');

var tree = unified().use(parse).parse(vfile.readSync('example.md'));

console.log(inspect(toHAST(tree)));
```

Which when running with `node example` yields:

```txt
root[1] (1:1-2:1, 0-20)
└─ element[3] (1:1-1:20, 0-19) [tagName="h2"]
   ├─ text: "Hello " (1:4-1:10, 3-9)
   ├─ element[1] (1:10-1:19, 9-18) [tagName="strong"]
   │  └─ text: "World" (1:12-1:17, 11-16)
   └─ text: "!" (1:19-1:20, 18-19)
```

## API

### `toHAST(node[, options])`

Transform the given [MDAST][] tree to a [HAST][] tree.

##### Options

###### `options.allowDangerousHTML`

Whether to allow `html` nodes and inject them as raw HTML (`boolean`, default:
`false`).  Only do this when compiling later with `hast-util-to-html`.

###### `options.commonmark`

Set to `true` (default: `false`) to prefer the first when duplicate definitions
are found.  The default behaviour is to prefer the last duplicate definition.

###### `options.handlers`

Object mapping [MDAST nodes][mdast] to functions handling those elements.
Take a look at [`lib/handlers/`][handlers] for examples.

##### Returns

[`HASTNode`][hast].

##### Notes

*   `yaml` and `toml` nodes are ignored
*   [`html`][mdast-html] nodes are ignored if `allowDangerousHTML` is `false`
*   [`position`][unist-position]s are properly patched
*   Unknown nodes with `children` are transformed to `div` elements
*   Unknown nodes with `value` are transformed to `text` nodes
*   If `node.data.hName` is set, it’s used as the HAST element’s tag-name
*   If `node.data.hProperties` is set, it’s mixed into the HAST element’s
    properties
*   If `node.data.hChildren` is set, it’s used as the element’s HAST
    children

##### Examples

###### `hName`

`node.data.hName` in MDAST sets the tag-name of an element in HAST.
The following [MDAST][]:

```js
{
  type: 'strong',
  data: {hName: 'b'},
  children: [{type: 'text', value: 'Alpha'}]
}
```

Yields, in HAST:

```js
{
  type: 'element',
  tagName: 'b',
  properties: {},
  children: [{type: 'text', value: 'Alpha'}]
}
```

###### `hProperties`

`node.data.hProperties` in MDAST sets the properties of an element in HAST.
The following [MDAST][]:

```js
{
  type: 'image',
  src: 'circle.svg',
  alt: 'Big red circle on a black background',
  title: null
  data: {hProperties: {className: ['responsive']}}
}
```

Yields, in HAST:

```js
{
  type: 'element',
  tagName: 'img',
  properties: {
    src: 'circle.svg',
    alt: 'Big red circle on a black background',
    className: ['responsive']
  },
  children: []
}
```

###### `hChildren`

`node.data.hChildren` in MDAST sets the children of an element in HAST.
The following [MDAST][]:

```js
{
  type: 'code',
  lang: 'js',
  data: {
    hChildren: [
      {
        type: 'element',
        tagName: 'span',
        properties: {className: ['hljs-meta']},
        children: [{type: 'text', value: '"use strict"'}]
      },
      {type: 'text', value: ';'}
    ]
  },
  value: '"use strict";'
}
```

Yields, in HAST (**note**: the `pre` and `language-js` class are added
normal `mdast-util-to-hast` functionality):

```js
{
  type: 'element',
  tagName: 'pre',
  properties: {},
  children: [{
    type: 'element',
    tagName: 'code',
    properties: {className: ['language-js']},
    children: [
      {
        type: 'element',
        tagName: 'span',
        properties: {className: ['hljs-meta']},
        children: [{type: 'text', value: '"use strict"'}]
      },
      {type: 'text', value: ';'}
    ]
  }]
}
```

## Related

*   [`mdast-util-to-nlcst`](https://github.com/syntax-tree/mdast-util-to-nlcst)
    — Transform MDAST to NLCST
*   [`hast-util-sanitize`](https://github.com/syntax-tree/hast-util-sanitize)
    — Sanitize HAST nodes
*   [`hast-util-to-mdast`](https://github.com/syntax-tree/hast-util-to-mdast)
    — Transform HAST to MDAST
*   [`remark-rehype`](https://github.com/remarkjs/remark-rehype)
    — rehype support for remark
*   [`rehype-remark`](https://github.com/rehypejs/rehype-remark)
    — remark support for rehype

## Contribute

See [`contribute.md` in `syntax-tree/mdast`][contribute] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

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

[mdast-html]: https://github.com/syntax-tree/mdast#html

[unist-position]: https://github.com/syntax-tree/unist#location

[handlers]: lib/handlers

[remark-rehype]: https://github.com/remarkjs/remark-rehype

[contribute]: https://github.com/syntax-tree/mdast/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/mdast/blob/master/code-of-conduct.md
