import {
    Constraints,
    Geometry,
    layout,
    Layout,
    MeasureText,
    Offset,
    Size,
    UI,
    UIKind,
    WorldSpace,
    geometry,
    Entry,
    traverse,
    OnClick,
    OnDrag,
} from "."
import { CameraStack, transformWorldSpace } from "./camera_stack"

export interface StackLayout {
    readonly size: Size
    readonly children: Layout[]
}

export interface StackGeometry {
    readonly worldSpace: WorldSpace
    readonly children: Geometry[]
}

export interface Stack {
    readonly id?: string
    readonly onClick?: OnClick
    readonly onDrag?: OnDrag
    kind: UIKind.STACK
    children: UI[]
}

export const stack = (children: UI[]): Stack => ({
    kind: UIKind.STACK,
    children,
})

export const stackLayout = (
    ui: Stack,
    constraints: Constraints,
    measureText: MeasureText
): StackLayout => {
    const children = ui.children.map((c) => layout(c, constraints, measureText))
    const width = constraints.maxWidth
    const height = constraints.maxHeight
    return { size: { width, height }, children }
}

export const stackGeometry = (
    ui: Stack,
    layout: StackLayout,
    offset: Offset,
    cameraStack: CameraStack
): StackGeometry => {
    const children = ui.children.map((c, i) =>
        geometry(c, layout.children[i], offset, cameraStack)
    )
    const worldSpace = transformWorldSpace(cameraStack, {
        x0: offset.x,
        y0: offset.y,
        x1: offset.x + layout.size.width,
        y1: offset.y + layout.size.height,
    })
    return { worldSpace, children }
}

export function* stackTraverse(
    ui: Stack,
    layout: StackLayout,
    geometry: StackGeometry,
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
        i += 1
        z += 1
    }
}
