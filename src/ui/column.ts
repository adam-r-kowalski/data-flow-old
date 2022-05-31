import {
    Layout,
    Constraints,
    Geometry,
    Size,
    Offset,
    Children,
    Alignment,
    CrossAxisAlignment,
    WorldSpace,
} from "../components";
import { ECS, Entity } from "../ecs";
import { Layers } from "../layers";

const layout = (self: Entity, constraints: Constraints) => {
    let width = 0
    let height = 0
    const children = self.get(Children)!.entities
    for (const child of children) {
        const size = child.get(Layout)!.layout(child, constraints)
        child.update(Offset, offset => offset.y = height)
        height += size.height
        width = Math.max(width, size.width)
    }
    switch (self.get(CrossAxisAlignment)!.alignment) {
        case Alignment.START:
            break
        case Alignment.CENTER:
            for (const child of children) {
                const childWidth = child.get(Size)!.width
                child.update(Offset, offset => offset.x = width / 2 - childWidth / 2)
            }
            break
        case Alignment.END:
            for (const child of children) {
                const childWidth = child.get(Size)!.width
                child.update(Offset, offset => offset.x = width - childWidth)
            }
            break
    }
    const size = new Size(width, height)
    self.set(constraints, size, new Offset(0, 0))
    return size
}

const geometry = (self: Entity, parentOffset: Offset, layers: Layers, z: number) => {
    const { width, height } = self.get(Size)!
    const offset = parentOffset.add(self.get(Offset)!)
    for (const child of self.get(Children)!.entities) {
        child.get(Geometry)!.geometry(child, offset, layers, z)
    }
    self.set(new WorldSpace(offset.x, offset.y, width, height))
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
        if (args[0] instanceof Array) return [{}, args[0]]
        return [args[0], args[1]]
    })()
    return ecs.entity(
        new Layout(layout),
        new Geometry(geometry),
        new Children(children),
        new CrossAxisAlignment(properties.crossAxisAlignment ?? Alignment.START)
    )
}