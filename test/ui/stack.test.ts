import { container, center, stack, layout, geometry } from '../../src/ui'
import { Batch, batchGeometry } from '../../src/ui/batch_geometry'
import { initCameraStack } from '../../src/ui/camera_stack'
import * as layerGeometry from '../../src/ui/layer_geometry'
import { reduce } from '../../src/ui/reduce'
import { mockDocument, mockWindow } from '../../src/ui/mock'
import { webGL2Renderer } from '../../src/ui/webgl2'

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }

const mockRenderer = () => webGL2Renderer({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow()
})


test("stack layout", () => {
    const renderer = mockRenderer()
    const ui = stack([
        container({ color: red }),
        center(
            container({
                width: 50,
                height: 50,
                color: green
            })
        )
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 100, height: 100 },
        children: [
            { size: { width: 100, height: 100 } },
            {
                size: { width: 100, height: 100 },
                child: {
                    size: { width: 50, height: 50 }
                }
            }
        ]
    }
    expect(uiLayout).toEqual(expectedLayout)
})


test("stack geometry", () => {
    const renderer = mockRenderer()
    const ui = stack([
        container({ color: red }),
        center(
            container({
                width: 50,
                height: 50,
                color: green
            })
        )
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 100, y1: 100 },
        children: [
            {
                worldSpace: { x0: 0, y0: 0, x1: 100, y1: 100 },
                vertices: [
                    0, 0,
                    0, 100,
                    100, 0,
                    100, 100,
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
                worldSpace: { x0: 0, y0: 0, x1: 100, y1: 100 },
                child: {
                    worldSpace: { x0: 25, y0: 25, x1: 75, y1: 75 },
                    vertices: [
                        25, 25,
                        25, 75,
                        75, 25,
                        75, 75,
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
            }
        ]

    }
    expect(uiGeometry).toEqual(expectedGeometry)
})

test("stack layers", () => {
    const renderer = mockRenderer()
    const ui = stack([
        container({ color: red }),
        center(
            container({
                width: 50,
                height: 50,
                color: green
            })
        )
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const layers = reduce(ui, uiLayout, uiGeometry, layerGeometry)
    const expectedLayers = [
        {
            0: [
                {
                    worldSpace: { x0: 0, y0: 0, x1: 100, y1: 100 },
                    vertices: [
                        0, 0,
                        0, 100,
                        100, 0,
                        100, 100,
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
                }
            ]
        },
        {},
        {
            0: [
                {
                    worldSpace: { x0: 25, y0: 25, x1: 75, y1: 75 },
                    vertices: [
                        25, 25,
                        25, 75,
                        75, 25,
                        75, 75,
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
    ]
    expect(layers).toEqual(expectedLayers)
})

test("stack batches", () => {
    const renderer = mockRenderer()
    const ui = stack([
        container({ color: red }),
        center(
            container({
                width: 50,
                height: 50,
                color: green
            })
        )
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const layers = reduce(ui, uiLayout, uiGeometry, layerGeometry)
    const batches = batchGeometry(layers)
    const expectedBatches: Batch[] = [
        {
            vertices: [
                0, 0,
                0, 100,
                100, 0,
                100, 100,

                25, 25,
                25, 75,
                75, 25,
                75, 75,
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
