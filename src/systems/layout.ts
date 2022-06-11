import { Constraints, Layout } from "../components";
import { Entity } from "../ecs";
import { Renderer } from "../renderer";

export const layout = (root: Entity) => {
    const { width, height } = root.ecs.get(Renderer)!
    const constraints = new Constraints(0, width, 0, height)
    root.get(Layout)!.layout(root, constraints)
}