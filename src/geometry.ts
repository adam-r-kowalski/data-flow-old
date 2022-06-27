export interface Offset {
    x: number
    y: number
}

export interface WorldSpace {
    x0: number
    y0: number
    x1: number
    y1: number
}

export interface Geometry {
    worldSpace: WorldSpace
    textureIndex: number
    textureCoordinates: number[]
    colors: number[]
    vertices: number[]
    vertexIndices: number[]
    cameraIndex: number[]
}