import { Layers } from "./layerGeometry";

export interface Batch {
    vertices: number[]
    colors: number[]
    vertexIndices: number[]
}

export const batchGeometry = (layers: Layers): Batch[] => {
    const batch: Batch = {
        vertices: [],
        colors: [],
        vertexIndices: []
    }
    for (const layer of layers) {
        for (const geometry of layer) {
            const offset = batch.vertices.length / 2
            batch.vertices.push(...geometry.vertices)
            batch.colors.push(...geometry.colors)
            for (const index of geometry.vertexIndices) {
                batch.vertexIndices.push(index + offset)
            }
        }
    }
    return [batch]
}