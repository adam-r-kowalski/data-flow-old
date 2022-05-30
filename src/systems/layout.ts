import { Constraints, Layout, UIRoot } from "../components";
import { ECS } from "../ecs";
import { Renderer } from "../renderer";

export const layout = (ecs: ECS) => {
    const { width, height } = ecs.get(Renderer)!
    const ui = ecs.get(UIRoot)!.entity
    const constraints = new Constraints(0, width, 0, height)
    ui.get(Layout)!.layout(ui, constraints)
}