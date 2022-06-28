import { Renderer } from "."
import { WorldSpace } from "../geometry"

export interface PointerDown {
    x: number
    y: number
}

const inWorldSpace = ({ x0, y0, x1, y1 }: WorldSpace, pointer: PointerDown) =>
    x0 <= pointer.x && pointer.x <= x1 &&
    y0 <= pointer.y && pointer.y <= y1


export const pointerDown = <R extends Renderer>(renderer: R, pointer: PointerDown): R => {
    for (let i = renderer.clickHandlers.length; i > 0; --i) {
        for (const { onClick, worldSpace } of renderer.clickHandlers[i - 1]) {
            if (inWorldSpace(worldSpace, pointer)) {
                onClick(pointer)
            }
        }
    }
    return renderer
}
