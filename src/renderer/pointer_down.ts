import { Renderer } from "."
import { WorldSpace } from "../geometry"
import { Pointer } from "../ui"

const inWorldSpace = ({ x0, y0, x1, y1 }: WorldSpace, pointer: Pointer) =>
    x0 <= pointer.x && pointer.x <= x1 &&
    y0 <= pointer.y && pointer.y <= y1

export const pointerDown = <R extends Renderer>(renderer: R, pointer: Pointer): R => {
    for (let i = renderer.clickHandlers.length; i > 0; --i) {
        for (const { onClick, worldSpace } of renderer.clickHandlers[i - 1]) {
            if (inWorldSpace(worldSpace, pointer)) {
                onClick(pointer)
                return renderer
            }
        }
    }
    return renderer
}
