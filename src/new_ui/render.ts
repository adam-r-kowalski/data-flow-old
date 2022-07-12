import { batchGeometry } from "./batch_geometry"
import { initCameraStack } from "./camera_stack"
import { reduce } from "./reduce"
import { UI, layout, geometry, Renderer } from "."
import * as reducer from './reducer'
import { Accumulator } from './reducer'
import { connectionGeometry } from "./connection_geometry"

export const render = <UIEvent, R extends Renderer<UIEvent>>(renderer: R, ui: UI<UIEvent>): R => {
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
    const { layers, clickHandlers, connections, idToWorldSpace } = reduce<UIEvent, Accumulator<UIEvent>>(ui, uiLayout, uiGeometry, reducer)
    const batches = batchGeometry(layers)
    const lines = connectionGeometry(connections, idToWorldSpace)
    renderer.cameras = cameraStack.cameras
    renderer.clickHandlers = clickHandlers
    for (const batch of batches) renderer.draw(batch)
    if (lines.vertices.length) renderer.drawLines(lines)
    return renderer
}
