import { Entry, UI } from "."
import { CrossAxisAlignment } from "../alignment"
import { Geometry, Offset, Position } from "../geometry"
import { Constraints, Layout, Size } from "../layout"

export class ColumnLayout {
    constructor(
        readonly size: Size,
        readonly children: Layout[]
    ) { }
}

export const columnLayout = (size: Size, children: Layout[]) =>
    new ColumnLayout(size, children)

export class ColumnGeometry {
    constructor(
        readonly position: Position,
        readonly vertices: number[],
        readonly colors: number[],
        readonly vertexIndices: number[],
        readonly children: Geometry[]
    ) { }
}

export const columnGeometry = (position: Position, children: Geometry[]) =>
    new ColumnGeometry(position, [], [], [], children)

export class Column {
    constructor(
        readonly crossAxisAlignment: CrossAxisAlignment,
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
            acc.height += layout.size.height
            acc.width = Math.max(acc.width, layout.size.width)
            return acc
        }, initial)
        const { children, width, height } = result
        return columnLayout({ width, height }, children)
    }

    geometry(layout: Layout, offset: Offset) {
        const columnLayout = (layout as ColumnLayout)
        const initialChildren: Geometry[] = []
        const initial = {
            children: initialChildren,
            y: offset.y,
        }
        const offsetXStart = (_: Layout) => offset.x
        const offsetXCenter = (childLayout: Layout) => offset.x + layout.size.width / 2 - childLayout.size.width / 2
        const offsetXEnd = (childLayout: Layout) => offset.x + layout.size.width - childLayout.size.width
        const offsetX = (() => {
            switch (this.crossAxisAlignment) {
                case CrossAxisAlignment.START: return offsetXStart
                case CrossAxisAlignment.CENTER: return offsetXCenter
                case CrossAxisAlignment.END: return offsetXEnd
            }
        })()
        const result = this.children.reduce((acc, child, i) => {
            const childLayout = columnLayout.children[i]
            const childOffset = { x: offsetX(childLayout), y: acc.y }
            acc.children.push(child.geometry(childLayout, childOffset))
            acc.y += childLayout.size.height
            return acc
        }, initial)
        return columnGeometry({ x: offset.x, y: offset.y }, result.children)
    }

    *traverse(layout: Layout, geometry: Geometry, z: number): Generator<Entry> {
        const childrenLayout = (layout as ColumnLayout).children
        const childrenGeometry = (geometry as ColumnGeometry).children
        const nextZ = z + 1
        let i = 0
        for (const child of this.children) {
            yield* child.traverse(childrenLayout[i], childrenGeometry[i], nextZ)
            i += 1
        }
    }
}

interface Properties {
    readonly crossAxisAlignment?: CrossAxisAlignment
}

type Overload = {
    (children: UI[]): Column
    (properties: Properties, children: UI[]): Column
}

export const column: Overload = (...args: any[]): Column => {
    const [properties, children] = (() =>
        args[0] instanceof Array ? [{}, args[0]] : [args[0], args[1]]
    )()
    return new Column(properties.crossAxisAlignment ?? CrossAxisAlignment.START, children)
}