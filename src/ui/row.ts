import { Entry, UI } from "."
import { Geometry, Offset, Position } from "../geometry"
import { Constraints, Layout, Size } from "../layout"

enum Alignment {
    START,
    CENTER,
    END
}

export class RowLayout {
    constructor(
        readonly size: Size,
        readonly children: Layout[]
    ) { }
}

export const rowLayout = (size: Size, children: Layout[]) =>
    new RowLayout(size, children)

export class RowGeometry {
    constructor(
        readonly position: Position,
        readonly vertices: number[],
        readonly colors: number[],
        readonly vertexIndices: number[],
        readonly children: Geometry[]
    ) { }
}

export const rowGeometry = (position: Position, children: Geometry[]) =>
    new RowGeometry(position, [], [], [], children)

export class Row {
    constructor(
        readonly crossAxisAlignment: Alignment,
        readonly children: UI[]
    ) { }

    layout(constraints: Constraints) {
        const initialChildren: Layout[] = []
        const initial = {
            children: initialChildren,
            width: 0,
            height: 0
        }
        const result = this.children.reduce((acc, child) => {
            const layout = child.layout(constraints)
            acc.children.push(layout)
            acc.width += layout.size.width
            acc.height = Math.max(acc.height, layout.size.height)
            return acc
        }, initial)
        const { children, width, height } = result
        return rowLayout({ width, height }, children)
    }

    geometry(layout: Layout, offset: Offset) {
        const rowLayout = (layout as RowLayout)
        const initialChildren: Geometry[] = []
        const initial = {
            children: initialChildren,
            x: offset.x,
        }
        const result = this.children.reduce((acc, child, i) => {
            const childLayout = rowLayout.children[i]
            const childOffset = { x: acc.x, y: offset.y }
            acc.children.push(child.geometry(childLayout, childOffset))
            acc.x += childLayout.size.width
            return acc
        }, initial)
        return rowGeometry({ x: offset.x, y: offset.y }, result.children)
    }

    *traverse(layout: Layout, geometry: Geometry, z: number): Generator<Entry> {
        const childrenLayout = (layout as RowLayout).children
        const childrenGeometry = (geometry as RowGeometry).children
        const nextZ = z + 1
        let i = 0
        for (const child of this.children) {
            yield* child.traverse(childrenLayout[i], childrenGeometry[i], nextZ)
            i += 1
        }
    }
}

interface Properties {
    readonly crossAxisAlignment?: Alignment
}

type Overload = {
    (children: UI[]): Row
    (properties: Properties, children: UI[]): Row
}

export const row: Overload = (...args: any[]): Row => {
    const [properties, children] = (() =>
        args[0] instanceof Array ? [{}, args[0]] : [args[0], args[1]]
    )()
    return new Row(properties.crossAxisAlignment ?? Alignment.START, children)
}