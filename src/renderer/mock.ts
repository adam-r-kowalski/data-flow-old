import { Batch } from "../batchGeometry"
import { Size } from "../layout"

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
}

export const mockRenderer = (size: Size) => {
    return new MockRenderer(size, 0, [])
}