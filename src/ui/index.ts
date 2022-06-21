import { Geometry, Offset } from "../geometry";
import { Constraints, Layout } from "../layout";

export interface Entry {
    readonly ui: UI
    readonly layout: Layout
    readonly geometry: Geometry
    readonly z: number
}

export interface Font {
    readonly family: string
    readonly size: number
}

export type TextWidth = (font: Font, str: string) => number[]

export interface UI {
    layout: (constraints: Constraints, textWidth: TextWidth) => Layout
    geometry: (layout: Layout, offset: Offset) => Geometry
    traverse: (layout: Layout, geometry: Geometry, z: number) => Generator<Entry>
}