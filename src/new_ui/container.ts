import { UI, Size, Layout, Constraints, MeasureText, UIKind, layout, Color, Offset, WorldSpace, Geometry, geometry, Entry, traverse, } from './'
import { CameraStack, transformWorldSpace, activeCamera } from './camera_stack'

export interface ContainerLayout {
    readonly size: Size
    readonly child?: Layout
}

export interface ContainerGeometry {
    readonly worldSpace: WorldSpace
    readonly vertices: number[]
    readonly colors: number[]
    readonly vertexIndices: number[]
    readonly cameraIndex: number[]
    readonly textureIndex: number
    readonly textureCoordinates: number[]
    readonly child?: Geometry
}

export interface Padding {
    readonly top: number
    readonly right: number
    readonly bottom: number
    readonly left: number
}

export interface Container<UIEvent> {
    readonly id?: string
    readonly onClick?: UIEvent
    readonly kind: UIKind.CONTAINER,
    readonly padding: Padding
    readonly width?: number
    readonly height?: number
    readonly x?: number
    readonly y?: number
    readonly color?: Color
    readonly child?: UI<UIEvent>
}

interface Properties<UIEvent> {
    readonly padding?: number
    readonly width?: number
    readonly height?: number
    readonly x?: number
    readonly y?: number
    readonly color?: Color
    readonly onClick?: UIEvent
    readonly id?: string
}

const transformPadding = (padding?: number): Padding => {
    if (padding) return { top: padding, right: padding, bottom: padding, left: padding }
    return { top: 0, right: 0, bottom: 0, left: 0 }
}

export const container = <UIEvent>({ padding, width, height, color, x, y, onClick, id }: Properties<UIEvent>, child?: UI<UIEvent>): Container<UIEvent> => {
    return {
        kind: UIKind.CONTAINER,
        padding: transformPadding(padding),
        width,
        height,
        x,
        y,
        color,
        onClick,
        id,
        child
    }
}

export const containerLayout = <UIEvent>(ui: Container<UIEvent>, constraints: Constraints, measureText: MeasureText): ContainerLayout => {
    const { top, right, bottom, left } = ui.padding
    if (ui.child) {
        const childLayout = layout(ui.child, constraints, measureText)
        const width = ui.width ?? childLayout.size.width + left + right
        const height = ui.height ?? childLayout.size.height + top + bottom
        return {
            size: { width, height },
            child: childLayout
        }
    }
    const width = (() => {
        if (ui.width) return ui.width + left + right
        return constraints.maxWidth
    })()
    const height = (() => {
        if (ui.height) return ui.height + top + bottom
        return constraints.maxHeight
    })()
    return { size: { width, height } }
}

export const containerGeometry = <UIEvent>(ui: Container<UIEvent>, layout: ContainerLayout, offset: Offset, cameraStack: CameraStack): ContainerGeometry => {
    const x0 = offset.x + (ui.x ?? 0)
    const x1 = x0 + layout.size.width
    const y0 = offset.y + (ui.y ?? 0)
    const y1 = y0 + layout.size.height
    const worldSpace = transformWorldSpace(cameraStack, { x0, x1, y0, y1 })
    const childGeometry = (() => {
        if (ui.child) {
            const childLayout = layout.child!
            const childOffset = {
                x: x0 + ui.padding.left,
                y: y0 + ui.padding.top
            }
            return geometry(ui.child, childLayout, childOffset, cameraStack)
        }
        return undefined
    })()
    if (ui.color) {
        const { red, green, blue, alpha } = ui.color
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
            cameraIndex: Array(4).fill(activeCamera(cameraStack)),
            textureIndex: 0,
            textureCoordinates: Array(8).fill(0),
            child: childGeometry
        }
    }
    return {
        worldSpace,
        vertices: [],
        colors: [],
        vertexIndices: [],
        cameraIndex: [],
        textureIndex: 0,
        textureCoordinates: [],
        child: childGeometry
    }
}

export function* containerTraverse<UIEvent>(ui: Container<UIEvent>, layout: ContainerLayout, geometry: ContainerGeometry, z: number): Generator<Entry<UIEvent>> {
    yield { ui, layout, geometry, z }
    if (ui.child) {
        const childLayout = layout.child!
        const childGeometry = geometry.child!
        yield* traverse(ui.child, childLayout, childGeometry, z + 1)
    }
}