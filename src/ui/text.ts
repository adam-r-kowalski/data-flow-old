import { Font, MeasureText, TextMeasurements } from "."
import { Color, rgba } from "../color"
import { Offset, Position } from "../geometry"
import { Constraints, Layout, Size } from "../layout"

export class TextLayout {
    constructor(
        readonly measurements: TextMeasurements,
        readonly size: Size
    ) { }
}

export const textLayout = (measurements: TextMeasurements, size: Size) =>
    new TextLayout(measurements, size)


export class TextGeometry {
    constructor(
        readonly position: Position,
        readonly textureIndex: number,
        readonly textureCoordinates: number[],
        readonly colors: number[],
        readonly vertices: number[],
        readonly vertexIndices: number[],
    ) { }
}

interface GeometryData {
    readonly position: Position
    readonly textureIndex: number
    readonly textureCoordinates: number[]
    readonly colors: number[]
    readonly vertices: number[]
    readonly vertexIndices: number[]
}

const vertices = (widths: number[], height: number) => {
    const result = []
    let offset = 0
    for (const width of widths) {
        result.push(
            offset, 0,
            offset, height,
            offset + width, 0,
            offset + width, height
        )
        offset += width
    }
    return result
}

const colors = (n: number, color: Color) => {
    const result = []
    const { r, g, b, a } = color.rgba()
    for (let i = 0; i < n; ++i) {
        result.push(
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
        )
    }
    return result
}

const vertexIndices = (n: number) => {
    const result = []
    let offset = 0
    for (let i = 0; i < n; ++i) {
        result.push(
            offset, offset + 1, offset + 2,
            offset + 1, offset + 2, offset + 3
        )
        offset += 4
    }
    return result
}

export const textGeometry = (data: GeometryData) =>
    new TextGeometry(
        data.position,
        data.textureIndex,
        data.textureCoordinates,
        data.colors,
        data.vertices,
        data.vertexIndices,
    )

export class Text {
    constructor(
        readonly font: Font,
        readonly color: Color,
        readonly str: string
    ) { }

    layout(_: Constraints, measureText: MeasureText) {
        const { font, str } = this
        const measurements = measureText(font, str)
        const width = measurements.widths.reduce((acc, width) => acc + width)
        const size = { width, height: font.size }
        return textLayout(measurements, size)
    }

    geometry(layout: Layout, offset: Offset) {
        const textLayout = layout as TextLayout
        const { measurements } = textLayout
        const { textureIndex, textureCoordinates, widths } = measurements
        return textGeometry({
            position: { x: offset.x, y: offset.y },
            textureIndex,
            textureCoordinates,
            colors: colors(widths.length, this.color),
            vertices: vertices(widths, this.font.size),
            vertexIndices: vertexIndices(widths.length)
        })

    }
}

interface Properties {
    readonly font?: string
    readonly size?: number
    readonly color?: Color
}

type Overload = {
    (str: String): Text
    (properties: Properties, str: String): Text
}

export const text: Overload = (...args: any[]): Text => {
    const [properties, str] = (() =>
        typeof args[0] == 'string' ? [{}, args[0]] : [args[0], args[1]]
    )()
    const font = {
        family: properties.font ?? "monospace",
        size: properties.size ?? 24
    }
    return new Text(
        font,
        properties.color ?? rgba(255, 255, 255, 255),
        str
    )
}