import {
    Layout,
    Constraints,
    Geometry,
    Size,
    Offset,
    Children,
} from "../components";
import { ECS, Entity } from "../ecs";
import { Layers } from "../layers";

const layout = (entity: Entity, constraints: Constraints) => {
    let width = 0
    let height = 0
    for (const child of entity.get(Children)!.entities) {
        const size = child.get(Layout)!.layout(child, constraints)
        child.update(Offset, offset => offset.x = width)
        width += size.width
        height = Math.max(height, size.height)
    }
    const size = new Size(width, height)
    entity.set(constraints, size, new Offset(0, 0))
    return size
}

const geometry = (entity: Entity, offset: Offset, layers: Layers, z: number) => {
    let baseOffset = offset.add(entity.get(Offset)!)
    for (const child of entity.get(Children)!.entities) {
        child.get(Geometry)!.geometry(child, baseOffset, layers, z)
    }
}

export const row = (ecs: ECS, children: Entity[]) =>
    ecs.entity(
        new Layout(layout),
        new Geometry(geometry),
        new Children(children)
    )