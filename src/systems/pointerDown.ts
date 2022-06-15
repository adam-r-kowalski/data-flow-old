import { Camera, Dragging, OnClick, Pointers, Transform } from "../components";
import { Entity } from "../ecs";
import { Vec3 } from "../linear_algebra";
import { rayCast } from "./ray_cast";
import { render } from "./render";

export const pointerDown = (graph: Entity) => {
    const ecs = graph.ecs
    document.addEventListener('pointerdown', (e) => {
        const length = ecs.update(Pointers, pointers => {
            pointers.events.push(e)
            return pointers.events.length
        })
        if (length !== 1) return
        const camera = graph.get(Camera)!.entity
        const cameraMatrix = camera.get(Transform)!.matrix
        const mouse = new Vec3([e.clientX, e.clientY, 1])
        for (const entity of rayCast(ecs, cameraMatrix, mouse)) {
            console.log(entity.id)
            const onClick = entity.get(OnClick)
            if (onClick) {
                onClick.callback(entity)
                requestAnimationFrame(() => render(ecs))
                return
            }
        }
        ecs.update(Dragging, dragging => dragging.value = true)
    })
}