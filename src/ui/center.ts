import {
    Layout,
    Constraints,
    Geometry,
    Size,
    Child,
    Offset,
} from "../components";
import { ECS, Entity } from "../ecs";
import { Layers } from "../layers";

const layout = (entity: Entity, constraints: Constraints) => {
    const child = entity.get(Child)!.entity
    const childSize = child.get(Layout)!.layout(child, constraints)
    child.update(Offset, offset => {
        offset.x = constraints.maxWidth / 2 - childSize.width / 2
        offset.y = constraints.maxHeight / 2 - childSize.height / 2
    })
    const size = new Size(constraints.maxWidth, constraints.maxHeight)
    entity.set(constraints, size, new Offset(0, 0))
    return size
}

const geometry = (entity: Entity, offset: Offset, layers: Layers, z: number) => {
    const child = entity.get(Child)!.entity
    child.get(Geometry)!.geometry(child, offset.add(entity.get(Offset)!), layers, z)
}

export const center = (ecs: ECS, child: Entity) =>
    ecs.entity(
        new Layout(layout),
        new Geometry(geometry),
        new Child(child)
    )