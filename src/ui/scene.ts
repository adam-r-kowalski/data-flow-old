import { Connection, Constraints, Entry, geometry, Geometry, layout, Layout, MeasureText, Offset, Size, traverse, UI, UIKind, WorldSpace } from "."
import { Matrix3x3 } from "../linear_algebra/matrix3x3"
import { CameraStack, popCamera, pushCamera, transformWorldSpace } from "./camera_stack"

export interface SceneLayout {
    readonly size: Size
    readonly children: Layout[]
}

export interface SceneGeometry {
    readonly worldSpace: WorldSpace
    readonly children: Geometry[]
}

export interface Scene<AppEvent> {
    readonly id?: string
    readonly onClick?: AppEvent
    readonly kind: UIKind.SCENE
    readonly camera: Matrix3x3
    readonly children: UI<AppEvent>[]
    readonly connections: Connection[]
}

export interface Properties<AppEvent> {
    readonly id?: string
    readonly onClick?: AppEvent
    readonly camera: Matrix3x3
    readonly children: UI<AppEvent>[]
    readonly connections?: Connection[]
}

export const scene = <AppEvent>({ id, onClick, camera, children, connections }: Properties<AppEvent>): Scene<AppEvent> => ({
    id, onClick, kind: UIKind.SCENE, camera, children, connections: connections ?? []
})

export const sceneLayout = <AppEvent>(ui: Scene<AppEvent>, constraints: Constraints, measureText: MeasureText): SceneLayout => {
    const children = ui.children.map(c => layout(c, constraints, measureText))
    const width = constraints.maxWidth
    const height = constraints.maxHeight
    return { size: { width, height }, children }
}

export const sceneGeometry = <AppEvent>(ui: Scene<AppEvent>, layout: SceneLayout, offset: Offset, cameraStack: CameraStack): SceneGeometry => {
    const worldSpace = transformWorldSpace(cameraStack, {
        x0: offset.x,
        y0: offset.y,
        x1: offset.x + layout.size.width,
        y1: offset.y + layout.size.height
    })
    pushCamera(cameraStack, ui.camera)
    const children = ui.children.map((c, i) => geometry(c, layout.children[i], offset, cameraStack))
    popCamera(cameraStack)
    return { worldSpace, children }
}

export function* sceneTraverse<AppEvent>(ui: Scene<AppEvent>, layout: SceneLayout, geometry: SceneGeometry, z: number): Generator<Entry<AppEvent>> {
    yield { ui, layout, geometry, z }
    let i = 0
    for (const child of ui.children) {
        for (const entry of traverse(child, layout.children[i], geometry.children[i], z)) {
            yield entry
            z = Math.max(z, entry.z)
        }
        i++
        z++
    }
}
