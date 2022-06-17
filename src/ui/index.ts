import { Geometry, Offset } from "../geometry";
import { Constraints, Layout } from "../layout";

export interface Entry {
    readonly ui: UI
    readonly layout: Layout
    readonly geometry: Geometry
    readonly z: number
}

export interface UI {
    layout: (constraints: Constraints) => Layout
    geometry: (layout: Layout, offset: Offset) => Geometry
    traverse: (layout: Layout, geometry: Geometry, z: number) => Generator<Entry>
}