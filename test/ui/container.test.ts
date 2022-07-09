import { container, layout, geometry, UIKind } from '../../src/new_ui'
import { reduce } from '../../src/new_ui/reduce'
import { initCameraStack } from '../../src/new_ui/camera_stack'
import { mockDocument, mockWindow } from '../../src/renderer/mock'
import { webGL2Renderer } from '../../src/renderer/webgl2'
import { layerGeometry } from '../../src/new_ui/layer_geometry'
import { batchGeometry } from '../../src/new_ui/batch_geometry'

const red = { red: 255, green: 0, blue: 0, alpha: 255 }

const mockRenderer = () => webGL2Renderer({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow()
})

test("container with width height and color", () => {
    const ui = container({
        width: 50,
        height: 50,
        color: red
    })
    const expectedUi = {
        kind: UIKind.CONTAINER,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        width: 50,
        height: 50,
        color: red
    }
    expect(ui).toEqual(expectedUi)
})

test("container layout", () => {
    const renderer = mockRenderer()
    const ui = container({
        width: 50,
        height: 50,
        color: red
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = { size: { width: 50, height: 50 } }
    expect(uiLayout).toEqual(expectedLayout)
})

test("container geometry", () => {
    const renderer = mockRenderer()
    const ui = container({
        width: 50,
        height: 50,
        color: red
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const cameraStack = initCameraStack()
    const uiGeometry = geometry(ui, uiLayout, offsets, cameraStack)
    const expectedGeometry = {
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
    }
    expect(uiGeometry).toEqual(expectedGeometry)
    expect(cameraStack).toEqual(initCameraStack())
})

test("container layers", () => {
    const renderer = mockRenderer()
    const ui = container({
        width: 50,
        height: 50,
        color: red
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const layers = reduce(ui, uiLayout, uiGeometry, layerGeometry)
    const expectedLayers = [
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
                }
            ]
        }
    ]
    expect(layers).toEqual(expectedLayers)
})

test("container batches", () => {
    const renderer = mockRenderer()
    const ui = container({
        width: 50,
        height: 50,
        color: red
    })
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
            textureIndex: 0,
            textureCoordinates: Array(8).fill(0),
            cameraIndex: Array(4).fill(0)
        }
    ]
    expect(batches).toEqual(expectedBatches)
})

test("container within container layout", () => {
    const renderer = mockRenderer()
    const ui = container({ padding: 5 },
        container({
            width: 50,
            height: 50,
            color: red
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 60, height: 60 },
        child: {
            size: { width: 50, height: 50 }
        }
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("container within container geometry", () => {
    const renderer = mockRenderer()
    const ui = container({ padding: 5 },
        container({
            width: 50,
            height: 50,
            color: red
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const cameraStack = initCameraStack()
    const uiGeometry = geometry(ui, uiLayout, offsets, cameraStack)
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 60, y1: 60 },
        vertices: [],
        colors: [],
        vertexIndices: [],
        cameraIndex: [],
        textureIndex: 0,
        textureCoordinates: [],
        child: {
            worldSpace: { x0: 5, y0: 5, x1: 55, y1: 55 },
            vertices: [
                5, 5,
                5, 55,
                55, 5,
                55, 55,
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
        }
    }
    expect(uiGeometry).toEqual(expectedGeometry)
})
