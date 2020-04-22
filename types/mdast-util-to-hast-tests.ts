import toHast = require('mdast-util-to-hast')

toHast({type: ''})
toHast({type: ''}, {allowDangerousHtml: true})
toHast({type: ''}, {commonmark: true})
toHast(
  {type: ''},
  {
    handlers: {
      foo(h, node) {
        return h(node)
      }
    }
  }
)
toHast(
  {type: ''},
  {
    unknownHandler(h, node) {
      return h(node)
    }
  }
)
