import { Geometry, Offset } from "../geometry";
import { Constraints, Layout } from "../layout";

export interface Entry {
    ui: UI
    layout: Layout
    geometry: Geometry
    z: number
}

export interface UI {
    layout: (constraints: Constraints) => Layout
    geometry: (layout: Layout, offset: Offset) => Geometry
    traverse: (layout: Layout, geometry: Geometry, z: number) => Generator<Entry>
}