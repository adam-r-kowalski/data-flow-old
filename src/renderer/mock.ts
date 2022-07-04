import { ClickHandlers } from "."
import { Batch } from "./batch_geometry"
import { Size } from "../layout"
import { Font, TextMeasurements } from "../ui"
import { Cameras } from "./render"
import { Lines } from "./connection_geometry"
import { identity } from "../linear_algebra/matrix3x3"

export const mockMeasureText = (font: Font, str: string): TextMeasurements => {
    const textureCoordinates: number[][] = []
    let offset = 0
    for (const _ of str) {
        textureCoordinates.push([
            offset + 0, 0,
            offset + 0, 1,
            offset + 1, 0,
            offset + 1, 1,
        ])
        offset += 1
    }
    return {
        widths: Array.from<number>({ length: str.length }).fill(font.size),
        textureIndex: 1,
        textureCoordinates
    }
}

export class MockRenderer {
    constructor(
        public size: Size,
        public cameras: Cameras,
        public clickHandlers: ClickHandlers,
        public clearCount: number,
        public batches: Batch[],
        public lines: Lines[]
    ) { }

    clear() {
        this.clearCount += 1
    }

    draw(batch: Batch) {
        this.batches.push(batch)
    }

    drawLines(lines: Lines) {
        this.lines.push(lines)
    }

    measureText(font: Font, str: string) {
        return mockMeasureText(font, str)
    }
}

export const mockRenderer = (size: Size) => {
    return new MockRenderer(size, [identity()], [], 0, [], [])
}



export class MockDocument {
}


export const mockDocument = () => {
    return new MockDocument()
}