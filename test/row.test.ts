import { batchGeometry } from "../src/batchGeometry"
import { rgba } from "../src/color"
import { layerGeometry } from "../src/layerGeometry"
import { reduce } from "../src/reduce"
import { container, containerGeometry, containerLayout } from "../src/ui/container"
import { row, rowGeometry, rowLayout } from "../src/ui/row"

test("row layout", () => {
    const ui = row([
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 255, 0, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints)
    const expectedLayout = rowLayout({ width: 100, height: 50 }, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("row geometry", () => {
    const ui = row([
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 255, 0, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedGeometry = rowGeometry({ x: 0, y: 0 }, [
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
        }),
        containerGeometry({
            position: { x: 50, y: 0 },
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
            ]
        })
    ])
    expect(geometry).toEqual(expectedGeometry)
})

test("row layers", () => {
    const ui = row([
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 255, 0, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const layers = reduce(ui, layout, geometry, layerGeometry)
    const expectedLayers = [
        [],
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
            }),
            containerGeometry({
                position: { x: 50, y: 0 },
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
                ]
            })
        ]
    ]
    expect(layers).toEqual(expectedLayers)
})

test("row batch", () => {
    const ui = row([
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 255, 0, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints)
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
                7, 8, 9
            ]
        }
    ]
    expect(batches).toEqual(expectedBatches)
})
