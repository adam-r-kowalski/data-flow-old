import {
    Connection,
    Constraints,
    Entry,
    geometry,
    Geometry,
    layout,
    Layout,
    MeasureText,
    Offset,
    Size,
    traverse,
    UI,
    UIKind,
    WorldSpace,
    OnClick,
    OnDrag,
    OnDoubleClick,
} from "."
import { Matrix3x3 } from "../linear_algebra/matrix3x3"
import {
    CameraStack,
    popCamera,
    pushCamera,
    transformWorldSpace,
} from "./camera_stack"

export interface SceneLayout {
    readonly size: Size
    readonly children: Layout[]
}

export interface SceneGeometry {
    readonly worldSpace: WorldSpace
    readonly children: Geometry[]
}

export interface Scene {
    readonly id?: string
    readonly onClick?: OnClick
    readonly onDoubleClick?: OnDoubleClick
    readonly onDrag?: OnDrag
    readonly kind: UIKind.SCENE
    readonly camera: Matrix3x3
    readonly children: UI[]
    readonly connections: Connection[]
}

export interface Properties {
    readonly id?: string
    readonly onClick?: OnClick
    readonly camera: Matrix3x3
    readonly children: UI[]
    readonly connections?: Connection[]
}

export const scene = ({
    id,
    onClick,
    camera,
    children,
    connections,
}: Properties): Scene => ({
    id,
    onClick,
    kind: UIKind.SCENE,
    camera,
    children,
    connections: connections ?? [],
})

export const sceneLayout = (
    ui: Scene,
    constraints: Constraints,
    measureText: MeasureText
): SceneLayout => {
    const children = ui.children.map((c) => layout(c, constraints, measureText))
    const width = constraints.maxWidth
    const height = constraints.maxHeight
    return { size: { width, height }, children }
}

export const sceneGeometry = (
    ui: Scene,
    layout: SceneLayout,
    offset: Offset,
    cameraStack: CameraStack
): SceneGeometry => {
    const worldSpace = transformWorldSpace(cameraStack, {
        x0: offset.x,
        y0: offset.y,
        x1: offset.x + layout.size.width,
        y1: offset.y + layout.size.height,
    })
    pushCamera(cameraStack, ui.camera)
    const children = ui.children.map((c, i) =>
        geometry(c, layout.children[i], offset, cameraStack)
    )
    popCamera(cameraStack)
    return { worldSpace, children }
}

export function* sceneTraverse(
    ui: Scene,
    layout: SceneLayout,
    geometry: SceneGeometry,
    z: number
): Generator<Entry> {
    yield { ui, layout, geometry, z }
    let i = 0
    for (const child of ui.children) {
        for (const entry of traverse(
            child,
            layout.children[i],
            geometry.children[i],
            z
        )) {
            yield entry
            z = Math.max(z, entry.z)
        }
        i++
        z++
    }
}
