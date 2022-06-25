import { Color } from "../color"
import { Geometry, Offset, Position } from "../geometry"
import { Constraints, Layout, Size } from "../layout"
import { Padding, padding as paddingAll } from "../padding"
import { CameraStack, Entry, MeasureText, UI } from "../ui"

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
        readonly textureIndex: number,
        readonly textureCoordinates: number[],
        readonly colors: number[],
        readonly vertices: number[],
        readonly vertexIndices: number[],
        readonly cameraIndex: number[],
        readonly child?: Geometry
    ) { }
}

interface GeometryData {
    readonly position: Position
    readonly textureIndex?: number
    readonly textureCoordinates?: number[]
    readonly colors?: number[]
    readonly vertices?: number[]
    readonly vertexIndices?: number[]
    readonly cameraIndex?: number[]
}

export const containerGeometry = (data: GeometryData, child?: Geometry) => {
    const vertices = data.vertices ?? []
    return new ContainerGeometry(
        data.position,
        data.textureIndex ?? 0,
        data.textureCoordinates ?? Array.from<number>({ length: vertices.length }).fill(0),
        data.colors ?? [],
        vertices,
        data.vertexIndices ?? [],
        data.cameraIndex ?? [],
        child
    )
}

export class Container {
    constructor(
        readonly padding: Padding,
        readonly width?: number,
        readonly height?: number,
        readonly x?: number,
        readonly y?: number,
        readonly color?: Color,
        readonly child?: UI
    ) { }

    layout(constraints: Constraints, measureText: MeasureText) {
        const { left, top, right, bottom } = this.padding
        if (this.child) {
            const layout = this.child.layout(constraints, measureText)
            const width = layout.size.width + left + right
            const height = layout.size.height + top + bottom
            return containerLayout({ width, height }, layout)
        }
        const width = (() => {
            if (this.width) return this.width + left + right
            return constraints.maxWidth
        })()
        const height = (() => {
            if (this.height) return this.height + top + bottom
            return constraints.maxHeight
        })()
        return containerLayout({ width, height })
    }

    geometry(layout: Layout, offset: Offset, cameraStack: CameraStack) {
        const position = { x: offset.x + (this.x ?? 0), y: offset.y + (this.y ?? 0) }
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
                    cameraIndex: Array(4).fill(cameraStack.activeCameraIndex)
                }
            }
            return {
                position,
                vertices: [],
                colors: [],
                vertexIndices: [],
                cameraIndex: [],
            }
        })()
        if (this.child) {
            const childLayout = (layout as ContainerLayout).child!
            const childOffset = {
                x: offset.x + this.padding.left,
                y: offset.y + this.padding.top
            }
            const { geometry, nextCameraIndex } = this.child.geometry(childLayout, childOffset, cameraStack)
            return {
                geometry: containerGeometry(data, geometry),
                nextCameraIndex
            }
        }
        return {
            geometry: containerGeometry(data),
            nextCameraIndex: cameraStack.nextCameraIndex
        }
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
    readonly x?: number
    readonly y?: number
    readonly color?: Color
    readonly child?: UI
}

export const container = ({ padding, width, height, color, x, y }: Properties, child?: UI): Container =>
    new Container(
        padding ?? paddingAll(0),
        width,
        height,
        x,
        y,
        color,
        child
    )