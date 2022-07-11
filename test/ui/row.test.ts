import { container, row, layout, geometry } from '../../src/new_ui'
import { initCameraStack } from '../../src/new_ui/camera_stack'
import { layerGeometry } from '../../src/new_ui/layer_geometry'
import { reduce } from '../../src/new_ui/reduce'
import { mockDocument, mockWindow } from "../../src/renderer/mock"
import { webGL2Renderer } from "../../src/renderer/webgl2"

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }

const mockRenderer = () => webGL2Renderer({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow()
})


test("row layout", () => {
    const renderer = mockRenderer()
    const ui = row([
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 50,
            height: 50,
            color: green
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 100, height: 50 },
        totalChildWidth: 100,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 50, height: 50 } },
        ]
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("row geometry", () => {
    const renderer = mockRenderer()
    const ui = row([
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 50,
            height: 50,
            color: green
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 100, y1: 50 },
        children: [
            {
                worldSpace: { x0: 0, y0: 0, x1: 50, y1: 50 },
                vertices: [
                    0, 0,
                    0, 50,
                    50, 0,
                    50, 50,
                ],
                colors: [
                    255, 0, 0, 255,
                    255, 0, 0, 255,
                    255, 0, 0, 255,
                    255, 0, 0, 255,
                ],
                vertexIndices: [
                    0, 1, 2,
                    1, 2, 3
                ],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0)
            },
            {
                worldSpace: { x0: 50, y0: 0, x1: 100, y1: 50 },
                vertices: [
                    50, 0,
                    50, 50,
                    100, 0,
                    100, 50,
                ],
                colors: [
                    0, 255, 0, 255,
                    0, 255, 0, 255,
                    0, 255, 0, 255,
                    0, 255, 0, 255,
                ],
                vertexIndices: [
                    0, 1, 2,
                    1, 2, 3
                ],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0)
            }
        ]
    }
    expect(uiGeometry).toEqual(expectedGeometry)
})

test("row layers", () => {
    const renderer = mockRenderer()
    const ui = row([
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 50,
            height: 50,
            color: green
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const layers = reduce(ui, uiLayout, uiGeometry, layerGeometry)
    const expectedLayers = [
        {},
        {
            0: [
                {
                    worldSpace: { x0: 0, y0: 0, x1: 50, y1: 50 },
                    vertices: [
                        0, 0,
                        0, 50,
                        50, 0,
                        50, 50,
                    ],
                    colors: [
                        255, 0, 0, 255,
                        255, 0, 0, 255,
                        255, 0, 0, 255,
                        255, 0, 0, 255,
                    ],
                    vertexIndices: [
                        0, 1, 2,
                        1, 2, 3
                    ],
                    cameraIndex: Array(4).fill(0),
                    textureIndex: 0,
                    textureCoordinates: Array(8).fill(0),
                },
                {
                    worldSpace: { x0: 50, y0: 0, x1: 100, y1: 50 },
                    vertices: [
                        50, 0,
                        50, 50,
                        100, 0,
                        100, 50,
                    ],
                    colors: [
                        0, 255, 0, 255,
                        0, 255, 0, 255,
                        0, 255, 0, 255,
                        0, 255, 0, 255,
                    ],
                    vertexIndices: [
                        0, 1, 2,
                        1, 2, 3
                    ],
                    cameraIndex: Array(4).fill(0),
                    textureIndex: 0,
                    textureCoordinates: Array(8).fill(0),
                }
            ]
        }
    ]
    expect(layers).toEqual(expectedLayers)
})
