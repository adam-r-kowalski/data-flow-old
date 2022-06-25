import { rgba } from '../src/color'
import { container, containerLayout, containerGeometry } from '../src/ui/container'
import { layerGeometry } from '../src/layerGeometry'
import { reduce } from '../src/reduce'
import { Batch, batchGeometry } from '../src/batchGeometry'
import { center, centerGeometry, centerLayout } from '../src/ui/center'
import { mockMeasureText } from '../src/renderer/mock'


test("center layout", () => {
    const ui = center(
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const expectedLayout = centerLayout({ width: 100, height: 100 },
        containerLayout({ width: 50, height: 50 }))
    expect(layout).toEqual(expectedLayout)
})

test("center geometry", () => {
    const ui = center(
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const { geometry } = ui.geometry(layout, offsets, { activeCameraIndex: 0, nextCameraIndex: 1 })
    const expectedGeometry = centerGeometry({ x: 0, y: 0 },
        containerGeometry({
            position: { x: 25, y: 25 },
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
    const ui = center(
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const { geometry } = ui.geometry(layout, offsets, { activeCameraIndex: 0, nextCameraIndex: 1 })
    const layers = reduce(ui, layout, geometry, layerGeometry)
    const childGeometry = containerGeometry({
        position: { x: 25, y: 25 },
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
    const ui = center(
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const { geometry } = ui.geometry(layout, offsets, { activeCameraIndex: 0, nextCameraIndex: 1 })
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
