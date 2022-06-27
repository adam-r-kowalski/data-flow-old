import { Entry, MeasureText, UI } from "."
import { CameraStack } from "../camera_stack"
import { Geometry, Offset, WorldSpace } from "../geometry"
import { Constraints, Layout, Size } from "../layout"

export class StackLayout {
    constructor(
        readonly size: Size,
        readonly children: Layout[]
    ) { }
}

export const stackLayout = (size: Size, children: Layout[]) =>
    new StackLayout(size, children)

export class StackGeometry {
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

export const stackGeometry = (worldSpace: WorldSpace, children: Geometry[]) =>
    new StackGeometry(worldSpace, 0, [], [], [], [], [], children)

export class Stack {
    constructor(readonly children: UI[]) { }

    layout(constraints: Constraints, measureText: MeasureText) {
        const children = this.children.map(c => c.layout(constraints, measureText))
        const width = constraints.maxWidth
        const height = constraints.maxHeight
        return stackLayout({ width, height }, children)
    }

    geometry(layout: Layout, offset: Offset, cameraStack: CameraStack) {
        const stackLayout = (layout as StackLayout)
        const children = this.children.map((c, i) => c.geometry(stackLayout.children[i], offset, cameraStack))
        const worldSpace = cameraStack.transformWorldSpace({
            x0: offset.x,
            y0: offset.y,
            x1: offset.x + layout.size.width,
            y1: offset.y + layout.size.height,
        })
        return stackGeometry(worldSpace, children)
    }

    *traverse(layout: Layout, geometry: Geometry, z: number): Generator<Entry> {
        const childrenLayout = (layout as StackLayout).children
        const childrenGeometry = (geometry as StackGeometry).children
        yield { ui: this, layout, geometry, z }
        let i = 0
        for (const child of this.children) {
            yield* child.traverse(childrenLayout[i], childrenGeometry[i], z)
            i += 1
            z += 1
        }
    }
}

export const stack = (children: UI[]): Stack =>
    new Stack(children)