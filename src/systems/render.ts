import { ECS } from "../ecs";
import { Renderer, UIRoot } from "../components";
import { systems } from "../studio";

export const render = (ecs: ECS) => {
    systems.layout(ecs)
    const renderer = ecs.get(Renderer)!
    renderer.clear()
    const ui = ecs.get(UIRoot)!.entity
    renderer.drawText(ui)
    renderer.flush()
}