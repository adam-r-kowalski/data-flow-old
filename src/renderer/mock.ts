import { Batch } from "../batchGeometry"
import { Size } from "../layout"
import { Font, TextMeasurements } from "../ui"

export const mockMeasureText = (font: Font, str: string): TextMeasurements => {
    const textureCoordinates: number[] = []
    let offset = 0
    for (const _ of str) {
        textureCoordinates.push(
            offset + 0, 0,
            offset + 0, 1,
            offset + 1, 0,
            offset + 1, 1,
        )
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
        public clearCount: number,
        public batches: Batch[]
    ) { }

    clear() {
        this.clearCount += 1
    }

    draw(batch: Batch) {
        this.batches.push(batch)
    }

    measureText(font: Font, str: string) {
        return mockMeasureText(font, str)
    }
}

export const mockRenderer = (size: Size) => {
    return new MockRenderer(size, 0, [])
}