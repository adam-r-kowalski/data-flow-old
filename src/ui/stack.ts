import { Entry, MeasureText, UI } from "."
import { Geometry, Offset, Position } from "../geometry"
import { Constraints, Layout, Size } from "../layout"

export class StackLayout {
    constructor(
        readonly size: Size,
        readonly children: Layout[]
    ) { }
}

export const stackLayout = (size: Size, children: Layout[]) =>
    new StackLayout(size, children)

export class StackGeometry {
    constructor(
        readonly position: Position,
        readonly textureIndex: number,
        readonly textureCoordinates: number[],
        readonly colors: number[],
        readonly vertices: number[],
        readonly vertexIndices: number[],
        readonly children: Geometry[]
    ) { }
}

export const stackGeometry = (position: Position, children: Geometry[]) =>
    new StackGeometry(position, 0, [], [], [], [], children)

export class Stack {
    constructor(readonly children: UI[]) { }

    layout(constraints: Constraints, measureText: MeasureText) {
        const children = this.children.map(c => c.layout(constraints, measureText))
        const width = constraints.maxWidth
        const height = constraints.maxHeight
        return stackLayout({ width, height }, children)
    }

    geometry(layout: Layout, offset: Offset) {
        const stackLayout = (layout as StackLayout)
        const children = this.children.map((c, i) => c.geometry(stackLayout.children[i], offset))
        return stackGeometry({ x: offset.x, y: offset.y }, children)
    }

    *traverse(layout: Layout, geometry: Geometry, z: number): Generator<Entry> {
        const childrenLayout = (layout as StackLayout).children
        const childrenGeometry = (geometry as StackGeometry).children
        let i = 0
        for (const child of this.children) {
            yield* child.traverse(childrenLayout[i], childrenGeometry[i], z)
            i += 1
            z += 1
        }
    }
}

export const stack = (children: UI[]): Stack =>
    new Stack(children)