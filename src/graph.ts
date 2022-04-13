export interface Vec2 {
  x: number
  y: number
}

export enum Kind {
  SOURCE,
  TRANSFORM
}

export interface Entity {
  kind: Kind
  index: number
}

export interface Edge {
  entity: Entity
  index: number
}

export interface Input {
  name: string
  translate: Vec2
  edge?: Edge
}

export interface Output {
  name: string
  translate: Vec2
  edges: Edge[]
}

export interface Source {
  name: string
  outputs: Output[]
  translate: Vec2
  scale: Vec2
}

export interface Transform {
  name: string
  inputs: Input[]
  outputs: Output[]
  translate: Vec2
  scale: Vec2
}

export interface Sink {
  name: string
  inputs: Input[]
  translate: Vec2
  scale: Vec2
}

export interface Graph {
  sources: Source[]
  transforms: Transform[]
  sinks: Sink[]
}
