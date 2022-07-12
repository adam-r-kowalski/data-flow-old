import { text, layout, geometry } from '../../src/new_ui'
import { initCameraStack } from '../../src/new_ui/camera_stack'
import * as layerGeometry from '../../src/new_ui/layer_geometry'
import { reduce } from '../../src/new_ui/reduce'
import { mockDocument, mockWindow } from '../../src/renderer/mock'
import { webGL2Renderer } from '../../src/renderer/webgl2'

const mockRenderer = () => webGL2Renderer({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow()
})

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
