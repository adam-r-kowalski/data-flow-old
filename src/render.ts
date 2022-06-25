import { batchGeometry } from "./batchGeometry"
import { gatherCameras } from "./gatherCameras"
import { layerGeometry } from "./layerGeometry"
import { composeReducers, reduce } from "./reduce"
import { Renderer } from "./renderer"
import { UI } from "./ui"

export const render = (renderer: Renderer, ui: UI) => {
    const { width, height } = renderer.size
    renderer.clear()
    const constraints = {
        minWidth: 0,
        maxWidth: width,
        minHeight: 0,
        maxHeight: height
    }
    const layout = ui.layout(constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const cameraStack = { activeCameraIndex: 0, nextCameraIndex: 1 }
    const { geometry } = ui.geometry(layout, offsets, cameraStack)
    const reducer = composeReducers(layerGeometry, gatherCameras)
    const [layers, cameras] = reduce(ui, layout, geometry, reducer)
    const batches = batchGeometry(layers)
    renderer.cameras = cameras
    for (const batch of batches) renderer.draw(batch)
}