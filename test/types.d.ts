import type {
  Data as DataHast,
  ElementContent as ElementContentHast,
  Literal as LiteralHast,
  Parent as ParentHast
} from 'hast'
import type {Data, Literal, Parent, PhrasingContent} from 'mdast'

interface Alpha extends Literal {
  type: 'alpha'
  data?: AlphaData | undefined
}

interface AlphaData extends Data {}

interface Bravo extends Parent {
  type: 'bravo'
  children: PhrasingContent[]
  data?: BravoData | undefined
}

interface BravoData extends Data {}

interface Toml extends Literal {
  type: 'toml'
  data?: TomlData | undefined
}

interface TomlData extends Data {}

interface AlphaHast extends LiteralHast {
  type: 'alpha'
  data?: AlphaDataHast | undefined
}

interface AlphaDataHast extends DataHast {}

interface BravoHast extends ParentHast {
  type: 'bravo'
  children: ElementContentHast[]
  data?: BravoDataHast | undefined
}

interface BravoDataHast extends DataHast {}

declare module 'hast' {
  interface ElementContentMap {
    alpha: AlphaHast
    bravo: BravoHast
  }

  interface RootContentMap {
    alpha: AlphaHast
    bravo: BravoHast
  }
}

declare module 'mdast' {
  interface FrontmatterContentMap {
    toml: Toml
  }

  interface PhrasingContentMap {
    alpha: Alpha
    bravo: Bravo
  }

  interface RootContentMap {
    alpha: Alpha
    bravo: Bravo
    toml: Toml
  }
}
