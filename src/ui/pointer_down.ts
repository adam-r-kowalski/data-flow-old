import { PointerDown, Pointer, WorldSpace } from "."
import { Renderer } from "./renderer"

const inWorldSpace = ({ x0, y0, x1, y1 }: WorldSpace, pointer: Pointer) =>
    x0 <= pointer.position.x &&
    pointer.position.x <= x1 &&
    y0 <= pointer.position.y &&
    pointer.position.y <= y1

export const handleClick = <AppEvent>(
    renderer: Renderer<AppEvent>,
    event: PointerDown
): void => {
    const pointer = event.pointer
    for (let i = renderer.clickHandlers.length; i > 0; --i) {
        for (const { onClick, worldSpace } of renderer.clickHandlers[i - 1]) {
            if (inWorldSpace(worldSpace, pointer)) {
                onClick(event)
                return
            }
        }
    }
}

export const handleDrag = <AppEvent>(
    renderer: Renderer<AppEvent>,
    event: PointerDown
): void => {
    const pointer = event.pointer
    for (let i = renderer.dragHandlers.length; i > 0; --i) {
        for (const { onDrag, worldSpace } of renderer.dragHandlers[i - 1]) {
            if (inWorldSpace(worldSpace, pointer)) {
                renderer.onDrag = onDrag
                return
            }
        }
    }
}

export const pointerDown = <AppEvent>(
    renderer: Renderer<AppEvent>,
    event: PointerDown
): void => {
    handleClick(renderer, event)
    handleDrag(renderer, event)
    renderer.pointers[event.pointer.id] = event.pointer
}
