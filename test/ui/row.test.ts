import { container, row, layout, geometry } from "../../src/ui"
import { batchGeometry } from "../../src/ui/batch_geometry"
import { initCameraStack } from "../../src/ui/camera_stack"
import * as layerGeometry from "../../src/ui/layer_geometry"
import * as reducer from "../../src/ui/reducer"
import { reduce } from "../../src/ui/reduce"
import { mockDocument, mockWindow } from "../../src/ui/mock"
import { webGL2Renderer } from "../../src/ui/webgl2"
import { CrossAxisAlignment, MainAxisAlignment } from "../../src/ui/alignment"

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }
const blue = { red: 0, green: 0, blue: 255, alpha: 255 }

const mockRenderer = () =>
    webGL2Renderer({
        width: 500,
        height: 500,
        document: mockDocument(),
        window: mockWindow(),
    })

test("row layout", () => {
    const renderer = mockRenderer()
    const ui = row([
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 100, height: 50 },
        totalChildWidth: 100,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("row geometry", () => {
    const renderer = mockRenderer()
    const ui = row([
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 100, y1: 50 },
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
                worldSpace: { x0: 50, y0: 0, x1: 100, y1: 50 },
                vertices: [50, 0, 50, 50, 100, 0, 100, 50],
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

test("row layers", () => {
    const renderer = mockRenderer()
    const ui = row([
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
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
                    worldSpace: { x0: 50, y0: 0, x1: 100, y1: 50 },
                    vertices: [50, 0, 50, 50, 100, 0, 100, 50],
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

test("row batch", () => {
    const renderer = mockRenderer()
    const ui = row([
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const { layers, connections, idToWorldSpace } = reduce(
        ui,
        uiLayout,
        uiGeometry,
        reducer
    )
    const batches = batchGeometry(layers, connections, idToWorldSpace)
    const expectedBatches = [
        {
            triangles: {
                vertices: [
                    0, 0, 0, 50, 50, 0, 50, 50,

                    50, 0, 50, 50, 100, 0, 100, 50,
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

test("row cross axis alignment start layout", () => {
    const renderer = mockRenderer()
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.START }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 200, height: 100 },
        totalChildWidth: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("row cross axis alignment start geometry", () => {
    const renderer = mockRenderer()
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.START }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 200, y1: 100 },
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
                worldSpace: { x0: 50, y0: 0, x1: 150, y1: 100 },
                vertices: [50, 0, 50, 100, 150, 0, 150, 100],
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
                worldSpace: { x0: 150, y0: 0, x1: 200, y1: 50 },
                vertices: [150, 0, 150, 50, 200, 0, 200, 50],
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

test("row cross axis alignment center layout", () => {
    const renderer = mockRenderer()
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 200, height: 100 },
        totalChildWidth: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("row cross axis alignment center geometry", () => {
    const renderer = mockRenderer()
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 200, y1: 100 },
        children: [
            {
                worldSpace: { x0: 0, y0: 25, x1: 50, y1: 75 },
                vertices: [0, 25, 0, 75, 50, 25, 50, 75],
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
                worldSpace: { x0: 50, y0: 0, x1: 150, y1: 100 },
                vertices: [50, 0, 50, 100, 150, 0, 150, 100],
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
                worldSpace: { x0: 150, y0: 25, x1: 200, y1: 75 },
                vertices: [150, 25, 150, 75, 200, 25, 200, 75],
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

test("row cross axis alignment end layout", () => {
    const renderer = mockRenderer()
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.END }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 200, height: 100 },
        totalChildWidth: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("row cross axis alignment end geometry", () => {
    const renderer = mockRenderer()
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.END }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 200, y1: 100 },
        children: [
            {
                worldSpace: { x0: 0, y0: 50, x1: 50, y1: 100 },
                vertices: [0, 50, 0, 100, 50, 50, 50, 100],
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
                worldSpace: { x0: 50, y0: 0, x1: 150, y1: 100 },
                vertices: [50, 0, 50, 100, 150, 0, 150, 100],
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
                worldSpace: { x0: 150, y0: 50, x1: 200, y1: 100 },
                vertices: [150, 50, 150, 100, 200, 50, 200, 100],
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

test("row main axis alignment start layout", () => {
    const renderer = mockRenderer()
    const ui = row({ mainAxisAlignment: MainAxisAlignment.START }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 200, height: 100 },
        totalChildWidth: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("row main axis alignment start geometry", () => {
    const renderer = mockRenderer()
    const ui = row({ mainAxisAlignment: MainAxisAlignment.START }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 200, y1: 100 },
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
                worldSpace: { x0: 50, y0: 0, x1: 150, y1: 100 },
                vertices: [50, 0, 50, 100, 150, 0, 150, 100],
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
                worldSpace: { x0: 150, y0: 0, x1: 200, y1: 50 },
                vertices: [150, 0, 150, 50, 200, 0, 200, 50],
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

test("row main axis alignment center layout", () => {
    const renderer = mockRenderer()
    const ui = row({ mainAxisAlignment: MainAxisAlignment.CENTER }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 500, height: 100 },
        totalChildWidth: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("row main axis alignment center geometry", () => {
    const renderer = mockRenderer()
    const ui = row({ mainAxisAlignment: MainAxisAlignment.CENTER }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 500, y1: 100 },
        children: [
            {
                worldSpace: { x0: 150, y0: 0, x1: 200, y1: 50 },
                vertices: [150, 0, 150, 50, 200, 0, 200, 50],
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
                worldSpace: { x0: 200, y0: 0, x1: 300, y1: 100 },
                vertices: [200, 0, 200, 100, 300, 0, 300, 100],
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
                worldSpace: { x0: 300, y0: 0, x1: 350, y1: 50 },
                vertices: [300, 0, 300, 50, 350, 0, 350, 50],
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

test("row main axis alignment end layout", () => {
    const renderer = mockRenderer()
    const ui = row({ mainAxisAlignment: MainAxisAlignment.END }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 500, height: 100 },
        totalChildWidth: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("row main axis alignment end geometry", () => {
    const renderer = mockRenderer()
    const ui = row({ mainAxisAlignment: MainAxisAlignment.END }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 500, y1: 100 },
        children: [
            {
                worldSpace: { x0: 300, y0: 0, x1: 350, y1: 50 },
                vertices: [300, 0, 300, 50, 350, 0, 350, 50],
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
                worldSpace: { x0: 350, y0: 0, x1: 450, y1: 100 },
                vertices: [350, 0, 350, 100, 450, 0, 450, 100],
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
                worldSpace: { x0: 450, y0: 0, x1: 500, y1: 50 },
                vertices: [450, 0, 450, 50, 500, 0, 500, 50],
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

test("row main axis alignment space between layout", () => {
    const renderer = mockRenderer()
    const ui = row({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 500, height: 100 },
        totalChildWidth: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("row main axis alignment space between geometry", () => {
    const renderer = mockRenderer()
    const ui = row({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 500, y1: 100 },
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
                worldSpace: { x0: 200, y0: 0, x1: 300, y1: 100 },
                vertices: [200, 0, 200, 100, 300, 0, 300, 100],
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
                worldSpace: { x0: 450, y0: 0, x1: 500, y1: 50 },
                vertices: [450, 0, 450, 50, 500, 0, 500, 50],
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

test("row main axis alignment space evenly layout", () => {
    const renderer = mockRenderer()
    const ui = row({ mainAxisAlignment: MainAxisAlignment.SPACE_EVENLY }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 500, height: 100 },
        totalChildWidth: 200,
        children: [
            { size: { width: 50, height: 50 } },
            { size: { width: 100, height: 100 } },
            { size: { width: 50, height: 50 } },
        ],
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("row main axis alignment space evenly geometry", () => {
    const renderer = mockRenderer()
    const ui = row({ mainAxisAlignment: MainAxisAlignment.SPACE_EVENLY }, [
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
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 500, y1: 100 },
        children: [
            {
                worldSpace: { x0: 75, y0: 0, x1: 125, y1: 50 },
                vertices: [75, 0, 75, 50, 125, 0, 125, 50],
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
                worldSpace: { x0: 200, y0: 0, x1: 300, y1: 100 },
                vertices: [200, 0, 200, 100, 300, 0, 300, 100],
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
                worldSpace: { x0: 375, y0: 0, x1: 425, y1: 50 },
                vertices: [375, 0, 375, 50, 425, 0, 425, 50],
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
