import {
    Layout,
    Constraints,
    Geometry,
    Size,
    Offset,
    Children,
    Connections,
    WorldSpace,
    Camera,
    Translate,
} from "../components";
import { ECS, Entity } from "../ecs";
import { Layers } from "../layers";
import { Mat3 } from "../linear_algebra";
import { geometry as connectionGeometry } from './connection'

const layout = (self: Entity, constraints: Constraints) => {
    for (const child of self.get(Children)!.entities) {
        child.get(Layout)!.layout(child, constraints)
    }
    const size = new Size(constraints.maxWidth, constraints.maxHeight)
    self.set(constraints, size, new Offset(0, 0))
    return size
}

const geometry = (self: Entity, parentOffset: Offset, layers: Layers, z: number) => {
    const { x, y } = self.get(Camera)!.entity.get(Translate)!
    layers.pushAndSetActiveCamera(new Mat3([
        1, 0, x,
        0, 1, y,
        0, 0, 1
    ]))
    const { width, height } = self.get(Size)!
    const offset = parentOffset.add(self.get(Offset)!)
    for (const child of self.get(Children)!.entities) {
        child.get(Geometry)!.geometry(child, offset, layers, z)
    }
    connectionGeometry(self.get(Connections)!.entities, layers)
    self.set(new WorldSpace(offset.x, offset.y, width, height))
}

interface Properties {
    camera: Entity,
    children: Entity[],
    connections: Entity[],
}

export const scene = (ecs: ECS, properties: Properties) =>
    ecs.entity(
        new Layout(layout),
        new Geometry(geometry),
        new Children(properties.children),
        new Connections(properties.connections),
        new Camera(properties.camera),
    )