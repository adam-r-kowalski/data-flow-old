import { Geometry, Offset, Position } from "../geometry"
import { Constraints, Layout, Size } from "../layout"
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
        readonly position: Position,
        readonly textureIndex: number,
        readonly textureCoordinates: number[],
        readonly colors: number[],
        readonly vertices: number[],
        readonly vertexIndices: number[],
        readonly children: Geometry[]
    ) { }
}

export const sceneGeometry = (position: Position, children: Geometry[]) =>
    new SceneGeometry(position, 0, [], [], [], [], children)

export class Scene {
    constructor(readonly children: UI[]) { }

    layout(constraints: Constraints, measureText: MeasureText) {
        const children = this.children.map(c => c.layout(constraints, measureText))
        const width = constraints.maxWidth
        const height = constraints.maxHeight
        return sceneLayout({ width, height }, children)
    }

    geometry(layout: Layout, offset: Offset) {
        const position = { x: offset.x, y: offset.y }
        const childrenLayout = (layout as SceneLayout).children
        const children = this.children.map((c, i) => c.geometry(childrenLayout[i], offset))
        return sceneGeometry(position, children)
    }

    *traverse(layout: Layout, geometry: Geometry, z: number): Generator<Entry> {
        const childrenLayout = (layout as SceneLayout).children
        const childrenGeometry = (geometry as SceneGeometry).children
        let i = 0
        for (const child of this.children) {
            yield* child.traverse(childrenLayout[i], childrenGeometry[i], z)
            i++
        }
    }
}

export const scene = (children: UI[]): Scene =>
    new Scene(children)