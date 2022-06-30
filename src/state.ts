import { Color } from "./color"
import { Mat3 } from "./linear_algebra"
import { Pointer } from "./ui"

export interface Input {
    name: string
    selected: boolean
}

export interface Output {
    name: string
    selected: boolean
}

export interface Node {
    name: string
    inputs: Input[]
    outputs: Output[]
    x: number
    y: number
}

export interface Theme {
    background: Color
    node: Color
    input: Color
    selectedInput: Color
}

export interface State {
    nodes: Node[]
    dragging: boolean
    draggedNode: number | null
    pointers: Pointer[]
    pointerDistance: number
    pointerCenter: [number, number]
    selectedInput: [number, number] | null
    selectedOutput: [number, number] | null
    camera: Mat3
    theme: Theme
}
