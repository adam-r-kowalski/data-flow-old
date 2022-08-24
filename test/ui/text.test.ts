import { text, layout, geometry, container } from '../../src/ui'
import { initCameraStack } from '../../src/ui/camera_stack'
import * as layerGeometry from '../../src/ui/layer_geometry'
import * as reducer from '../../src/ui/reducer'
import { reduce } from '../../src/ui/reduce'
import { mockDocument, mockWindow } from '../../src/ui/mock'
import { WebGL2Renderer, webGL2Renderer } from '../../src/ui/webgl2'
import { batchGeometry } from '../../src/ui/batch_geometry'


const mockRenderer = <T>() => webGL2Renderer<T>({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow()
}) as WebGL2Renderer<T>

test("text layout", () => {
    const renderer = mockRenderer()
    const ui = text({ size: 24 }, "abc")
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        measurements: {
            widths: [24, 24, 24],
            textureIndex: 1,
            textureCoordinates: [
                [
                    0.0625,
                    0.375,
                    0.0625,
                    0.421875,
                    0.109375,
                    0.375,
                    0.109375,
                    0.421875,
                ], [
                    0.125,
                    0.375,
                    0.125,
                    0.421875,
                    0.171875,
                    0.375,
                    0.171875,
                    0.421875,
                ], [
                    0.1875,
                    0.375,
                    0.1875,
                    0.421875,
                    0.234375,
                    0.375,
                    0.234375,
                    0.421875,
                ]
            ]
        },
        size: { width: 24 * 3, height: 24 }
    }
    expect(uiLayout).toEqual(expectedLayout)
})

test("text layout with empty text", () => {
    const renderer = mockRenderer()
    const ui = text({ size: 24 }, "")
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        measurements: {
            widths: [],
            textureIndex: 1,
            textureCoordinates: []
        },
        size: { width: 0, height: 24 }
    }
    expect(uiLayout).toEqual(expectedLayout)
})


test("text geometry", () => {
    const renderer = mockRenderer()
    const ui = text({ size: 24 }, "abc")
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offset = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offset, initCameraStack())
    const expectedGeometry = {
        worldSpace: { x0: 0, y0: 0, x1: 24 * 3, y1: 24 },
        textureIndex: 1,
        textureCoordinates: [
            0.0625,
            0.375,
            0.0625,
            0.421875,
            0.109375,
            0.375,
            0.109375,
            0.421875,

            0.125,
            0.375,
            0.125,
            0.421875,
            0.171875,
            0.375,
            0.171875,
            0.421875,

            0.1875,
            0.375,
            0.1875,
            0.421875,
            0.234375,
            0.375,
            0.234375,
            0.421875,
        ],
        colors: [
            255, 255, 255, 255,
            255, 255, 255, 255,
            255, 255, 255, 255,
            255, 255, 255, 255,

            255, 255, 255, 255,
            255, 255, 255, 255,
            255, 255, 255, 255,
            255, 255, 255, 255,

            255, 255, 255, 255,
            255, 255, 255, 255,
            255, 255, 255, 255,
            255, 255, 255, 255,
        ],
        vertices: [
            0, 0,
            0, 24,
            24, 0,
            24, 24,

            24, 0,
            24, 24,
            24 * 2, 0,
            24 * 2, 24,

            24 * 2, 0,
            24 * 2, 24,
            24 * 3, 0,
            24 * 3, 24,
        ],
        vertexIndices: [
            0, 1, 2,
            1, 2, 3,

            4, 5, 6,
            5, 6, 7,

            8, 9, 10,
            9, 10, 11,
        ],
        cameraIndex: Array(12).fill(0)
    }
    expect(uiGeometry).toEqual(expectedGeometry)
})

test("text layers", () => {
    const renderer = mockRenderer()
    const ui = text({ size: 24 }, "abc")
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const layers = reduce(ui, uiLayout, uiGeometry, layerGeometry)
    const expectedLayers = [
        {
            1: [
                {
                    worldSpace: { x0: 0, y0: 0, x1: 24 * 3, y1: 24 },
                    textureIndex: 1,
                    textureCoordinates: [
                        0.0625,
                        0.375,
                        0.0625,
                        0.421875,
                        0.109375,
                        0.375,
                        0.109375,
                        0.421875,

                        0.125,
                        0.375,
                        0.125,
                        0.421875,
                        0.171875,
                        0.375,
                        0.171875,
                        0.421875,

                        0.1875,
                        0.375,
                        0.1875,
                        0.421875,
                        0.234375,
                        0.375,
                        0.234375,
                        0.421875,
                    ],
                    colors: [
                        255, 255, 255, 255,
                        255, 255, 255, 255,
                        255, 255, 255, 255,
                        255, 255, 255, 255,

                        255, 255, 255, 255,
                        255, 255, 255, 255,
                        255, 255, 255, 255,
                        255, 255, 255, 255,

                        255, 255, 255, 255,
                        255, 255, 255, 255,
                        255, 255, 255, 255,
                        255, 255, 255, 255,
                    ],
                    vertices: [
                        0, 0,
                        0, 24,
                        24, 0,
                        24, 24,

                        24, 0,
                        24, 24,
                        24 * 2, 0,
                        24 * 2, 24,

                        24 * 2, 0,
                        24 * 2, 24,
                        24 * 3, 0,
                        24 * 3, 24,
                    ],
                    vertexIndices: [
                        0, 1, 2,
                        1, 2, 3,

                        4, 5, 6,
                        5, 6, 7,

                        8, 9, 10,
                        9, 10, 11,
                    ],
                    cameraIndex: Array(12).fill(0)
                }

            ]
        }
    ]
    expect(layers).toEqual(expectedLayers)
})


test("batch geometry with texture change", () => {
    const renderer = mockRenderer()
    const ui = container({
        width: 50,
        height: 50,
        color: { red: 255, green: 0, blue: 0, alpha: 255 }
    }, text({ size: 24 },
        "abc"))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const { layers, idToWorldSpace, connections } = reduce(ui, uiLayout, uiGeometry, reducer)
    const batches = batchGeometry(layers, connections, idToWorldSpace)
    expect(batches).toEqual([
        {
            triangles: {
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
                    1, 2, 3,
                ],
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
                cameraIndex: Array(4).fill(0),
            },
            lines: {
                vertices: [],
                colors: [],
            },
        },
        {
            triangles: {
                vertices: [
                    0, 0,
                    0, 24,
                    24, 0,
                    24, 24,
                    24, 0,
                    24, 24,
                    48, 0,
                    48, 24,
                    48, 0,
                    48, 24,
                    72, 0,
                    72, 24,
                ],
                colors: [
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                ],
                vertexIndices: [
                    0, 1, 2,
                    1, 2, 3,
                    4, 5, 6,
                    5, 6, 7,
                    8, 9, 10,
                    9, 10, 11,
                ],
                textureIndex: 1,
                textureCoordinates: [
                    0.0625, 0.375,
                    0.0625, 0.421875,
                    0.109375, 0.375,
                    0.109375, 0.421875,
                    0.125, 0.375,
                    0.125, 0.421875,
                    0.171875, 0.375,
                    0.171875, 0.421875,
                    0.1875, 0.375,
                    0.1875, 0.421875,
                    0.234375, 0.375,
                    0.234375, 0.421875,
                ],
                cameraIndex: Array(12).fill(0),
            },
            lines: {
                vertices: [],
                colors: [],
            },
        },
    ])
})
