import { Renderer, Pointer, WorldSpace } from "."

const inWorldSpace = ({ x0, y0, x1, y1 }: WorldSpace, pointer: Pointer) =>
    x0 <= pointer.position.x &&
    pointer.position.x <= x1 &&
    y0 <= pointer.position.y &&
    pointer.position.y <= y1

export const pointerDown = <R extends Renderer>(
    renderer: R,
    pointer: Pointer
): R => {
    for (let i = renderer.clickHandlers.length; i > 0; --i) {
        for (const { onClick, worldSpace } of renderer.clickHandlers[i - 1]) {
            if (inWorldSpace(worldSpace, pointer)) {
                renderer.dispatch(onClick)
                return renderer
            }
        }
    }
    return renderer
}
