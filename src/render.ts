import { batchGeometry } from "./batchGeometry"
import { layerGeometry } from "./layerGeometry"
import { reduce } from "./reduce"
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
    const geometry = ui.geometry(layout, offsets)
    const layers = reduce(ui, layout, geometry, layerGeometry)
    const batches = batchGeometry(layers)
    for (const batch of batches) {
        renderer.draw(batch)
    }
}