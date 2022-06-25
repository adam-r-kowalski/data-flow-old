import { Mat3 } from "./linear_algebra"

export interface Offset {
    x: number
    y: number
}

export interface Position {
    x: number
    y: number
}

export interface Geometry {
    position: Position
    textureIndex: number
    textureCoordinates: number[]
    colors: number[]
    vertices: number[]
    vertexIndices: number[]
    cameraIndex: number[]
    camera?: Mat3
}