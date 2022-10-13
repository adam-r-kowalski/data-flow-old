import { Pointer } from "."
import { Renderer } from "./renderer"

export const pointerUp = <AppEvent>(
    renderer: Renderer<AppEvent>,
    _: Pointer
): void => {
    renderer.onDrag = undefined
}
