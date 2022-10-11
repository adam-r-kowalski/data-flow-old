import { Pointer, WorldSpace } from "."
import { ClickTimeout, WebGL2Renderer } from "./webgl2"

const inWorldSpace = ({ x0, y0, x1, y1 }: WorldSpace, pointer: Pointer) =>
    x0 <= pointer.position.x &&
    pointer.position.x <= x1 &&
    y0 <= pointer.position.y &&
    pointer.position.y <= y1

export const pointerDown = <AppEvent>(
    renderer: WebGL2Renderer<AppEvent>,
    pointer: Pointer,
    now: number
): WebGL2Renderer<AppEvent> => {
    for (let i = renderer.clickHandlers.length; i > 0; --i) {
        for (const { onClick, worldSpace, id } of renderer.clickHandlers[
            i - 1
        ]) {
            if (inWorldSpace(worldSpace, pointer)) {
                if (id) {
                    let timeout: ClickTimeout = renderer.clickTimeouts[id] ?? {
                        count: 0,
                        now,
                    }
                    if (now - timeout.now < 200) {
                        timeout.now = now
                        timeout.count += 1
                    } else {
                        timeout.count = 1
                        timeout.now = now
                    }
                    onClick(timeout.count)
                    renderer.clickTimeouts[id] = timeout
                    return renderer
                } else {
                    onClick(1)
                    return renderer
                }
            }
        }
    }
    return renderer
}
