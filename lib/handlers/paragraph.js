'use strict'

module.exports = paragraph

var all = require('../all')

/* Transform a paragraph. */
function paragraph(h, node, parent) {
  /* Paragraphs in a tight list are not wrapped in <p> tags */
  if (parent && parent.type === 'listItem' && !parent.loose) {
    return all(h, node)
  }

  return h(node, 'p', all(h, node))
}
