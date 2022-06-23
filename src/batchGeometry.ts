import { Layers } from "./layerGeometry";

export interface Batch {
    vertices: number[]
    vertexIndices: number[]
    colors: number[]
    textureIndex: number
    textureCoordinates: number[]
}

const newBatch = (textureIndex: number): Batch => ({
    vertices: [],
    colors: [],
    vertexIndices: [],
    textureIndex,
    textureCoordinates: [],
})

export const batchGeometry = (layers: Layers): Batch[] => {
    const batches: Batch[] = []
    let batch = newBatch(0)
    for (const layer of layers) {
        for (const [textureIndex, geometries] of layer) {
            if (batch.textureIndex !== textureIndex) {
                if (batch.vertices.length !== 0) batches.push(batch)
                batch = newBatch(textureIndex)
            }
            for (const geometry of geometries) {
                const offset = batch.vertices.length / 2
                batch.vertices.push(...geometry.vertices)
                batch.colors.push(...geometry.colors)
                for (const index of geometry.vertexIndices) {
                    batch.vertexIndices.push(index + offset)
                }
                batch.textureCoordinates.push(...geometry.textureCoordinates)
            }
        }
    }
    if (batch.vertices.length !== 0) batches.push(batch)
    return batches
}