import { CameraStack } from "../src/camera_stack"
import { rgba } from "../src/color"
import { Mat3 } from "../src/linear_algebra"
import { reduce } from "../src/reduce"
import { mockMeasureText } from "../src/renderer/mock"
import { buildIdToWorldSpace } from "../src/renderer/render"
import { container } from "../src/ui/container"
import { scene } from "../src/ui/scene"

test("connection in scene", () => {
    const ui = scene({
        camera: Mat3.identity(),
        children: [
            container({
                id: 'a',
                x: 100,
                y: 100,
                width: 50,
                height: 50,
                color: rgba(255, 0, 0, 255)
            }),
            container({
                id: 'b',
                x: 300,
                y: 300,
                width: 50,
                height: 50,
                color: rgba(0, 255, 0, 255)
            })
        ],
        connections: [
            { from: 'a', to: 'b' }
        ]
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets, new CameraStack())
    const idToWorldSpace = reduce(ui, layout, geometry, buildIdToWorldSpace)
    expect(idToWorldSpace).toEqual({
        'a': { x0: 100, y0: 100, x1: 150, y1: 150 },
        'b': { x0: 300, y0: 300, x1: 350, y1: 350 },
    })
})
