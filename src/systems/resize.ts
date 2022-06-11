import { ECS } from "../ecs";
import { Renderer } from "../renderer";
import { render } from "./render";

export const resize = (ecs: ECS) => {
    const renderer = ecs.get(Renderer)!
    window.addEventListener('resize', () => {
        renderer.setSize(renderer.canvas.clientWidth, renderer.canvas.clientHeight)
        requestAnimationFrame(() => render(ecs))
    })
}