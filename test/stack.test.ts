import { rgba } from '../src/color'
import { container, containerGeometry, containerLayout } from '../src/ui/container'
import { center, centerGeometry, centerLayout } from '../src/ui/center'
import { mockMeasureText } from '../src/renderer/mock'
import { stack, stackGeometry, stackLayout } from '../src/ui/stack'
import { reduce } from '../src/reduce'
import { layerGeometry } from '../src/layerGeometry'
import { Batch, batchGeometry } from '../src/batchGeometry'


test("stack layout", () => {
    const ui = stack([
        container({ color: rgba(255, 0, 0, 255) }),
        center(
            container({
                width: 50,
                height: 50,
                color: rgba(0, 255, 0, 255)
            })
        )
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const expectedLayout = stackLayout({ width: 100, height: 100 }, [
        containerLayout({ width: 100, height: 100 }),
        centerLayout({ width: 100, height: 100 },
            containerLayout({ width: 50, height: 50 }))
    ])
    expect(layout).toEqual(expectedLayout)
})

test("stack geometry", () => {
    const ui = stack([
        container({ color: rgba(255, 0, 0, 255) }),
        center(
            container({
                width: 50,
                height: 50,
                color: rgba(0, 255, 0, 255)
            })
        )
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedGeometry = stackGeometry({ x: 0, y: 0 }, [
        containerGeometry({
            position: { x: 0, y: 0 },
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
            ]
        }),
        centerGeometry({ x: 0, y: 0 },
            containerGeometry({
                position: { x: 25, y: 25 },
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
                ]
            })
        )
    ])
    expect(geometry).toEqual(expectedGeometry)
})

test("stack layers", () => {
    const ui = stack([
        container({ color: rgba(255, 0, 0, 255) }),
        center(
            container({
                width: 50,
                height: 50,
                color: rgba(0, 255, 0, 255)
            })
        )
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const layers = reduce(ui, layout, geometry, layerGeometry)
    const layer0 = new Map()
    layer0.set(0, [containerGeometry({
        position: { x: 0, y: 0 },
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
        ]
    })])
    const layer2 = new Map()
    layer2.set(0, [containerGeometry({
        position: { x: 25, y: 25 },
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
        ]
    })])
    const expectedLayers = [layer0, new Map(), layer2]
    expect(layers).toEqual(expectedLayers)
})

test("stack batches", () => {
    const ui = stack([
        container({ color: rgba(255, 0, 0, 255) }),
        center(
            container({
                width: 50,
                height: 50,
                color: rgba(0, 255, 0, 255)
            })
        )
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const layers = reduce(ui, layout, geometry, layerGeometry)
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
            ]
        }
    ]
    expect(batches).toEqual(expectedBatches)
})
