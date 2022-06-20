import { batchGeometry } from "../src/batchGeometry"
import { rgba } from "../src/color"
import { layerGeometry } from "../src/layerGeometry"
import { reduce } from "../src/reduce"
import { container, containerGeometry, containerLayout } from "../src/ui/container"
import { column, columnGeometry, columnLayout } from "../src/ui/column"
import { CrossAxisAlignment, MainAxisAlignment } from "../src/alignment"
import { render } from "../src/render"
import { mockRenderer } from "../src/renderer/mock"

test("column layout", () => {
    const ui = column([
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
    const expectedLayout = columnLayout({ width: 50, height: 100 }, 100, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("column geometry", () => {
    const ui = column([
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
    const expectedGeometry = columnGeometry({ x: 0, y: 0 }, [
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
            position: { x: 0, y: 50 },
            vertices: [
                0, 50,
                0, 100,
                50, 50,
                50, 100,
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

test("column layers", () => {
    const ui = column([
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
                position: { x: 0, y: 50 },
                vertices: [
                    0, 50,
                    0, 100,
                    50, 50,
                    50, 100,
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

test("column batch", () => {
    const ui = column([
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

                0, 50,
                0, 100,
                50, 50,
                50, 100,
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
            ]
        }
    ]
    expect(batches).toEqual(expectedBatches)
})

test("column render", () => {
    const renderer = mockRenderer({ width: 500, height: 500 })
    const ui = column([
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
    render(renderer, ui)
    expect(renderer.clearCount).toEqual(1)
    expect(renderer.batches).toEqual([
        {
            vertices: [
                0, 0,
                0, 50,
                50, 0,
                50, 50,

                0, 50,
                0, 100,
                50, 50,
                50, 100,
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
            ]
        }
    ])
})


test("column cross axis alignment start layout", () => {
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.START }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const expectedLayout = columnLayout({ width: 100, height: 200 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("column cross axis alignment start geometry", () => {
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.START }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedGeometry = columnGeometry({ x: 0, y: 0 }, [
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
            position: { x: 0, y: 50 },
            vertices: [
                0, 50,
                0, 150,
                100, 50,
                100, 150,
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
        }),
        containerGeometry({
            position: { x: 0, y: 150 },
            vertices: [
                0, 150,
                0, 200,
                50, 150,
                50, 200,
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
            ]
        })
    ])
    expect(geometry).toEqual(expectedGeometry)
})

test("column cross axis alignment center layout", () => {
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const expectedLayout = columnLayout({ width: 100, height: 200 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("column cross axis alignment center geometry", () => {
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedGeometry = columnGeometry({ x: 0, y: 0 }, [
        containerGeometry({
            position: { x: 25, y: 0 },
            vertices: [
                25, 0,
                25, 50,
                75, 0,
                75, 50,
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
            position: { x: 0, y: 50 },
            vertices: [
                0, 50,
                0, 150,
                100, 50,
                100, 150,
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
        }),
        containerGeometry({
            position: { x: 25, y: 150 },
            vertices: [
                25, 150,
                25, 200,
                75, 150,
                75, 200,
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
            ]
        })
    ])
    expect(geometry).toEqual(expectedGeometry)
})

test("column cross axis alignment end layout", () => {
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.END }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const expectedLayout = columnLayout({ width: 100, height: 200 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("column cross axis alignment end geometry", () => {
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.END }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedGeometry = columnGeometry({ x: 0, y: 0 }, [
        containerGeometry({
            position: { x: 50, y: 0 },
            vertices: [
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
            ],
            vertexIndices: [
                0, 1, 2,
                1, 2, 3
            ]
        }),
        containerGeometry({
            position: { x: 0, y: 50 },
            vertices: [
                0, 50,
                0, 150,
                100, 50,
                100, 150,
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
        }),
        containerGeometry({
            position: { x: 50, y: 150 },
            vertices: [
                50, 150,
                50, 200,
                100, 150,
                100, 200,
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
            ]
        })
    ])
    expect(geometry).toEqual(expectedGeometry)
})

test("column main axis alignment start layout", () => {
    const ui = column({ mainAxisAlignment: MainAxisAlignment.START }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const expectedLayout = columnLayout({ width: 100, height: 200 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("column main axis alignment start geometry", () => {
    const ui = column({ mainAxisAlignment: MainAxisAlignment.START }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedGeometry = columnGeometry({ x: 0, y: 0 }, [
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
            position: { x: 0, y: 50 },
            vertices: [
                0, 50,
                0, 150,
                100, 50,
                100, 150,
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
        }),
        containerGeometry({
            position: { x: 0, y: 150 },
            vertices: [
                0, 150,
                0, 200,
                50, 150,
                50, 200,
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
            ]
        })
    ])
    expect(geometry).toEqual(expectedGeometry)
})

test("column main axis alignment center layout", () => {
    const ui = column({ mainAxisAlignment: MainAxisAlignment.CENTER }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const expectedLayout = columnLayout({ width: 100, height: 500 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("column main axis alignment center geometry", () => {
    const ui = column({ mainAxisAlignment: MainAxisAlignment.CENTER }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedGeometry = columnGeometry({ x: 0, y: 0 }, [
        containerGeometry({
            position: { x: 0, y: 150 },
            vertices: [
                0, 150,
                0, 200,
                50, 150,
                50, 200,
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
            position: { x: 0, y: 200 },
            vertices: [
                0, 200,
                0, 300,
                100, 200,
                100, 300,
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
        }),
        containerGeometry({
            position: { x: 0, y: 300 },
            vertices: [
                0, 300,
                0, 350,
                50, 300,
                50, 350,
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
            ]
        })
    ])
    expect(geometry).toEqual(expectedGeometry)
})

test("column main axis alignment end layout", () => {
    const ui = column({ mainAxisAlignment: MainAxisAlignment.END }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const expectedLayout = columnLayout({ width: 100, height: 500 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("column main axis alignment end geometry", () => {
    const ui = column({ mainAxisAlignment: MainAxisAlignment.END }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedGeometry = columnGeometry({ x: 0, y: 0 }, [
        containerGeometry({
            position: { x: 0, y: 300 },
            vertices: [
                0, 300,
                0, 350,
                50, 300,
                50, 350,
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
            position: { x: 0, y: 350 },
            vertices: [
                0, 350,
                0, 450,
                100, 350,
                100, 450,
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
        }),
        containerGeometry({
            position: { x: 0, y: 450 },
            vertices: [
                0, 450,
                0, 500,
                50, 450,
                50, 500,
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
            ]
        })
    ])
    expect(geometry).toEqual(expectedGeometry)
})

test("column main axis alignment space between layout", () => {
    const ui = column({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const expectedLayout = columnLayout({ width: 100, height: 500 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("column main axis alignment space between geometry", () => {
    const ui = column({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedGeometry = columnGeometry({ x: 0, y: 0 }, [
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
            position: { x: 0, y: 200 },
            vertices: [
                0, 200,
                0, 300,
                100, 200,
                100, 300,
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
        }),
        containerGeometry({
            position: { x: 0, y: 450 },
            vertices: [
                0, 450,
                0, 500,
                50, 450,
                50, 500,
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
            ]
        })
    ])
    expect(geometry).toEqual(expectedGeometry)
})

test("column main axis alignment space evenly layout", () => {
    const ui = column({ mainAxisAlignment: MainAxisAlignment.SPACE_EVENLY }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const expectedLayout = columnLayout({ width: 100, height: 500 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("column main axis alignment space evenly geometry", () => {
    const ui = column({ mainAxisAlignment: MainAxisAlignment.SPACE_EVENLY }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    const constraints = { minWidth: 0, maxWidth: 500, minHeight: 0, maxHeight: 500 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedGeometry = columnGeometry({ x: 0, y: 0 }, [
        containerGeometry({
            position: { x: 0, y: 75 },
            vertices: [
                0, 75,
                0, 125,
                50, 75,
                50, 125,
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
            position: { x: 0, y: 200 },
            vertices: [
                0, 200,
                0, 300,
                100, 200,
                100, 300,
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
        }),
        containerGeometry({
            position: { x: 0, y: 375 },
            vertices: [
                0, 375,
                0, 425,
                50, 375,
                50, 425,
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
            ]
        })
    ])
    expect(geometry).toEqual(expectedGeometry)
})
