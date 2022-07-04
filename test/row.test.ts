import { CrossAxisAlignment, MainAxisAlignment } from "../src/alignment"
import { batchGeometry } from "../src/renderer/batch_geometry"
import { CameraStack } from "../src/camera_stack"
import { rgba } from "../src/color"
import { reduce } from "../src/reduce"
import { mockMeasureText } from "../src/renderer/mock"
import { layerGeometry } from "../src/renderer/render"
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
    const layout = ui.layout(constraints, mockMeasureText)
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
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets, new CameraStack())
    const expectedGeometry = rowGeometry({ x0: 0, y0: 0, x1: 100, y1: 50 }, [
        containerGeometry({
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
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 50, y0: 0, x1: 100, y1: 50 },
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
            ],
            cameraIndex: Array(4).fill(0)
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
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets, new CameraStack())
    const layers = reduce(ui, layout, geometry, layerGeometry)
    const layer = new Map()
    layer.set(0, [
        containerGeometry({
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
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 50, y0: 0, x1: 100, y1: 50 },
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
            ],
            cameraIndex: Array(4).fill(0)
        })
    ])
    const expectedLayers = [new Map(), layer]
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
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets, new CameraStack())
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
            ],
            cameraIndex: Array(8).fill(0)
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
    const layout = ui.layout(constraints, mockMeasureText)
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
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets, new CameraStack())
    const expectedGeometry = rowGeometry({ x0: 0, y0: 0, x1: 200, y1: 100 }, [
        containerGeometry({
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
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 50, y0: 0, x1: 150, y1: 100 },
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
            ],
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 150, y0: 0, x1: 200, y1: 50 },
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
            ],
            cameraIndex: Array(4).fill(0)
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
    const layout = ui.layout(constraints, mockMeasureText)
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
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets, new CameraStack())
    const expectedGeometry = rowGeometry({ x0: 0, y0: 0, x1: 200, y1: 100 }, [
        containerGeometry({
            worldSpace: { x0: 0, y0: 25, x1: 50, y1: 75 },
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
            ],
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 50, y0: 0, x1: 150, y1: 100 },
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
            ],
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 150, y0: 25, x1: 200, y1: 75 },
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
            ],
            cameraIndex: Array(4).fill(0)
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
    const layout = ui.layout(constraints, mockMeasureText)
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
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets, new CameraStack())
    const expectedGeometry = rowGeometry({ x0: 0, y0: 0, x1: 200, y1: 100 }, [
        containerGeometry({
            worldSpace: { x0: 0, y0: 50, x1: 50, y1: 100 },
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
            ],
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 50, y0: 0, x1: 150, y1: 100 },
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
            ],
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 150, y0: 50, x1: 200, y1: 100 },
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
            ],
            cameraIndex: Array(4).fill(0)
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
    const layout = ui.layout(constraints, mockMeasureText)
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
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets, new CameraStack())
    const expectedGeometry = rowGeometry({ x0: 0, y0: 0, x1: 200, y1: 100 }, [
        containerGeometry({
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
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 50, y0: 0, x1: 150, y1: 100 },
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
            ],
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 150, y0: 0, x1: 200, y1: 50 },
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
            ],
            cameraIndex: Array(4).fill(0)
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
    const layout = ui.layout(constraints, mockMeasureText)
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
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets, new CameraStack())
    const expectedGeometry = rowGeometry({ x0: 0, y0: 0, x1: 500, y1: 100 }, [
        containerGeometry({
            worldSpace: { x0: 150, y0: 0, x1: 200, y1: 50 },
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
            ],
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 200, y0: 0, x1: 300, y1: 100 },
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
            ],
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 300, y0: 0, x1: 350, y1: 50 },
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
            ],
            cameraIndex: Array(4).fill(0)
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
    const layout = ui.layout(constraints, mockMeasureText)
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
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets, new CameraStack())
    const expectedGeometry = rowGeometry({ x0: 0, y0: 0, x1: 500, y1: 100 }, [
        containerGeometry({
            worldSpace: { x0: 300, y0: 0, x1: 350, y1: 50 },
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
            ],
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 350, y0: 0, x1: 450, y1: 100 },
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
            ],
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 450, y0: 0, x1: 500, y1: 50 },
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
            ],
            cameraIndex: Array(4).fill(0)
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
    const layout = ui.layout(constraints, mockMeasureText)
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
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets, new CameraStack())
    const expectedGeometry = rowGeometry({ x0: 0, y0: 0, x1: 500, y1: 100 }, [
        containerGeometry({
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
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 200, y0: 0, x1: 300, y1: 100 },
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
            ],
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 450, y0: 0, x1: 500, y1: 50 },
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
            ],
            cameraIndex: Array(4).fill(0)
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
    const layout = ui.layout(constraints, mockMeasureText)
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
    const layout = ui.layout(constraints, mockMeasureText)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets, new CameraStack())
    const expectedGeometry = rowGeometry({ x0: 0, y0: 0, x1: 500, y1: 100 }, [
        containerGeometry({
            worldSpace: { x0: 75, y0: 0, x1: 125, y1: 50 },
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
            ],
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 200, y0: 0, x1: 300, y1: 100 },
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
            ],
            cameraIndex: Array(4).fill(0)
        }),
        containerGeometry({
            worldSpace: { x0: 375, y0: 0, x1: 425, y1: 50 },
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
            ],
            cameraIndex: Array(4).fill(0)
        })
    ])
    expect(geometry).toEqual(expectedGeometry)
})
