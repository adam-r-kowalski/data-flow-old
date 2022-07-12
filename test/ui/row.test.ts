import { container, row, layout, geometry } from '../../src/new_ui'
import { batchGeometry } from '../../src/new_ui/batch_geometry'
import { initCameraStack } from '../../src/new_ui/camera_stack'
import * as layerGeometry from '../../src/new_ui/layer_geometry'
import { reduce } from '../../src/new_ui/reduce'
import { mockDocument, mockWindow } from "../../src/new_ui/mock"
import { webGL2Renderer } from "../../src/new_ui/webgl2"
import { CrossAxisAlignment } from '../../src/new_ui/alignment'

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }
const blue = { red: 0, green: 0, blue: 255, alpha: 255 }

const mockRenderer = () => webGL2Renderer({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow(),
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

test("row batch", () => {
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
    const batches = batchGeometry(layers)
    const expectedBatches = [
        {
            vertices: [
                0, 0,
                0, 50,
                50, 0,
                50, 50,

                50, 0,
                50, 50,
                100, 0,
                100, 50,
            ],
            colors: [
                255, 0, 0, 255,
                255, 0, 0, 255,
                255, 0, 0, 255,
                255, 0, 0, 255,

                0, 255, 0, 255,
                0, 255, 0, 255,
                0, 255, 0, 255,
                0, 255, 0, 255,
            ],
            vertexIndices: [
                0, 1, 2,
                1, 2, 3,

                4, 5, 6,
                5, 6, 7
            ],
            textureIndex: 0,
            textureCoordinates: [
                0, 0,
                0, 0,
                0, 0,
                0, 0,

                0, 0,
                0, 0,
                0, 0,
                0, 0,
            ],
            cameraIndex: Array(8).fill(0)
        }
    ]
    expect(batches).toEqual(expectedBatches)
})

test("row cross axis alignment start layout", () => {
    const renderer = mockRenderer()
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.START }, [
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 100,
            height: 100,
            color: green
        }),
        container({
            width: 50,
            height: 50,
            color: blue
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 200, height: 100 },
        totalChildWidth: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ]
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("row cross axis alignment start geometry", () => {
    const renderer = mockRenderer()
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.START }, [
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 100,
            height: 100,
            color: green
        }),
        container({
            width: 50,
            height: 50,
            color: blue
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 200, y1: 100 },
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
                worldSpace: { x0: 50, y0: 0, x1: 150, y1: 100 },
                vertices: [
                    50, 0,
                    50, 100,
                    150, 0,
                    150, 100,
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
            },
            {
                worldSpace: { x0: 150, y0: 0, x1: 200, y1: 50 },
                vertices: [
                    150, 0,
                    150, 50,
                    200, 0,
                    200, 50,
                ],
                colors: [
                    0, 0, 255, 255,
                    0, 0, 255, 255,
                    0, 0, 255, 255,
                    0, 0, 255, 255,
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
