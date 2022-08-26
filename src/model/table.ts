export type Value = string | number | boolean | undefined

export type Column = Value[]

export type Table = { [name: string]: Column }