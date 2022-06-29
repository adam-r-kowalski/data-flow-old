import { CameraStack } from "../camera_stack"
import { Geometry, Offset, WorldSpace } from "../geometry"
import { Constraints, Layout, Size } from "../layout"
import { Mat3 } from "../linear_algebra"
import { Entry, MeasureText, UI } from "../ui"

export class SceneLayout {
    constructor(
        readonly size: Size,
        readonly children: Layout[]
    ) { }
}

export const sceneLayout = (size: Size, children: Layout[]) =>
    new SceneLayout(size, children)

export class SceneGeometry {
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

export const sceneGeometry = (worldSpace: WorldSpace, children: Geometry[]) =>
    new SceneGeometry(worldSpace, 0, [], [], [], [], [], children)

export class Scene {
    constructor(
        readonly camera: Mat3,
        readonly children: UI[]
    ) { }

    layout(constraints: Constraints, measureText: MeasureText) {
        const children = this.children.map(c => c.layout(constraints, measureText))
        const width = constraints.maxWidth
        const height = constraints.maxHeight
        return sceneLayout({ width, height }, children)
    }

    geometry(layout: Layout, offset: Offset, cameraStack: CameraStack) {
        const worldSpace = cameraStack.transformWorldSpace({
            x0: offset.x,
            y0: offset.y,
            x1: offset.x + layout.size.width,
            y1: offset.y + layout.size.height
        })
        const childrenLayout = (layout as SceneLayout).children
        cameraStack.pushCamera(this.camera)
        const children = this.children.map((c, i) => c.geometry(childrenLayout[i], offset, cameraStack))
        cameraStack.popCamera()
        return sceneGeometry(worldSpace, children)
    }

    *traverse(layout: Layout, geometry: Geometry, z: number): Generator<Entry> {
        const childrenLayout = (layout as SceneLayout).children
        const childrenGeometry = (geometry as SceneGeometry).children
        yield { ui: this, layout, geometry, z }
        let i = 0
        for (const child of this.children) {
            for (const entry of child.traverse(childrenLayout[i], childrenGeometry[i], z)) {
                yield entry
                z = Math.max(z, entry.z)
            }
            i++
            z++
        }
    }
}

interface Properties {
    camera: Mat3
}

export const scene = (properties: Properties, children: UI[]): Scene =>
    new Scene(properties.camera, children)