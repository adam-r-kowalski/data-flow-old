import { Constraints, Layout } from "./layout";

export interface UI {
    layout: (constraints: Constraints) => Layout
}