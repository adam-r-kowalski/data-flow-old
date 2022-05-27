import {
    Layout,
    Constraints,
    Geometry,
    Size,
    Child,
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
        child.update(Offset, offset => offset.y = height)
        height += size.height
        width = Math.max(width, size.width)
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

export const column = (ecs: ECS, children: Entity[]) =>
    ecs.entity(
        new Layout(layout),
        new Geometry(geometry),
        new Children(children)
    )