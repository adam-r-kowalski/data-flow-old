import { ECS } from "../ecs";
import { Renderer } from "../components";
import { systems } from "../studio";

export const render = (ecs: ECS) => {
    systems.layout(ecs)
    const renderer = ecs.get(Renderer)!
    renderer.clear()
}