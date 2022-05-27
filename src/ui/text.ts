import {
    Layout,
    Text,
    FontSize,
    FontFamily,
    Constraints,
    Renderer,
    Color,
    Offset,
    Geometry
} from "../components";
import { ECS, Entity } from "../ecs";
import { Layers } from "../layers";

const layout = (self: Entity, constraints: Constraints) => {
    const renderer = self.ecs.get(Renderer)!
    const size = renderer.textSize(self)
    self.set(constraints, size, new Offset(0, 0))
    return size
}

const geometry = (self: Entity, offset: Offset, layers: Layers, z: number) => {
    self.ecs.get(Renderer)!.textGeometry(self, offset)
    layers.push(z, self)
}

export const text = (ecs: ECS, data: string) =>
    ecs.entity(
        new Text(data),
        new FontSize(24),
        new FontFamily("monospace"),
        new Color({ h: 0, s: 1, l: 1, a: 1 }),
        new Layout(layout),
        new Geometry(geometry),
    )