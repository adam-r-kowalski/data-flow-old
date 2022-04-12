export enum Kind {
  TABLE,
}

export interface Entity {
  kind: Kind,
  index: number
}

export interface Tables {
  names: string[],
  columns: string[][],
}

export interface Graph {
  nodes: Entity[][],
  tables: Tables,
}
