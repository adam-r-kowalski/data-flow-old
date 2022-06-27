import { Entry, MeasureText, UI } from "."
import { CrossAxisAlignment, MainAxisAlignment } from "../alignment"
import { CameraStack } from "../camera_stack"
import { Geometry, Offset, WorldSpace } from "../geometry"
import { Constraints, Layout, Size } from "../layout"

export class RowLayout {
    constructor(
        readonly size: Size,
        readonly totalChildWidth: number,
        readonly children: Layout[]
    ) { }
}

export const rowLayout = (size: Size, totalChildWidth: number, children: Layout[]) =>
    new RowLayout(size, totalChildWidth, children)

export class RowGeometry {
    constructor(
        readonly worldSpace: WorldSpace,
        readonly textureIndex: number,
        readonly textureCoordinates: number[],
        readonly colors: number[],
        readonly vertices: number[],
        readonly vertexIndices: number[],
        readonly cameraIndex: number[],
        readonly children: Geometry[]
    ) { }
}

export const rowGeometry = (worldSpace: WorldSpace, children: Geometry[]) =>
    new RowGeometry(worldSpace, 0, [], [], [], [], [], children)

export class Row {
    constructor(
        readonly mainAxisAlignment: MainAxisAlignment,
        readonly crossAxisAlignment: CrossAxisAlignment,
        readonly children: UI[]
    ) { }

    layout(constraints: Constraints, measureText: MeasureText) {
        const initialChildren: Layout[] = []
        const initial = {
            children: initialChildren,
            totalChildWidth: 0,
            height: 0
        }
        const result = this.children.reduce((acc, child) => {
            const layout = child.layout(constraints, measureText)
            acc.children.push(layout)
            acc.totalChildWidth += layout.size.width
            acc.height = Math.max(acc.height, layout.size.height)
            return acc
        }, initial)
        const { children, totalChildWidth, height } = result
        const width = this.mainAxisAlignment == MainAxisAlignment.START ? totalChildWidth : constraints.maxWidth
        return rowLayout({ width, height }, totalChildWidth, children)
    }

    geometry(layout: Layout, offset: Offset, cameraStack: CameraStack) {
        const rowLayout = (layout as RowLayout)
        const initialChildren: Geometry[] = []
        const freeSpaceX = layout.size.width - rowLayout.totalChildWidth
        const initial = {
            children: initialChildren,
            x: (() => {
                switch (this.mainAxisAlignment) {
                    case MainAxisAlignment.START: return offset.x
                    case MainAxisAlignment.CENTER: return offset.x + freeSpaceX / 2
                    case MainAxisAlignment.END: return offset.x + freeSpaceX
                    case MainAxisAlignment.SPACE_EVENLY: return offset.x + freeSpaceX / (this.children.length + 1)
                    case MainAxisAlignment.SPACE_BETWEEN: return offset.x
                }
            })(),
        }
        const addXStart = (childLayout: Layout) => childLayout.size.width
        const addXCenter = (childLayout: Layout) => childLayout.size.width
        const addXEnd = (childLayout: Layout) => childLayout.size.width
        const addXSpaceEvenly = (childLayout: Layout) => childLayout.size.width + freeSpaceX / (this.children.length + 1)
        const addXSpaceBetween = (childLayout: Layout) => childLayout.size.width + freeSpaceX / (this.children.length - 1)
        const addX = (() => {
            switch (this.mainAxisAlignment) {
                case MainAxisAlignment.START: return addXStart
                case MainAxisAlignment.CENTER: return addXCenter
                case MainAxisAlignment.END: return addXEnd
                case MainAxisAlignment.SPACE_EVENLY: return addXSpaceEvenly
                case MainAxisAlignment.SPACE_BETWEEN: return addXSpaceBetween
            }
        })()
        const offsetYStart = (_: Layout) => offset.y
        const offsetYCenter = (childLayout: Layout) => offset.y + layout.size.height / 2 - childLayout.size.height / 2
        const offsetYEnd = (childLayout: Layout) => offset.y + layout.size.height - childLayout.size.height
        const offsetY = (() => {
            switch (this.crossAxisAlignment) {
                case CrossAxisAlignment.START: return offsetYStart
                case CrossAxisAlignment.CENTER: return offsetYCenter
                case CrossAxisAlignment.END: return offsetYEnd
            }
        })()
        const result = this.children.reduce((acc, child, i) => {
            const childLayout = rowLayout.children[i]
            const childOffset = { x: acc.x, y: offsetY(childLayout) }
            const childGeometry = child.geometry(childLayout, childOffset, cameraStack)
            acc.children.push(childGeometry)
            acc.x += addX(childLayout)
            return acc
        }, initial)
        const worldSpace = cameraStack.transformWorldSpace({
            x0: offset.x,
            y0: offset.y,
            x1: offset.x + layout.size.width,
            y1: offset.y + layout.size.height,
        })
        return rowGeometry(worldSpace, result.children)
    }

    *traverse(layout: Layout, geometry: Geometry, z: number): Generator<Entry> {
        const childrenLayout = (layout as RowLayout).children
        const childrenGeometry = (geometry as RowGeometry).children
        yield { ui: this, layout, geometry, z }
        const nextZ = z + 1
        let i = 0
        for (const child of this.children) {
            yield* child.traverse(childrenLayout[i], childrenGeometry[i], nextZ)
            i += 1
        }
    }
}

interface Properties {
    readonly mainAxisAlignment?: MainAxisAlignment
    readonly crossAxisAlignment?: CrossAxisAlignment
}

type Overload = {
    (children: UI[]): Row
    (properties: Properties, children: UI[]): Row
}

export const row: Overload = (...args: any[]): Row => {
    const [properties, children] = (() =>
        args[0] instanceof Array ? [{}, args[0]] : [args[0], args[1]]
    )()
    return new Row(
        properties.mainAxisAlignment ?? MainAxisAlignment.START,
        properties.crossAxisAlignment ?? CrossAxisAlignment.START,
        children
    )
}