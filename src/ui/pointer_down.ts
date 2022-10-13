import { Pointer, WorldSpace } from "."
import { Renderer } from "./renderer"

const inWorldSpace = ({ x0, y0, x1, y1 }: WorldSpace, pointer: Pointer) =>
    x0 <= pointer.position.x &&
    pointer.position.x <= x1 &&
    y0 <= pointer.position.y &&
    pointer.position.y <= y1

export const handleClick = <AppEvent>(
    renderer: Renderer<AppEvent>,
    pointer: Pointer
): void => {
    for (let i = renderer.clickHandlers.length; i > 0; --i) {
        for (const { onClick, worldSpace } of renderer.clickHandlers[i - 1]) {
            if (inWorldSpace(worldSpace, pointer)) {
                onClick(pointer)
                return
            }
        }
    }
}

export const handleDrag = <AppEvent>(
    renderer: Renderer<AppEvent>,
    pointer: Pointer
): void => {
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
    pointer: Pointer
): void => {
    handleClick(renderer, pointer)
    handleDrag(renderer, pointer)
    renderer.pointers[pointer.id] = pointer
}
