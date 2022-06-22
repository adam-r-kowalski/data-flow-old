import { rgba } from '../src/color'
import { container, containerLayout, containerGeometry } from '../src/ui/container'
import { padding } from '../src/padding'
import { layerGeometry } from '../src/layerGeometry'
import { reduce } from '../src/reduce'
import { batchGeometry } from '../src/batchGeometry'
import { mockMeasureText } from '../src/renderer/mock'

test("container layout", () => {
    const ui = container({
        width: 50,
        height: 50,
        color: rgba(255, 0, 0, 255)
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const expectedLayout = containerLayout({ width: 50, height: 50 })
    expect(layout).toEqual(expectedLayout)
})

test("container geometry", () => {
    const ui = container({
        width: 50,
        height: 50,
        color: rgba(255, 0, 0, 255)
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedGeometry = containerGeometry({
        position: { x: 0, y: 0 },
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
        ]
    })
    expect(geometry).toEqual(expectedGeometry)
})

test("container layers", () => {
    const ui = container({
        width: 50,
        height: 50,
        color: rgba(255, 0, 0, 255)
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const layers = reduce(ui, layout, geometry, layerGeometry)
    const expectedLayers = [
        [
            containerGeometry({
                position: { x: 0, y: 0 },
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
                ]
            })
        ]
    ]
    expect(layers).toEqual(expectedLayers)
})

test("container batches", () => {
    const ui = container({
        width: 50,
        height: 50,
        color: rgba(255, 0, 0, 255)
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const layers = reduce(ui, layout, geometry, layerGeometry)
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
            ]
        }
    ]
    expect(batches).toEqual(expectedBatches)
})


test("container within container layout", () => {
    const ui = container({ padding: padding(5) },
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const expectedLayout = containerLayout({ width: 60, height: 60 },
        containerLayout({ width: 50, height: 50 }))
    expect(layout).toEqual(expectedLayout)
})

test("container within container geometry", () => {
    const ui = container({ padding: padding(5) },
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedGeometry = containerGeometry({ position: { x: 0, y: 0 } },
        containerGeometry({
            position: { x: 5, y: 5 },
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
            ]
        }))
    expect(geometry).toEqual(expectedGeometry)
})

test("container within container layers", () => {
    const ui = container({ padding: padding(5) },
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const layers = reduce(ui, layout, geometry, layerGeometry)
    const childGeometry = containerGeometry({
        position: { x: 5, y: 5 },
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
        ]
    })
    const parentGeometry = containerGeometry({ position: { x: 0, y: 0 } }, childGeometry)
    const expectedLayers = [
        [parentGeometry],
        [childGeometry],
    ]
    expect(layers).toEqual(expectedLayers)
})

test("container within container batches", () => {
    const ui = container({ padding: padding(5) },
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const layers = reduce(ui, layout, geometry, layerGeometry)
    const batches = batchGeometry(layers)
    const expectedBatches = [
        {
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
            ]
        }
    ]
    expect(batches).toEqual(expectedBatches)
})
