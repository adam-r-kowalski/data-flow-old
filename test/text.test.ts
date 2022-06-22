import { mockMeasureText } from '../src/renderer/mock'
import { text, textGeometry, textLayout } from '../src/ui/text'

test("text layout", () => {
    const ui = text("abc")
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const measurements = {
        widths: [24, 24, 24],
        textureIndex: 1,
        textureCoordinates: [
            [
                0, 0,
                0, 1,
                1, 0,
                1, 1,
            ], [
                1, 0,
                1, 1,
                2, 0,
                2, 1,
            ], [
                2, 0,
                2, 1,
                3, 0,
                3, 1,
            ]

        ]
    }
    const expectedLayout = textLayout(measurements, { width: 24 * 3, height: 24 })
    expect(layout).toEqual(expectedLayout)
})

test("text geometry", () => {
    const ui = text("abc")
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const offset = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offset)
    const expectedGeometry = textGeometry({
        position: { x: 0, y: 0 },
        textureIndex: 1,
        textureCoordinates: [
            0, 0,
            0, 1,
            1, 0,
            1, 1,

            1, 0,
            1, 1,
            2, 0,
            2, 1,

            2, 0,
            2, 1,
            3, 0,
            3, 1,
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
    })
    expect(geometry).toEqual(expectedGeometry)
})