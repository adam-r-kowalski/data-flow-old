import { CameraStack } from "../camera_stack"
import { Color } from "../color"
import { Geometry, Offset, WorldSpace } from "../geometry"
import { Constraints, Layout, Size } from "../layout"
import { Padding, padding as paddingAll } from "../padding"
import { Entry, Id, MeasureText, OnClick, UI } from "../ui"

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
        readonly worldSpace: WorldSpace,
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
    readonly worldSpace: WorldSpace
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
        data.worldSpace,
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
        readonly onClick?: OnClick,
        readonly id?: Id,
        readonly child?: UI
    ) { }

    layout(constraints: Constraints, measureText: MeasureText) {
        const { left, top, right, bottom } = this.padding
        if (this.child) {
            const layout = this.child.layout(constraints, measureText)
            const width = this.width ?? layout.size.width + left + right
            const height = this.height ?? layout.size.height + top + bottom
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
        const x0 = offset.x + (this.x ?? 0)
        const x1 = x0 + layout.size.width
        const y0 = offset.y + (this.y ?? 0)
        const y1 = y0 + layout.size.height
        const worldSpace = cameraStack.transformWorldSpace({ x0, x1, y0, y1 })
        const data = (() => {
            if (this.color) {
                const { red, green, blue, alpha } = this.color
                return {
                    worldSpace,
                    vertices: [
                        x0, y0,
                        x0, y1,
                        x1, y0,
                        x1, y1,
                    ],
                    colors: [
                        red, green, blue, alpha,
                        red, green, blue, alpha,
                        red, green, blue, alpha,
                        red, green, blue, alpha,
                    ],
                    vertexIndices: [
                        0, 1, 2,
                        1, 2, 3
                    ],
                    cameraIndex: Array(4).fill(cameraStack.activeCamera())
                }
            }
            return {
                worldSpace,
                vertices: [],
                colors: [],
                vertexIndices: [],
                cameraIndex: [],
            }
        })()
        if (this.child) {
            const childLayout = (layout as ContainerLayout).child!
            const childOffset = {
                x: x0 + this.padding.left,
                y: y0 + this.padding.top
            }
            const childGeometry = this.child.geometry(childLayout, childOffset, cameraStack)
            return containerGeometry(data, childGeometry)
        }
        return containerGeometry(data)
    }

    * traverse(layout: Layout, geometry: Geometry, z: number): Generator<Entry> {
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
    readonly onClick?: OnClick
    readonly id?: Id
}

export const container = ({ padding, width, height, color, x, y, onClick, id }: Properties, child?: UI): Container =>
    new Container(
        padding ?? paddingAll(0),
        width,
        height,
        x,
        y,
        color,
        onClick,
        id,
        child
    )