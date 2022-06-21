import { Geometry, Offset, Position } from "../geometry"
import { Constraints, Layout, Size } from "../layout"
import { Entry, TextWidth, UI } from "../ui"

export class CenterLayout {
    constructor(
        readonly size: Size,
        readonly child: Layout
    ) { }
}

export const centerLayout = (size: Size, child: Layout) =>
    new CenterLayout(size, child)

export class CenterGeometry {
    constructor(
        readonly position: Position,
        readonly vertices: number[],
        readonly colors: number[],
        readonly vertexIndices: number[],
        readonly child: Geometry
    ) { }
}

export const centerGeometry = (position: Position, child: Geometry) =>
    new CenterGeometry(position, [], [], [], child)

export class Center {
    constructor(readonly child: UI) { }

    layout(constraints: Constraints, textWidth: TextWidth) {
        const layout = this.child.layout(constraints, textWidth)
        const width = constraints.maxWidth
        const height = constraints.maxHeight
        return centerLayout({ width, height }, layout)
    }

    geometry(layout: Layout, offset: Offset) {
        const position = { x: offset.x, y: offset.y }
        const childLayout = (layout as CenterLayout).child
        const childOffset = {
            x: offset.x + layout.size.width / 2 - childLayout.size.width / 2,
            y: offset.y + layout.size.height / 2 - childLayout.size.height / 2
        }
        const childGeometry = this.child.geometry(childLayout, childOffset)
        return centerGeometry(position, childGeometry)
    }

    *traverse(layout: Layout, geometry: Geometry, z: number): Generator<Entry> {
        const childLayout = (layout as CenterLayout).child
        const childGeometry = (geometry as CenterGeometry).child
        yield* this.child.traverse(childLayout, childGeometry, z + 1)
    }
}

export const center = (child: UI): Center =>
    new Center(child)