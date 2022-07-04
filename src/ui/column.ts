import { Entry, MeasureText, UI } from "."
import { CrossAxisAlignment, MainAxisAlignment } from "../alignment"
import { CameraStack } from "../camera_stack"
import { Geometry, Offset, WorldSpace } from "../geometry"
import { Constraints, Layout, Size } from "../layout"

export class ColumnLayout {
    constructor(
        readonly size: Size,
        readonly totalChildHeight: number,
        readonly children: Layout[]
    ) { }
}

export const columnLayout = (size: Size, totalChildHeight: number, children: Layout[]) =>
    new ColumnLayout(size, totalChildHeight, children)

export class ColumnGeometry {
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

export const columnGeometry = (worldSpace: WorldSpace, children: Geometry[]) =>
    new ColumnGeometry(worldSpace, 0, [], [], [], [], [], children)

export class Column {
    constructor(
        readonly mainAxisAlignment: MainAxisAlignment,
        readonly crossAxisAlignment: CrossAxisAlignment,
        readonly children: UI[]
    ) { }

    layout(constraints: Constraints, measureText: MeasureText) {
        const initialChildren: Layout[] = []
        const initial = {
            children: initialChildren,
            width: 0,
            totalChildHeight: 0
        }
        const result = this.children.reduce((acc, child) => {
            const layout = child.layout(constraints, measureText)
            acc.children.push(layout)
            acc.totalChildHeight += layout.size.height
            acc.width = Math.max(acc.width, layout.size.width)
            return acc
        }, initial)
        const { children, width, totalChildHeight } = result
        const height = this.mainAxisAlignment == MainAxisAlignment.START ? totalChildHeight : constraints.maxHeight
        return columnLayout({ width, height }, totalChildHeight, children)
    }

    geometry(layout: Layout, offset: Offset, cameraStack: CameraStack) {
        const columnLayout = (layout as ColumnLayout)
        const initialChildren: Geometry[] = []
        const freeSpaceY = layout.size.height - columnLayout.totalChildHeight
        const initial = {
            children: initialChildren,
            y: (() => {
                switch (this.mainAxisAlignment) {
                    case MainAxisAlignment.START: return offset.y
                    case MainAxisAlignment.CENTER: return offset.y + freeSpaceY / 2
                    case MainAxisAlignment.END: return offset.y + freeSpaceY
                    case MainAxisAlignment.SPACE_EVENLY: return offset.y + freeSpaceY / (this.children.length + 1)
                    case MainAxisAlignment.SPACE_BETWEEN: return offset.y
                }
            })(),
        }
        const addYStart = (childLayout: Layout) => childLayout.size.height
        const addYCenter = (childLayout: Layout) => childLayout.size.height
        const addYEnd = (childLayout: Layout) => childLayout.size.height
        const addYSpaceEvenly = (childLayout: Layout) => childLayout.size.height + freeSpaceY / (this.children.length + 1)
        const addYSpaceBetween = (childLayout: Layout) => childLayout.size.height + freeSpaceY / (this.children.length - 1)
        const addY = (() => {
            switch (this.mainAxisAlignment) {
                case MainAxisAlignment.START: return addYStart
                case MainAxisAlignment.CENTER: return addYCenter
                case MainAxisAlignment.END: return addYEnd
                case MainAxisAlignment.SPACE_EVENLY: return addYSpaceEvenly
                case MainAxisAlignment.SPACE_BETWEEN: return addYSpaceBetween
            }
        })()
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
            const childGeometry = child.geometry(childLayout, childOffset, cameraStack)
            acc.children.push(childGeometry)
            acc.y += addY(childLayout)
            return acc
        }, initial)
        const worldSpace = cameraStack.transformWorldSpace({
            x0: offset.x,
            y0: offset.y,
            x1: offset.x + layout.size.width,
            y1: offset.y + layout.size.height
        })
        return columnGeometry(worldSpace, result.children)
    }

    *traverse(layout: Layout, geometry: Geometry, z: number): Generator<Entry> {
        const childrenLayout = (layout as ColumnLayout).children
        const childrenGeometry = (geometry as ColumnGeometry).children
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
    (children: UI[]): Column
    (properties: Properties, children: UI[]): Column
}

export const column: Overload = (...args: any[]): Column => {
    const [properties, children] = (() =>
        args[0] instanceof Array ? [{}, args[0]] : [args[0], args[1]]
    )()
    return new Column(
        properties.mainAxisAlignment ?? MainAxisAlignment.START,
        properties.crossAxisAlignment ?? CrossAxisAlignment.START,
        children
    )
}