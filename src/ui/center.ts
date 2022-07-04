import { CameraStack } from "../camera_stack"
import { Geometry, Offset, WorldSpace } from "../geometry"
import { Constraints, Layout, Size } from "../layout"
import { Entry, MeasureText, UI } from "../ui"

export class CenterLayout {
    constructor(
        readonly size: Size,
        readonly child: Layout
    ) { }
}

export const centerLayout = (size: Size, child: Layout) =>
    new CenterLayout(size, child)

export class CenterGeometry {
    constructor(
        readonly worldSpace: WorldSpace,
        readonly textureIndex: number,
        readonly textureCoordinates: number[],
        readonly colors: number[],
        readonly vertices: number[],
        readonly vertexIndices: number[],
        readonly cameraIndex: number[],
        readonly child: Geometry
    ) { }
}

export const centerGeometry = (worldSpace: WorldSpace, child: Geometry) =>
    new CenterGeometry(worldSpace, 0, [], [], [], [], [], child)

export class Center {
    constructor(readonly child: UI) { }

    layout(constraints: Constraints, measureText: MeasureText) {
        const layout = this.child.layout(constraints, measureText)
        const width = constraints.maxWidth
        const height = constraints.maxHeight
        return centerLayout({ width, height }, layout)
    }

    geometry(layout: Layout, offset: Offset, cameraStack: CameraStack) {
        const worldSpace = cameraStack.transformWorldSpace({
            x0: offset.x,
            y0: offset.y,
            x1: offset.x + layout.size.width,
            y1: offset.y + layout.size.height,
        })
        const childLayout = (layout as CenterLayout).child
        const childOffset = {
            x: offset.x + layout.size.width / 2 - childLayout.size.width / 2,
            y: offset.y + layout.size.height / 2 - childLayout.size.height / 2
        }
        const childGeometry = this.child.geometry(childLayout, childOffset, cameraStack)
        return centerGeometry(worldSpace, childGeometry)
    }

    *traverse(layout: Layout, geometry: Geometry, z: number): Generator<Entry> {
        const childLayout = (layout as CenterLayout).child
        const childGeometry = (geometry as CenterGeometry).child
        yield { ui: this, layout, geometry, z }
        yield* this.child.traverse(childLayout, childGeometry, z + 1)
    }
}

export const center = (child: UI): Center =>
    new Center(child)