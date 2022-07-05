import { CameraStack } from "../src/camera_stack"
import { identity } from "../src/linear_algebra/matrix3x3"
import { reduce } from "../src/reduce"
import { mockDocument, mockWindow } from "../src/renderer/mock"
import { reducer } from "../src/renderer/render"
import { webGL2Renderer } from "../src/renderer/webgl2"
import { container } from "../src/ui/container"
import { scene } from "../src/ui/scene"

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }
const white = { red: 255, green: 255, blue: 255, alpha: 255 }


const mockRenderer = () => webGL2Renderer({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow()
})

test("connection in scene", () => {
    const renderer = mockRenderer()
    const ui = scene({
        camera: identity(),
        children: [
            container({
                id: 'a',
                x: 100,
                y: 100,
                width: 50,
                height: 50,
                color: red
            }),
            container({
                id: 'b',
                x: 300,
                y: 300,
                width: 50,
                height: 50,
                color: green
            })
        ],
        connections: [
            { from: 'a', to: 'b', color: white }
        ]
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets, new CameraStack())
    const { idToWorldSpace, connections } = reduce(ui, layout, geometry, reducer)
    expect(idToWorldSpace).toEqual({
        'a': { x0: 100, y0: 100, x1: 150, y1: 150 },
        'b': { x0: 300, y0: 300, x1: 350, y1: 350 },
    })
    expect(connections).toEqual([{ from: 'a', to: 'b', color: white }])
})
