import { batchGeometry } from "./batch_geometry"
import { initCameraStack } from "./camera_stack"
import { reduce } from "./reduce"
import { UI, layout, geometry, Renderer } from "."
import * as reducer from './reducer'
import { Accumulator } from './reducer'

export const render = <AppEvent, R extends Renderer<AppEvent>>(renderer: R, ui: UI<AppEvent>): R => {
    const { width, height } = renderer.size
    renderer.clear()
    const constraints = {
        minWidth: 0,
        maxWidth: width,
        minHeight: 0,
        maxHeight: height
    }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const cameraStack = initCameraStack()
    const uiGeometry = geometry(ui, uiLayout, offsets, cameraStack)
    const { layers, clickHandlers, connections, idToWorldSpace } = reduce<AppEvent, Accumulator<AppEvent>>(ui, uiLayout, uiGeometry, reducer)
    const batches = batchGeometry(layers, connections, idToWorldSpace)
    renderer.cameras = cameraStack.cameras
    renderer.clickHandlers = clickHandlers
    for (const batch of batches) renderer.draw(batch)
    return renderer
}
