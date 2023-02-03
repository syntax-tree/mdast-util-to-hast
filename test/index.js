import assert from 'node:assert/strict'
import test from 'node:test'

/* eslint-disable import/no-unassigned-import */
import './core.js'
import './blockquote.js'
import './break.js'
import './code.js'
import './definition.js'
import './delete.js'
import './emphasis.js'
import './footnote-definition.js'
import './footnote-reference.js'
import './footnote-mixed.js'
import './footnote.js'
import './heading.js'
import './html.js'
import './image-reference.js'
import './image.js'
import './inline-code.js'
import './link-reference.js'
import './link.js'
import './list-item.js'
import './list.js'
import './paragraph.js'
import './root.js'
import './strong.js'
import './table.js'
import './text.js'
import './thematic-break.js'
import './toml.js'
import './yaml.js'
import './handlers-option.js'
/* eslint-enable import/no-unassigned-import */

import * as mod from '../index.js'

test('core', () => {
  assert.deepEqual(
    Object.keys(mod).sort(),
    ['all', 'defaultHandlers', 'one', 'toHast'],
    'should expose the public api'
  )
})
