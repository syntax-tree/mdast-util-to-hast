import type {Literal} from 'hast'

// Expose types.
export type {Options, Handler, Handlers, H} from './lib/index.js'

// Expose JS API.
export {one, all} from './lib/traverse.js'
export {defaultHandlers, toHast} from './lib/index.js'

// Expose node type.
/**
 * Raw string of HTML embedded into HTML AST.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface Raw extends Literal {
  /**
   * Node type.
   */
  type: 'raw'
}

// Register nodes in content.
declare module 'hast' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface RootContentMap {
    /**
     * Raw string of HTML embedded into HTML AST.
     */
    raw: Raw
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ElementContentMap {
    /**
     * Raw string of HTML embedded into HTML AST.
     */
    raw: Raw
  }
}
