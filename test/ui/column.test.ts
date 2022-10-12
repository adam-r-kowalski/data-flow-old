import { container, column, layout, geometry } from "../../src/ui"
import { CrossAxisAlignment, MainAxisAlignment } from "../../src/ui/alignment"
import { Batch, batchGeometry } from "../../src/ui/batch_geometry"
import { initCameraStack } from "../../src/ui/camera_stack"
import * as layerGeometry from "../../src/ui/layer_geometry"
import * as reducer from "../../src/ui/reducer"
import { reduce } from "../../src/ui/reduce"
import { mockDocument, mockWindow } from "../../src/ui/mock"
import { makeRenderer, measureText } from "../../src/ui/renderer"

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }
const blue = { red: 0, green: 0, blue: 255, alpha: 255 }

const mockRenderer = () =>
    makeRenderer({
        width: 500,
        height: 500,
        document: mockDocument(),
        window: mockWindow(),
    })

test("column layout", () => {
    const renderer = mockRenderer()
    const ui = column([
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 50,
            height: 50,
            color: green,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 100,
        minHeight: 0,
        maxHeight: 100,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const expectedLayout = {
        size: { width: 50, height: 100 },
        totalChildHeight: 100,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("column geometry", () => {
    const renderer = mockRenderer()
    const ui = column([
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 50,
            height: 50,
            color: green,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 100,
        minHeight: 0,
        maxHeight: 100,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 50, y1: 100 },
        children: [
            {
                worldSpace: { x0: 0, y0: 0, x1: 50, y1: 50 },
                vertices: [0, 0, 0, 50, 50, 0, 50, 50],
                colors: [
                    255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 50, x1: 50, y1: 100 },
                vertices: [0, 50, 0, 100, 50, 50, 50, 100],
                colors: [
                    0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
        ],
    }
    expect(uiGeometry).toEqual(expectedGeometry)
})

test("column layers", () => {
    const renderer = mockRenderer()
    const ui = column([
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 50,
            height: 50,
            color: green,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 100,
        minHeight: 0,
        maxHeight: 100,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const layers = reduce(ui, uiLayout, uiGeometry, layerGeometry)
    const expectedLayers = [
        {},
        {
            0: [
                {
                    worldSpace: { x0: 0, y0: 0, x1: 50, y1: 50 },
                    vertices: [0, 0, 0, 50, 50, 0, 50, 50],
                    colors: [
                        255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0,
                        0, 255,
                    ],
                    vertexIndices: [0, 1, 2, 1, 2, 3],
                    cameraIndex: Array(4).fill(0),
                    textureIndex: 0,
                    textureCoordinates: Array(8).fill(0),
                },
                {
                    worldSpace: { x0: 0, y0: 50, x1: 50, y1: 100 },
                    vertices: [0, 50, 0, 100, 50, 50, 50, 100],
                    colors: [
                        0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255,
                        0, 255,
                    ],
                    vertexIndices: [0, 1, 2, 1, 2, 3],
                    cameraIndex: Array(4).fill(0),
                    textureIndex: 0,
                    textureCoordinates: Array(8).fill(0),
                },
            ],
        },
    ]
    expect(layers).toEqual(expectedLayers)
})

test("column batch", () => {
    const renderer = mockRenderer()
    const ui = column([
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 50,
            height: 50,
            color: green,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 100,
        minHeight: 0,
        maxHeight: 100,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const { layers, connections, idToWorldSpace } = reduce(
        ui,
        uiLayout,
        uiGeometry,
        reducer
    )
    const batches = batchGeometry(layers, connections, idToWorldSpace)
    const expectedBatches: Batch[] = [
        {
            triangles: {
                vertices: [
                    0, 0, 0, 50, 50, 0, 50, 50,

                    0, 50, 0, 100, 50, 50, 50, 100,
                ],
                colors: [
                    255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0,
                    255,

                    0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0,
                    255,
                ],
                vertexIndices: [
                    0, 1, 2, 1, 2, 3,

                    4, 5, 6, 5, 6, 7,
                ],
                textureIndex: 0,
                textureCoordinates: [
                    0, 0, 0, 0, 0, 0, 0, 0,

                    0, 0, 0, 0, 0, 0, 0, 0,
                ],
                cameraIndex: Array(8).fill(0),
            },
            lines: {
                vertices: [],
                colors: [],
            },
        },
    ]
    expect(batches).toEqual(expectedBatches)
})

test("column cross axis alignment start layout", () => {
    const renderer = mockRenderer()
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.START }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const expectedLayout = {
        size: { width: 100, height: 200 },
        totalChildHeight: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("column cross axis alignment start geometry", () => {
    const renderer = mockRenderer()
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.START }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 100, y1: 200 },
        children: [
            {
                worldSpace: { x0: 0, y0: 0, x1: 50, y1: 50 },
                vertices: [0, 0, 0, 50, 50, 0, 50, 50],
                colors: [
                    255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 50, x1: 100, y1: 150 },
                vertices: [0, 50, 0, 150, 100, 50, 100, 150],
                colors: [
                    0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 150, x1: 50, y1: 200 },
                vertices: [0, 150, 0, 200, 50, 150, 50, 200],
                colors: [
                    0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
        ],
    }
    expect(uiGeometry).toEqual(expectedGeometry)
})

test("column cross axis alignment center layout", () => {
    const renderer = mockRenderer()
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const expectedLayout = {
        size: { width: 100, height: 200 },
        totalChildHeight: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("column cross axis alignment center geometry", () => {
    const renderer = mockRenderer()
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 100, y1: 200 },
        children: [
            {
                worldSpace: { x0: 25, y0: 0, x1: 75, y1: 50 },
                vertices: [25, 0, 25, 50, 75, 0, 75, 50],
                colors: [
                    255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 50, x1: 100, y1: 150 },
                vertices: [0, 50, 0, 150, 100, 50, 100, 150],
                colors: [
                    0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 25, y0: 150, x1: 75, y1: 200 },
                vertices: [25, 150, 25, 200, 75, 150, 75, 200],
                colors: [
                    0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
        ],
    }
    expect(uiGeometry).toEqual(expectedGeometry)
})

test("column cross axis alignment end layout", () => {
    const renderer = mockRenderer()
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.END }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const expectedLayout = {
        size: { width: 100, height: 200 },
        totalChildHeight: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("column cross axis alignment end geometry", () => {
    const renderer = mockRenderer()
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.END }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 100, y1: 200 },
        children: [
            {
                worldSpace: { x0: 50, y0: 0, x1: 100, y1: 50 },
                vertices: [50, 0, 50, 50, 100, 0, 100, 50],
                colors: [
                    255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 50, x1: 100, y1: 150 },
                vertices: [0, 50, 0, 150, 100, 50, 100, 150],
                colors: [
                    0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 50, y0: 150, x1: 100, y1: 200 },
                vertices: [50, 150, 50, 200, 100, 150, 100, 200],
                colors: [
                    0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
        ],
    }
    expect(uiGeometry).toEqual(expectedGeometry)
})

test("column main axis alignment start layout", () => {
    const renderer = mockRenderer()
    const ui = column({ mainAxisAlignment: MainAxisAlignment.START }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const expectedLayout = {
        size: { width: 100, height: 200 },
        totalChildHeight: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("column main axis alignment start geometry", () => {
    const renderer = mockRenderer()
    const ui = column({ mainAxisAlignment: MainAxisAlignment.START }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 100, y1: 200 },
        children: [
            {
                worldSpace: { x0: 0, y0: 0, x1: 50, y1: 50 },
                vertices: [0, 0, 0, 50, 50, 0, 50, 50],
                colors: [
                    255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 50, x1: 100, y1: 150 },
                vertices: [0, 50, 0, 150, 100, 50, 100, 150],
                colors: [
                    0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 150, x1: 50, y1: 200 },
                vertices: [0, 150, 0, 200, 50, 150, 50, 200],
                colors: [
                    0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
        ],
    }
    expect(uiGeometry).toEqual(expectedGeometry)
})

test("column main axis alignment center layout", () => {
    const renderer = mockRenderer()
    const ui = column({ mainAxisAlignment: MainAxisAlignment.CENTER }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const expectedLayout = {
        size: { width: 100, height: 500 },
        totalChildHeight: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("column main axis alignment center geometry", () => {
    const renderer = mockRenderer()
    const ui = column({ mainAxisAlignment: MainAxisAlignment.CENTER }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 100, y1: 500 },
        children: [
            {
                worldSpace: { x0: 0, y0: 150, x1: 50, y1: 200 },
                vertices: [0, 150, 0, 200, 50, 150, 50, 200],
                colors: [
                    255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 200, x1: 100, y1: 300 },
                vertices: [0, 200, 0, 300, 100, 200, 100, 300],
                colors: [
                    0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 300, x1: 50, y1: 350 },
                vertices: [0, 300, 0, 350, 50, 300, 50, 350],
                colors: [
                    0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
        ],
    }
    expect(uiGeometry).toEqual(expectedGeometry)
})

test("column main axis alignment end layout", () => {
    const renderer = mockRenderer()
    const ui = column({ mainAxisAlignment: MainAxisAlignment.END }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const expectedLayout = {
        size: { width: 100, height: 500 },
        totalChildHeight: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("column main axis alignment end geometry", () => {
    const renderer = mockRenderer()
    const ui = column({ mainAxisAlignment: MainAxisAlignment.END }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 100, y1: 500 },
        children: [
            {
                worldSpace: { x0: 0, y0: 300, x1: 50, y1: 350 },
                vertices: [0, 300, 0, 350, 50, 300, 50, 350],
                colors: [
                    255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 350, x1: 100, y1: 450 },
                vertices: [0, 350, 0, 450, 100, 350, 100, 450],
                colors: [
                    0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 450, x1: 50, y1: 500 },
                vertices: [0, 450, 0, 500, 50, 450, 50, 500],
                colors: [
                    0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
        ],
    }
    expect(uiGeometry).toEqual(expectedGeometry)
})

test("column main axis alignment space between layout", () => {
    const renderer = mockRenderer()
    const ui = column({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const expectedLayout = {
        size: { width: 100, height: 500 },
        totalChildHeight: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("column main axis alignment space between geometry", () => {
    const renderer = mockRenderer()
    const ui = column({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 100, y1: 500 },
        children: [
            {
                worldSpace: { x0: 0, y0: 0, x1: 50, y1: 50 },
                vertices: [0, 0, 0, 50, 50, 0, 50, 50],
                colors: [
                    255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 200, x1: 100, y1: 300 },
                vertices: [0, 200, 0, 300, 100, 200, 100, 300],
                colors: [
                    0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 450, x1: 50, y1: 500 },
                vertices: [0, 450, 0, 500, 50, 450, 50, 500],
                colors: [
                    0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
        ],
    }
    expect(uiGeometry).toEqual(expectedGeometry)
})

test("column main axis alignment space evenly layout", () => {
    const renderer = mockRenderer()
    const ui = column({ mainAxisAlignment: MainAxisAlignment.SPACE_EVENLY }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const expectedLayout = {
        size: { width: 100, height: 500 },
        totalChildHeight: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("column main axis alignment space evenly geometry", () => {
    const renderer = mockRenderer()
    const ui = column({ mainAxisAlignment: MainAxisAlignment.SPACE_EVENLY }, [
        container({
            width: 50,
            height: 50,
            color: red,
        }),
        container({
            width: 100,
            height: 100,
            color: green,
        }),
        container({
            width: 50,
            height: 50,
            color: blue,
        }),
    ])
    const constraints = {
        minWidth: 0,
        maxWidth: 500,
        minHeight: 0,
        maxHeight: 500,
    }
    const uiLayout = layout(ui, constraints, measureText.bind(null, renderer))
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 100, y1: 500 },
        children: [
            {
                worldSpace: { x0: 0, y0: 75, x1: 50, y1: 125 },
                vertices: [0, 75, 0, 125, 50, 75, 50, 125],
                colors: [
                    255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 200, x1: 100, y1: 300 },
                vertices: [0, 200, 0, 300, 100, 200, 100, 300],
                colors: [
                    0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
            {
                worldSpace: { x0: 0, y0: 375, x1: 50, y1: 425 },
                vertices: [0, 375, 0, 425, 50, 375, 50, 425],
                colors: [
                    0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255,
                    255,
                ],
                vertexIndices: [0, 1, 2, 1, 2, 3],
                cameraIndex: Array(4).fill(0),
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
            },
        ],
    }
    expect(uiGeometry).toEqual(expectedGeometry)
})
