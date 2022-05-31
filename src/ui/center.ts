import {
    Layout,
    Constraints,
    Geometry,
    Size,
    Child,
    Offset,
    WorldSpace,
} from "../components";
import { ECS, Entity } from "../ecs";
import { Layers } from "../layers";

const layout = (self: Entity, constraints: Constraints) => {
    const child = self.get(Child)!.entity
    const childSize = child.get(Layout)!.layout(child, constraints)
    child.update(Offset, offset => {
        offset.x = constraints.maxWidth / 2 - childSize.width / 2
        offset.y = constraints.maxHeight / 2 - childSize.height / 2
    })
    const size = new Size(constraints.maxWidth, constraints.maxHeight)
    self.set(constraints, size, new Offset(0, 0))
    return size
}

const geometry = (self: Entity, parentOffset: Offset, layers: Layers, z: number) => {
    const { width, height } = self.get(Size)!
    const offset = parentOffset.add(self.get(Offset)!)
    const child = self.get(Child)!.entity
    child.get(Geometry)!.geometry(child, offset, layers, z)
    self.set(new WorldSpace(offset.x, offset.y, width, height))
}

export const center = (ecs: ECS, child: Entity) =>
    ecs.entity(
        new Layout(layout),
        new Geometry(geometry),
        new Child(child)
    )