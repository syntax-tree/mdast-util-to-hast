'use strict'

module.exports = failsafe

var u = require('unist-builder')
var all = require('./all')

/* Return the content of a reference without definition
 * as markdown. */
function failsafe(h, node, definition) {
  var subtype = node.referenceType

  if (!definition) {
    if (node.type === 'imageReference') {
      if (subtype === 'collapsed') {
        return u('text', '![' + node.alt + '][]')
      } else if (subtype === 'full') {
        return u('text', '![' + node.alt + '][' + node.identifier + ']')
      } else {
        return u('text', '![' + node.alt + ']')
      }
    }

    if (subtype === 'collapsed') {
      return [u('text', '[')].concat(all(h, node), u('text', '][]'))
    } else if (subtype === 'full') {
      return [u('text', '[')].concat(all(h, node), 
        u('text', '][' + node.identifier + ']'))
    } else {
      return [u('text', '[')].concat(all(h, node), u('text', ']'))
    }
  }
}
