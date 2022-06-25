import { Geometry, Offset, Position } from "../geometry"
import { Constraints, Layout, Size } from "../layout"
import { Mat3 } from "../linear_algebra"
import { CameraStack, Entry, MeasureText, UI } from "../ui"

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
        readonly camera: Mat3,
        readonly textureIndex: number,
        readonly textureCoordinates: number[],
        readonly colors: number[],
        readonly vertices: number[],
        readonly vertexIndices: number[],
        readonly cameraIndex: number[],
        readonly children: Geometry[]
    ) { }
}

export const sceneGeometry = (position: Position, camera: Mat3, children: Geometry[]) =>
    new SceneGeometry(position, camera, 0, [], [], [], [], [], children)

export class Scene {
    constructor(
        readonly x: number,
        readonly y: number,
        readonly zoom: number,
        readonly children: UI[]
    ) { }

    layout(constraints: Constraints, measureText: MeasureText) {
        const children = this.children.map(c => c.layout(constraints, measureText))
        const width = constraints.maxWidth
        const height = constraints.maxHeight
        return sceneLayout({ width, height }, children)
    }

    geometry(layout: Layout, offset: Offset, { nextCameraIndex }: CameraStack) {
        const position = { x: offset.x, y: offset.y }
        const childrenLayout = (layout as SceneLayout).children
        const initialChildren: Geometry[] = []
        const initial = {
            children: initialChildren,
            cameraStack: {
                activeCameraIndex: nextCameraIndex,
                nextCameraIndex: nextCameraIndex + 1
            }
        }
        const result = this.children.reduce((acc, c, i) => {
            const { geometry, nextCameraIndex } = c.geometry(childrenLayout[i], offset, acc.cameraStack)
            acc.children.push(geometry)
            acc.cameraStack.nextCameraIndex = nextCameraIndex
            return acc
        }, initial)
        const camera = new Mat3([
            1, 0, this.x,
            0, 1, this.y,
            0, 0, 1
        ])
        return {
            geometry: sceneGeometry(position, camera, result.children),
            nextCameraIndex: result.cameraStack.nextCameraIndex
        }
    }

    *traverse(layout: Layout, geometry: Geometry, z: number): Generator<Entry> {
        const childrenLayout = (layout as SceneLayout).children
        const childrenGeometry = (geometry as SceneGeometry).children
        yield { ui: this, layout, geometry, z }
        let i = 0
        for (const child of this.children) {
            yield* child.traverse(childrenLayout[i], childrenGeometry[i], z)
            i++
        }
    }
}

interface Properties {
    x?: number
    y?: number
    zoom?: number
}

type Overload = {
    (children: UI[]): Scene
    (properties: Properties, children: UI[]): Scene
}

export const scene: Overload = (...args: any[]): Scene => {
    const [properties, children] = (() =>
        args[0] instanceof Array ? [{}, args[0]] : [args[0], args[1]]
    )()
    return new Scene(
        properties.x ?? 0,
        properties.y ?? 0,
        properties.zoom ?? 1,
        children
    )
}