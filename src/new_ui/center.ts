import { Constraints, Entry, Geometry, geometry, layout, Layout, MeasureText, Offset, Size, UI, UIKind, WorldSpace, traverse } from "."
import { CameraStack, transformWorldSpace } from "./camera_stack"

export interface CenterLayout {
    readonly size: Size
    readonly child: Layout
}

export interface CenterGeometry {
    readonly worldSpace: WorldSpace
    readonly vertices: number[]
    readonly colors: number[]
    readonly vertexIndices: number[]
    readonly cameraIndex: number[]
    readonly textureIndex: number
    readonly textureCoordinates: number[]
    readonly child: Geometry
}

export interface Center<UIEvent> {
    readonly kind: UIKind.CENTER
    readonly child: UI<UIEvent>
}

export const center = <UIEvent>(child: UI<UIEvent>): Center<UIEvent> => {
    return {
        kind: UIKind.CENTER,
        child
    }
}

export const centerLayout = <UIEvent>(ui: Center<UIEvent>, constraints: Constraints, measureText: MeasureText): CenterLayout => {
    const childLayout = layout(ui.child, constraints, measureText)
    const width = constraints.maxWidth
    const height = constraints.maxHeight
    return { size: { width, height }, child: childLayout }
}

export const centerGeometry = <UIEvent>(ui: Center<UIEvent>, layout: CenterLayout, offset: Offset, cameraStack: CameraStack): CenterGeometry => {
    const worldSpace = transformWorldSpace(cameraStack, {
        x0: offset.x,
        y0: offset.y,
        x1: offset.x + layout.size.width,
        y1: offset.y + layout.size.height,
    })
    const childLayout = layout.child
    const childOffset = {
        x: offset.x + layout.size.width / 2 - childLayout.size.width / 2,
        y: offset.y + layout.size.height / 2 - childLayout.size.height / 2
    }
    const childGeometry = geometry(ui.child, childLayout, childOffset, cameraStack)
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

export function* centerTraverse<UIEvent>(ui: Center<UIEvent>, layout: CenterLayout, geometry: CenterGeometry, z: number): Generator<Entry<UIEvent>> {
    yield* traverse(ui.child, layout.child, geometry.child, z + 1)
}