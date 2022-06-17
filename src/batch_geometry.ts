import { Reducer } from "./reduce"
import { Entry } from "./ui"

interface Batch {
    readonly vertices: number[]
    readonly colors: number[]
    readonly vertexIndices: number[]
}

export const batchGeometry: Reducer<Batch[]> = {
    initial: () => [],
    combine: (accumulator: Batch[], entry: Entry) => {
        const { vertices, colors, vertexIndices } = entry.geometry
        accumulator.push({ vertices, colors, vertexIndices })
        return accumulator
    }
}