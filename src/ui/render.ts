import { batchGeometry } from "./batch_geometry"
import { initCameraStack } from "./camera_stack"
import { reduce } from "./reduce"
import { UI, layout, geometry } from "."
import * as reducer from "./reducer"
import { Accumulator } from "./reducer"
import { setCameras, Renderer, clear, draw, measureText } from "./renderer"

export const render = <AppEvent>(
    renderer: Renderer<AppEvent>,
    ui: UI
): void => {
    const { width, height } = renderer.size
    clear(renderer)
    const constraints = {
        minWidth: 0,
        maxWidth: width,
        minHeight: 0,
        maxHeight: height,
    }
    const uiLayout = layout(ui, constraints, (font, str) =>
        measureText(renderer, font, str)
    )
    const offsets = { x: 0, y: 0 }
    const cameraStack = initCameraStack()
    const uiGeometry = geometry(ui, uiLayout, offsets, cameraStack)
    const { layers, clickHandlers, connections, idToWorldSpace } =
        reduce<Accumulator>(ui, uiLayout, uiGeometry, reducer)
    const batches = batchGeometry(layers, connections, idToWorldSpace)
    setCameras(renderer, cameraStack.cameras)
    renderer.clickHandlers = clickHandlers
    for (const batch of batches) draw(renderer, batch)
}
