import { Color } from "./color"
import { Mat3 } from "./linear_algebra"
import { Pointer } from "./ui"

export interface Node {
    name: string
    inputs: string[]
    outputs: string[]
    x: number
    y: number
}

export interface Theme {
    background: Color
    node: Color
    input: Color
}

export interface State {
    nodes: Node[]
    dragging: boolean
    draggedNode: number | null
    pointers: Pointer[]
    pointerDistance: number
    pointerCenter: [number, number]
    camera: Mat3
    theme: Theme
}
