import toHast = require('mdast-util-to-hast')

toHast({type: ''})
toHast({type: ''}, {allowDangerousHtml: true})
toHast(
  {type: ''},
  {
    handlers: {
      foo(h, node) {
        return h(node, 'p')
      }
    }
  }
)
toHast(
  {type: ''},
  {
    handlers: {
      foo(h, node) {
        return h(node, 'p', {foo: 'bar'})
      }
    }
  }
)
toHast(
  {type: ''},
  {
    handlers: {
      foo(h, node) {
        return h(node, 'p', {}, [{type: ''}])
      }
    }
  }
)
toHast(
  {type: ''},
  {
    unknownHandler(h, node) {
      return h(node, 'div')
    }
  }
)
toHast(
  {type: 'custom'},
  {
    passThrough: ['custom']
  }
)
