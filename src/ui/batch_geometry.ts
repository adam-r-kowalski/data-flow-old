import { Connections } from "./gather_connections"
import { Layers } from "./layer_geometry"
import { IdToWorldSpace } from "./id_to_world_space"
import { WorldSpace } from "."

export interface Triangles {
    vertices: number[]
    vertexIndices: number[]
    colors: number[]
    textureIndex: number
    textureCoordinates: number[]
    cameraIndex: number[]
}

export interface Lines {
    vertices: number[]
    colors: number[]
}


export interface Batch {
    triangles: Triangles
    lines: Lines
}

const newBatch = (textureIndex: number): Batch => ({
    triangles: {
        vertices: [],
        colors: [],
        vertexIndices: [],
        textureIndex,
        textureCoordinates: [],
        cameraIndex: []
    },
    lines: {
        vertices: [],
        colors: []
    }
})

const linspace = (start: number, stop: number, num: number): number[] => {
    const step = (stop - start) / (num - 1)
    return Array.from({ length: num }, (_, i) => start + step * i)
}

function* cubicBezier(ts: number[], from: WorldSpace, to: WorldSpace): Generator<number> {
    const p0x = (from.x0 + from.x1) / 2
    const p0y = (from.y0 + from.y1) / 2
    const p1x = p0x + 50
    const p1y = p0y
    const p3x = (to.x0 + to.x1) / 2
    const p3y = (to.y0 + to.y1) / 2
    const p2x = p3x - 50
    const p2y = p3y
    let lastX = 0
    let lastY = 0
    let first = true
    for (const t of ts) {
        const tSquared = t * t
        const tCubed = tSquared * t
        const oneMinusT = 1 - t
        const oneMinusTSquared = oneMinusT * oneMinusT
        const oneMinusTCubed = oneMinusTSquared * oneMinusT
        const a = oneMinusTCubed
        const b = 3 * oneMinusTSquared * t
        const c = 3 * oneMinusT * tSquared
        const d = tCubed
        const x = a * p0x + b * p1x + c * p2x + d * p3x
        const y = a * p0y + b * p1y + c * p2y + d * p3y
        if (first) {
            yield x
            yield y
            first = false
        } else {
            yield lastX
            yield lastY
        }
        yield x
        yield y
        lastX = x
        lastY = y
    }
}


export const batchGeometry = (layers: Layers, connections: Connections, idToWorldSpace: IdToWorldSpace): Batch[] => {
    const samples = 20
    const ts = linspace(0, 1, samples)
    const batches: Batch[] = []
    let batch = newBatch(0)
    let batchTextureIndex = batch.triangles.textureIndex.toString()
    layers.forEach((layer, z) => {
        for (const [textureIndex, geometries] of Object.entries(layer)) {
            if (batchTextureIndex !== textureIndex) {
                if (batch.triangles.vertices.length !== 0) batches.push(batch)
                batch = newBatch(parseInt(textureIndex))
                batchTextureIndex = textureIndex
            }
            for (const geometry of geometries) {
                const offset = batch.triangles.vertices.length / 2
                batch.triangles.vertices.push(...geometry.vertices)
                batch.triangles.colors.push(...geometry.colors)
                for (const index of geometry.vertexIndices) {
                    batch.triangles.vertexIndices.push(index + offset)
                }
                batch.triangles.textureCoordinates.push(...geometry.textureCoordinates)
                batch.triangles.cameraIndex.push(...geometry.cameraIndex)
            }
        }
        if (connections.length > z) {
            for (const { from, to, color } of connections[z]) {
                for (const p of cubicBezier(ts, idToWorldSpace[from], idToWorldSpace[to])) {
                    batch.lines.vertices.push(p)
                }
                const { red, green, blue, alpha } = color
                for (let i = 0; i < samples * 2; ++i) batch.lines.colors.push(red, green, blue, alpha)
            }
            if (batch.lines.vertices.length !== 0) {
                batches.push(batch)
                batch = newBatch(0)
            }
        }
    })
    if (batch.triangles.vertices.length !== 0) batches.push(batch)
    return batches
}