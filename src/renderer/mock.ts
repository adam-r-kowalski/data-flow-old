import { Batch } from "../batchGeometry"
import { Size } from "../layout"
import { Font } from "../ui"

export const mockTextWidth = (font: Font, str: string): number[] =>
    Array.from<number>({ length: str.length }).fill(font.size)

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

    textWidth(font: Font, str: string) {
        return mockTextWidth(font, str)
    }
}

export const mockRenderer = (size: Size) => {
    return new MockRenderer(size, 0, [])
}