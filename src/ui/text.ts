import { Layout, Text, FontSize, FontFamily, Constraints, Size } from "../components";
import { ECS, Entity } from "../ecs";

const layout = (entity: Entity, constraints: Constraints) => {
    console.log(entity.get(FontFamily))
    entity.set(constraints)
    return new Size(0, 100)
}

export const text = (ecs: ECS, data: string) =>
    ecs.entity(
        new Text(data),
        new FontSize(24),
        new FontFamily("monospace"),
        new Layout(layout)
    )