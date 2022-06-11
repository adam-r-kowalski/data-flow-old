import { ECS } from "../ecs";
import { Renderer } from "../renderer";

export const touchEnd = (ecs: ECS) => {
    const renderer = ecs.get(Renderer)!
    document.addEventListener('touchend', () => {
        renderer.canvas.requestFullscreen()
    })
}