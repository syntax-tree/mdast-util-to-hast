import type {Data, Literal} from 'hast'
import type {State} from './lib/state.js'

// Expose types.
export type {Handler, Handlers, Options, State} from './lib/state.js'

// Expose JS API.
export {handlers as defaultHandlers} from './lib/handlers/index.js'
export {toHast} from './lib/index.js'

/**
 * Raw string of HTML embedded into HTML AST.
 */
export interface Raw extends Literal {
  /**
   * Node type of raw.
   */
  type: 'raw'

  /**
   * Data associated with the hast raw.
   */
  data?: RawData | undefined
}

/**
 * Info associated with hast raw nodes by the ecosystem.
 */
export interface RawData extends Data {}

// Register nodes in content.
declare module 'hast' {
  interface ElementContentMap {
    /**
     * Raw string of HTML embedded into HTML AST.
     */
    raw: Raw
  }

  interface RootContentMap {
    /**
     * Raw string of HTML embedded into HTML AST.
     */
    raw: Raw
  }
}
