import { Geometry, Offset } from "../geometry";
import { Constraints, Layout } from "../layout";

export interface UI {
    layout: (constraints: Constraints) => Layout
    geometry: (layout: Layout, offset: Offset) => Geometry
}