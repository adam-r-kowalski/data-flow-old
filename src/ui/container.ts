import { Color } from "../color"
import { Geometry, Offset, Position } from "../geometry"
import { Constraints, Layout, Size } from "../layout"
import { Padding, padding as paddingAll } from "../padding"
import { Entry, MeasureText, UI } from "../ui"

export class ContainerLayout {
    constructor(
        readonly size: Size,
        readonly child?: Layout
    ) { }
}

export const containerLayout = (size: Size, child?: Layout) =>
    new ContainerLayout(size, child)

export class ContainerGeometry {
    constructor(
        readonly position: Position,
        readonly vertices: number[],
        readonly colors: number[],
        readonly vertexIndices: number[],
        readonly child?: Geometry
    ) { }
}

export interface GeometryData {
    readonly position: Position
    readonly vertices?: number[]
    readonly colors?: number[]
    readonly vertexIndices?: number[]
}

export const containerGeometry = (data: GeometryData, child?: Geometry) =>
    new ContainerGeometry(
        data.position,
        data.vertices ?? [],
        data.colors ?? [],
        data.vertexIndices ?? [],
        child
    )

export class Container {
    constructor(
        readonly padding: Padding,
        readonly width?: number,
        readonly height?: number,
        readonly color?: Color,
        readonly child?: UI
    ) { }

    layout(constraints: Constraints, measureText: MeasureText) {
        if (this.child) {
            const layout = this.child.layout(constraints, measureText)
            const { left, top } = this.padding
            const width = layout.size.width + left + this.padding.right
            const height = layout.size.height + top + this.padding.bottom
            return containerLayout({ width, height }, layout)
        }
        const width = this.width ?? constraints.maxWidth
        const height = this.height ?? constraints.maxHeight
        return containerLayout({ width, height })
    }

    geometry(layout: Layout, offset: Offset) {
        const position = { x: offset.x, y: offset.y }
        const data = (() => {
            if (this.color) {
                const x0 = position.x
                const x1 = position.x + layout.size.width
                const y0 = position.y
                const y1 = position.y + layout.size.height
                const { r, g, b, a } = this.color.rgba()
                return {
                    position,
                    vertices: [
                        x0, y0,
                        x0, y1,
                        x1, y0,
                        x1, y1,
                    ],
                    colors: [
                        r, g, b, a,
                        r, g, b, a,
                        r, g, b, a,
                        r, g, b, a,
                    ],
                    vertexIndices: [
                        0, 1, 2,
                        1, 2, 3
                    ],
                }
            }
            return {
                position,
                vertices: [],
                colors: [],
                vertexIndices: [],
            }
        })()
        if (this.child) {
            const childLayout = (layout as ContainerLayout).child!
            const childOffset = {
                x: offset.x + this.padding.left,
                y: offset.y + this.padding.top
            }
            const childGeometry = this.child.geometry(childLayout, childOffset)
            return containerGeometry(data, childGeometry)
        }
        return containerGeometry(data)
    }

    *traverse(layout: Layout, geometry: Geometry, z: number): Generator<Entry> {
        yield { ui: this, layout, geometry, z }
        if (this.child) {
            const childLayout = (layout as ContainerLayout).child!
            const childGeometry = (geometry as ContainerGeometry).child!
            yield* this.child.traverse(childLayout, childGeometry, z + 1)
        }
    }
}

interface Properties {
    readonly padding?: Padding
    readonly width?: number
    readonly height?: number
    readonly color?: Color
    readonly child?: UI
}

export const container = ({ padding, width, height, color }: Properties, child?: UI): Container =>
    new Container(padding ?? paddingAll(0), width, height, color, child)