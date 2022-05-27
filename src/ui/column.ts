import {
    Layout,
    Constraints,
    Geometry,
    Size,
    Child,
    Offset,
    Children,
    Alignment,
    CrossAxisAlignment,
} from "../components";
import { ECS, Entity } from "../ecs";
import { Layers } from "../layers";

const layout = (entity: Entity, constraints: Constraints) => {
    let width = 0
    let height = 0
    const children = entity.get(Children)!.entities
    for (const child of children) {
        const size = child.get(Layout)!.layout(child, constraints)
        child.update(Offset, offset => offset.y = height)
        height += size.height
        width = Math.max(width, size.width)
    }
    if (entity.get(CrossAxisAlignment)!.alignment == Alignment.CENTER) {
        for (const child of children) {
            child.update(Offset, offset => offset.x = width / 2 - child.get(Size)!.width / 2)
        }
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


interface Properties {
    crossAxisAlignment?: Alignment
}

type Overload = {
    (ecs: ECS, children: Entity[]): Entity
    (ecs: ECS, properties: Properties, children: Entity[]): Entity
}

export const column: Overload = (ecs: ECS, ...args: any[]): Entity => {
    const [properties, children] = (() => {
        if (args[0] instanceof Array<Entity>) return [{}, args[0]]
        return [args[0], args[1]]
    })()
    return ecs.entity(
        new Layout(layout),
        new Geometry(geometry),
        new Children(children),
        new CrossAxisAlignment(properties.crossAxisAlignment ?? Alignment.START)
    )
}