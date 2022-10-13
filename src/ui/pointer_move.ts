import { Pointer } from "."
import { Renderer } from "./renderer"

export const pointerMove = <AppEvent>(
    renderer: Renderer<AppEvent>,
    event: Pointer
): void => {
    if (renderer.onDrag === undefined) return
    const { x, y } = renderer.pointers[event.id].position
    const dx = event.position.x - x
    const dy = event.position.y - y
    renderer.pointers[event.id] = event
    renderer.onDrag({ x: dx, y: dy })
}
