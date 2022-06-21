import { MeasureText, Font } from "."
import { Color, rgba } from "../color"
import { Constraints, Size } from "../layout"

export class TextLayout {
    constructor(readonly size: Size) { }
}

export const textLayout = (size: Size) =>
    new TextLayout(size)

export class Text {
    constructor(
        readonly font: Font,
        readonly color: Color,
        readonly str: string
    ) { }

    layout(_: Constraints, measureText: MeasureText) {
        const { font, str } = this
        return textLayout(measureText(font, str))
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