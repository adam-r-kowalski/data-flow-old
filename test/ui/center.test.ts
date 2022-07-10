import { container, center, layout, geometry, UIKind } from '../../src/new_ui'
import { webGL2Renderer } from '../../src/renderer/webgl2'
import { mockDocument, mockWindow } from '../../src/renderer/mock'
import { initCameraStack } from '../../src/new_ui/camera_stack'
import { layerGeometry } from '../../src/new_ui/layer_geometry'
import { reduce } from '../../src/new_ui/reduce'

const red = { red: 255, green: 0, blue: 0, alpha: 255 }

const mockRenderer = () => webGL2Renderer({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow()
})

test("center ui", () => {
    const ui = center(
        container({
            width: 50,
            height: 50,
            color: red
        }))
    const expectedUi = {
        kind: UIKind.CENTER,
        child: {
            kind: UIKind.CONTAINER,
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            width: 50,
            height: 50,
            color: red
        }
    }
    expect(ui).toEqual(expectedUi)
})

test("center layout", () => {
    const renderer = mockRenderer()
    const ui = center(
        container({
            width: 50,
            height: 50,
            color: red
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 100, height: 100 },
        child: {
            size: { width: 50, height: 50 }
        }
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("center geometry", () => {
    const renderer = mockRenderer()
    const ui = center(
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
        worldSpace: { x0: 0, y0: 0, x1: 100, y1: 100 },
        vertices: [],
        colors: [],
        vertexIndices: [],
        cameraIndex: [],
        textureIndex: 0,
        textureCoordinates: [],
        child: {
            worldSpace: { x0: 25, y0: 25, x1: 75, y1: 75 },
            vertices: [
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
    expect(uiGeometry).toEqual(expectedGeometry)
})

test("center layers", () => {
    const renderer = mockRenderer()
    const ui = center(
        container({
            width: 50,
            height: 50,
            color: red
        }))
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
                    worldSpace: { x0: 25, y0: 25, x1: 75, y1: 75 },
                    vertices: [
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
