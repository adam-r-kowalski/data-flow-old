import { Layers } from "./layerGeometry";

interface Batch {
    vertices: number[]
    colors: number[]
    vertexIndices: number[]
}

export const batchGeometry = (layers: Layers) => {
    const batch: Batch = {
        vertices: [],
        colors: [],
        vertexIndices: []
    }
    for (const layer of layers) {
        for (const geometry of layer) {
            batch.vertices.push(...geometry.vertices)
            batch.colors.push(...geometry.colors)
            batch.vertexIndices.push(...geometry.vertexIndices)
        }
    }
    return [batch]
}