import { CrossAxisAlignment, MainAxisAlignment } from "../src/alignment"
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
    const expectedLayout = rowLayout({ width: 100, height: 50 }, 100, [
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
                5, 6, 7
            ]
        }
    ]
    expect(batches).toEqual(expectedBatches)
})

test("row cross axis alignment start layout", () => {
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.START }, [
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
    const expectedLayout = rowLayout({ width: 200, height: 100 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("row cross axis alignment start geometry", () => {
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.START }, [
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
                50, 100,
                150, 0,
                150, 100,
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
            position: { x: 150, y: 0 },
            vertices: [
                150, 0,
                150, 50,
                200, 0,
                200, 50,
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

test("row cross axis alignment center layout", () => {
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
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
    const expectedLayout = rowLayout({ width: 200, height: 100 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("row cross axis alignment center geometry", () => {
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
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
    const expectedGeometry = rowGeometry({ x: 0, y: 0 }, [
        containerGeometry({
            position: { x: 0, y: 25 },
            vertices: [
                0, 25,
                0, 75,
                50, 25,
                50, 75,
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
                50, 100,
                150, 0,
                150, 100,
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
            position: { x: 150, y: 25 },
            vertices: [
                150, 25,
                150, 75,
                200, 25,
                200, 75,
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

test("row cross axis alignment end layout", () => {
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.END }, [
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
    const expectedLayout = rowLayout({ width: 200, height: 100 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("row cross axis alignment center geometry", () => {
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.END }, [
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
    const expectedGeometry = rowGeometry({ x: 0, y: 0 }, [
        containerGeometry({
            position: { x: 0, y: 50 },
            vertices: [
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
                50, 100,
                150, 0,
                150, 100,
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
            position: { x: 150, y: 50 },
            vertices: [
                150, 50,
                150, 100,
                200, 50,
                200, 100,
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

test("row cross axis alignment end layout", () => {
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.END }, [
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
    const expectedLayout = rowLayout({ width: 200, height: 100 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("row cross axis alignment end geometry", () => {
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.END }, [
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
    const expectedGeometry = rowGeometry({ x: 0, y: 0 }, [
        containerGeometry({
            position: { x: 0, y: 50 },
            vertices: [
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
                50, 100,
                150, 0,
                150, 100,
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
            position: { x: 150, y: 50 },
            vertices: [
                150, 50,
                150, 100,
                200, 50,
                200, 100,
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

test("row main axis alignment start layout", () => {
    const ui = row({ mainAxisAlignment: MainAxisAlignment.START }, [
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
    const expectedLayout = rowLayout({ width: 200, height: 100 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("row main axis alignment start geometry", () => {
    const ui = row({ mainAxisAlignment: MainAxisAlignment.START }, [
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
                50, 100,
                150, 0,
                150, 100,
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
            position: { x: 150, y: 0 },
            vertices: [
                150, 0,
                150, 50,
                200, 0,
                200, 50,
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

test("row main axis alignment center layout", () => {
    const ui = row({ mainAxisAlignment: MainAxisAlignment.CENTER }, [
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
    const expectedLayout = rowLayout({ width: 500, height: 100 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("row main axis alignment center geometry", () => {
    const ui = row({ mainAxisAlignment: MainAxisAlignment.CENTER }, [
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
    const expectedGeometry = rowGeometry({ x: 0, y: 0 }, [
        containerGeometry({
            position: { x: 150, y: 0 },
            vertices: [
                150, 0,
                150, 50,
                200, 0,
                200, 50,
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
            position: { x: 200, y: 0 },
            vertices: [
                200, 0,
                200, 100,
                300, 0,
                300, 100,
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
            position: { x: 300, y: 0 },
            vertices: [
                300, 0,
                300, 50,
                350, 0,
                350, 50,
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

test("row main axis alignment end layout", () => {
    const ui = row({ mainAxisAlignment: MainAxisAlignment.END }, [
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
    const expectedLayout = rowLayout({ width: 500, height: 100 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("row main axis alignment end geometry", () => {
    const ui = row({ mainAxisAlignment: MainAxisAlignment.END }, [
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
    const expectedGeometry = rowGeometry({ x: 0, y: 0 }, [
        containerGeometry({
            position: { x: 300, y: 0 },
            vertices: [
                300, 0,
                300, 50,
                350, 0,
                350, 50,
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
            position: { x: 350, y: 0 },
            vertices: [
                350, 0,
                350, 100,
                450, 0,
                450, 100,
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
            position: { x: 450, y: 0 },
            vertices: [
                450, 0,
                450, 50,
                500, 0,
                500, 50,
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

test("row main axis alignment space between layout", () => {
    const ui = row({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
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
    const expectedLayout = rowLayout({ width: 500, height: 100 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("row main axis alignment space between geometry", () => {
    const ui = row({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
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
            position: { x: 200, y: 0 },
            vertices: [
                200, 0,
                200, 100,
                300, 0,
                300, 100,
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
            position: { x: 450, y: 0 },
            vertices: [
                450, 0,
                450, 50,
                500, 0,
                500, 50,
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

test("row main axis alignment space evenly layout", () => {
    const ui = row({ mainAxisAlignment: MainAxisAlignment.SPACE_EVENLY }, [
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
    const expectedLayout = rowLayout({ width: 500, height: 100 }, 200, [
        containerLayout({ width: 50, height: 50 }),
        containerLayout({ width: 100, height: 100 }),
        containerLayout({ width: 50, height: 50 }),
    ])
    expect(layout).toEqual(expectedLayout)
})

test("row main axis alignment space evenly geometry", () => {
    const ui = row({ mainAxisAlignment: MainAxisAlignment.SPACE_EVENLY }, [
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
    const expectedGeometry = rowGeometry({ x: 0, y: 0 }, [
        containerGeometry({
            position: { x: 75, y: 0 },
            vertices: [
                75, 0,
                75, 50,
                125, 0,
                125, 50,
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
            position: { x: 200, y: 0 },
            vertices: [
                200, 0,
                200, 100,
                300, 0,
                300, 100,
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
            position: { x: 375, y: 0 },
            vertices: [
                375, 0,
                375, 50,
                425, 0,
                425, 50,
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
