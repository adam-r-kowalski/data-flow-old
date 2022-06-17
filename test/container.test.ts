import { rgba } from '../src/color'
import { container, containerLayout, containerGeometry } from '../src/ui/container'
import { padding } from '../src/padding'
import { batchGeometry } from '../src/batch_geometry'
import { reduce } from '../src/reduce'

test("container layout", () => {
    const ui = container({
        width: 50,
        height: 50,
        color: rgba(255, 0, 0, 255)
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const batches = reduce(ui, layout, geometry, batchGeometry)
    const expectedLayout = containerLayout({ width: 50, height: 50 })
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
    expect(layout).toEqual(expectedLayout)
    expect(geometry).toEqual(expectedGeometry)
    expect(batches).toEqual(expectedBatches)
})

test("container with child layout", () => {
    const ui = container({ padding: padding(5) },
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const batches = reduce(ui, layout, geometry, batchGeometry)
    const expectedLayout = containerLayout({ width: 60, height: 60 },
        containerLayout({ width: 50, height: 50 }))
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
    const expectedBatches = [
        {
            vertices: [],
            colors: [],
            vertexIndices: []
        },
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
    expect(layout).toEqual(expectedLayout)
    expect(geometry).toEqual(expectedGeometry)
    expect(batches).toEqual(expectedBatches)
})