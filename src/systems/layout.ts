import { Constraints, Layout, UIRoot, Renderer } from "../components";
import { ECS } from "../ecs";

export const layout = (ecs: ECS) => {
    const renderer = ecs.get(Renderer)!
    const { width, height } = renderer.getSize()
    const ui = ecs.get(UIRoot)!.entity
    const constraints = new Constraints(0, width, 0, height)
    ui.get(Layout)!.layout(ui, constraints)
}