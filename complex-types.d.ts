import type {Literal} from 'hast'

export type Raw = {
  type: 'raw'
} & Literal

/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare module 'hast' {
  interface RootContentMap {
    raw: Raw
  }

  interface ElementContentMap {
    raw: Raw
  }
}
/* eslint-enable @typescript-eslint/consistent-type-definitions */
