import { Geometry, Offset } from "../geometry";
import { Constraints, Layout, Size } from "../layout";

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

export type MeasureText = (font: Font, str: string) => Size

export interface UI {
    layout: (constraints: Constraints, measureText: MeasureText) => Layout
    geometry: (layout: Layout, offset: Offset) => Geometry
    traverse: (layout: Layout, geometry: Geometry, z: number) => Generator<Entry>
}