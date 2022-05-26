import {
    Layout,
    Text,
    FontSize,
    FontFamily,
    Constraints,
    Renderer,
    Color
} from "../components";
import { ECS, Entity } from "../ecs";

const layout = (entity: Entity, constraints: Constraints) => {
    const renderer = entity.ecs.get(Renderer)!
    const size = renderer.textSize(entity)
    entity.set(constraints, size)
    return size
}

export const text = (ecs: ECS, data: string) =>
    ecs.entity(
        new Text(data),
        new FontSize(24),
        new FontFamily("monospace"),
        new Color({ h: 0, s: 1, l: 1, a: 1 }),
        new Layout(layout)
    )