import { Pointer, WorldSpace } from "."
import { Renderer } from "./renderer"

const inWorldSpace = ({ x0, y0, x1, y1 }: WorldSpace, pointer: Pointer) =>
    x0 <= pointer.position.x &&
    pointer.position.x <= x1 &&
    y0 <= pointer.position.y &&
    pointer.position.y <= y1

export const pointerDown = <AppEvent>(
    renderer: Renderer<AppEvent>,
    pointer: Pointer,
    now: number
): void => {
    for (let i = renderer.clickHandlers.length; i > 0; --i) {
        for (const { onClick, worldSpace, id } of renderer.clickHandlers[
            i - 1
        ]) {
            if (inWorldSpace(worldSpace, pointer)) {
                if (id) {
                    let timeout = renderer.clickTimeouts[id]
                    const withinTime = timeout && now - timeout.now < 200
                    timeout = withinTime
                        ? {
                              count: timeout.count + 1,
                              now,
                          }
                        : {
                              count: 1,
                              now,
                          }
                    onClick(timeout.count)
                    renderer.clickTimeouts[id] = timeout
                    return
                } else {
                    onClick(1)
                    return
                }
            }
        }
    }
}
