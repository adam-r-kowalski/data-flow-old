import { Color } from "./color"
import { Matrix3x3 } from "./linear_algebra/matrix3x3"
import { Pointer } from "./ui"

export interface InputPath {
    nodeIndex: number
    inputIndex: number
}

export interface OutputPath {
    nodeIndex: number
    outputIndex: number
}

export interface Input {
    name: string
    selected: boolean
    edgeIndices: number[]
}

export interface Output {
    name: string
    selected: boolean
    edgeIndices: number[]
}

export interface Node {
    name: string
    inputs: Input[]
    outputs: Output[]
    x: number
    y: number
}

export interface Edge {
    input: InputPath
    output: OutputPath
}

export interface Graph {
    nodes: Node[]
    edges: Edge[]
}

export interface Theme {
    background: Color
    node: Color
    input: Color
    selectedInput: Color
    connection: Color
}

export interface State {
    graph: Graph
    dragging: boolean
    draggedNode: number | null
    pointers: Pointer[]
    pointerDistance: number
    pointerCenter: [number, number]
    selectedOutput: OutputPath | null
    selectedInput: InputPath | null
    potentialDoubleClick: boolean
    showFinder: boolean
    camera: Matrix3x3
    theme: Theme
}
