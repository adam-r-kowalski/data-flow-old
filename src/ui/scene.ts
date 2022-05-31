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
    for (const child of entity.get(Children)!.entities) {
        child.get(Layout)!.layout(child, constraints)
    }
    const size = new Size(constraints.maxWidth, constraints.maxHeight)
    entity.set(constraints, size, new Offset(0, 0))
    return size
}

const geometry = (entity: Entity, offset: Offset, layers: Layers, z: number) => {
    for (const child of entity.get(Children)!.entities) {
        child.get(Geometry)!.geometry(child, offset.add(entity.get(Offset)!), layers, z)
    }
}

interface Properties {
    children: Entity[]
}

export const scene = (ecs: ECS, properties: Properties) =>
    ecs.entity(
        new Layout(layout),
        new Geometry(geometry),
        new Children(properties.children)
    )