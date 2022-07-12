import { Layers } from "./layer_geometry"

export interface Batch {
    vertices: number[]
    vertexIndices: number[]
    colors: number[]
    textureIndex: number
    textureCoordinates: number[]
    cameraIndex: number[]
}

const newBatch = (textureIndex: number): Batch => ({
    vertices: [],
    colors: [],
    vertexIndices: [],
    textureIndex,
    textureCoordinates: [],
    cameraIndex: []
})

export const batchGeometry = (layers: Layers): Batch[] => {
    const batches: Batch[] = []
    let batch = newBatch(0)
    let batchTextureIndex = batch.textureIndex.toString()
    for (const layer of layers) {
        for (const [textureIndex, geometries] of Object.entries(layer)) {
            if (batchTextureIndex !== textureIndex) {
                if (batch.vertices.length !== 0) batches.push(batch)
                batch = newBatch(parseInt(textureIndex))
                batchTextureIndex = textureIndex
            }
            for (const geometry of geometries) {
                const offset = batch.vertices.length / 2
                batch.vertices.push(...geometry.vertices)
                batch.colors.push(...geometry.colors)
                for (const index of geometry.vertexIndices) {
                    batch.vertexIndices.push(index + offset)
                }
                batch.textureCoordinates.push(...geometry.textureCoordinates)
                batch.cameraIndex.push(...geometry.cameraIndex)
            }
        }
    }
    if (batch.vertices.length !== 0) batches.push(batch)
    return batches
}