export type Value = string | number | boolean | undefined

export type Column = Value[]

export type Columns = { [name: string]: Column }

export interface Table {
    name: string
    columns: Columns
}