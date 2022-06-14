import {
    Layout,
    Constraints,
    Geometry,
    Size,
    Offset,
    Children,
    WorldSpace,
} from "../components";
import { ECS, Entity } from "../ecs";
import { Layers } from "../layers";


const layout = (self: Entity, constraints: Constraints) => {
    const children = self.get(Children)!.entities
    for (const child of children) {
        child.get(Layout)!.layout(child, constraints)
    }
    const size = new Size(constraints.maxWidth, constraints.maxHeight)
    self.set(constraints, size, new Offset(0, 0))
    return size
}


const geometry = (self: Entity, parentOffset: Offset, layers: Layers, z: number) => {
    const { width, height } = self.get(Size)!
    const offset = parentOffset.add(self.get(Offset)!)
    for (const child of self.get(Children)!.entities) {
        child.get(Geometry)!.geometry(child, offset, layers, z)
        z += 1
    }
    self.set(new WorldSpace(offset.x, offset.y, width, height))
}


export const stack = (ecs: ECS, children: Entity[]): Entity =>
    ecs.entity(
        new Layout(layout),
        new Geometry(geometry),
        new Children(children),
    )