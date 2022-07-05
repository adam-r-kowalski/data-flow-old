import { container, containerLayout, containerGeometry } from '../src/ui/container'
import { reduce } from '../src/reduce'
import { Batch, batchGeometry } from '../src/renderer/batch_geometry'
import { center, centerGeometry, centerLayout } from '../src/ui/center'
import { CameraStack } from '../src/camera_stack'
import { layerGeometry } from '../src/renderer/render'
import { webGL2Renderer } from '../src/renderer/webgl2'
import { mockDocument, mockWindow } from '../src/renderer/mock'

const red = { red: 255, green: 0, blue: 0, alpha: 255 }

const mockRenderer = () => webGL2Renderer({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow()
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
    const layout = ui.layout(constraints, renderer.measureText)
    const expectedLayout = centerLayout({ width: 100, height: 100 },
        containerLayout({ width: 50, height: 50 }))
    expect(layout).toEqual(expectedLayout)
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
    const layout = ui.layout(constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const cameraStack = new CameraStack()
    const geometry = ui.geometry(layout, offsets, cameraStack)
    const expectedGeometry = centerGeometry({ x0: 0, y0: 0, x1: 100, y1: 100 },
        containerGeometry({
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
            cameraIndex: [0, 0, 0, 0]
        }))
    expect(geometry).toEqual(expectedGeometry)
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
    const layout = ui.layout(constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const cameraStack = new CameraStack()
    const geometry = ui.geometry(layout, offsets, cameraStack)
    const layers = reduce(ui, layout, geometry, layerGeometry)
    const childGeometry = containerGeometry({
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
        cameraIndex: [0, 0, 0, 0]
    })
    const layer = new Map()
    layer.set(0, [childGeometry])
    const expectedLayers = [new Map(), layer]
    expect(layers).toEqual(expectedLayers)
})

test("center batches", () => {
    const renderer = mockRenderer()
    const ui = center(
        container({
            width: 50,
            height: 50,
            color: red
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const cameraStack = new CameraStack()
    const geometry = ui.geometry(layout, offsets, cameraStack)
    const layers = reduce(ui, layout, geometry, layerGeometry)
    const batches = batchGeometry(layers)
    const expectedBatches: Batch[] = [
        {
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
            textureIndex: 0,
            textureCoordinates: [
                0, 0,
                0, 0,
                0, 0,
                0, 0,
            ],
            cameraIndex: [0, 0, 0, 0]
        }
    ]
    expect(batches).toEqual(expectedBatches)
})
