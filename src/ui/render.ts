import { batchGeometry } from "./batch_geometry"
import { initCameraStack } from "./camera_stack"
import { reduce } from "./reduce"
import { UI, layout, geometry } from "."
import * as reducer from "./reducer"
import { Accumulator } from "./reducer"
import { WebGL2Renderer } from "./webgl2"

export const render = <AppEvent>(
    renderer: WebGL2Renderer<AppEvent>,
    ui: UI
): WebGL2Renderer<AppEvent> => {
    const { width, height } = renderer.size
    renderer.clear()
    const constraints = {
        minWidth: 0,
        maxWidth: width,
        minHeight: 0,
        maxHeight: height,
    }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const cameraStack = initCameraStack()
    const uiGeometry = geometry(ui, uiLayout, offsets, cameraStack)
    const { layers, clickHandlers, connections, idToWorldSpace } =
        reduce<Accumulator>(ui, uiLayout, uiGeometry, reducer)
    const batches = batchGeometry(layers, connections, idToWorldSpace)
    renderer.cameras = cameraStack.cameras
    renderer.clickHandlers = clickHandlers
    for (const batch of batches) renderer.draw(batch)
    return renderer
}
