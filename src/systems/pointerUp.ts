import { DraggedEntity, Dragging, PointerDistance, Pointers } from "../components";
import { ECS } from "../ecs";

export const pointerUp = (ecs: ECS) => {
    document.addEventListener('pointerup', (e) => {
        const length = ecs.update(Pointers, pointers => {
            pointers.events.splice(pointers.events.findIndex(p => p.pointerId == e.pointerId), 1)
            return pointers.events.length
        })
        if (length != 0) return
        ecs.update(Dragging, dragging => dragging.value = false)
        ecs.update(PointerDistance, distance => distance.value = 0)
        ecs.update(DraggedEntity, dragged => dragged.entity = null)
    })
}