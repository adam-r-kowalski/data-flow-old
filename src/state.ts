import { Matrix3x3 } from "./linear_algebra/matrix3x3"
import { Pointer, Color } from "./ui"

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
    body?: number
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

export interface Finder {
    search: string
    show: boolean
    options: string[]
}

export interface Operation {
    name: string
    inputs: string[]
    body?: number
    outputs: string[]
}

export type Operations = { [name: string]: Operation }

export interface ScreenCoordinates {
    x: number
    y: number
}

export interface State {
    graph: Graph
    zooming: boolean
    dragging: boolean
    draggedNode: number | null
    pointers: Pointer[]
    pointerDistance: number
    pointerCenter: [number, number]
    selectedOutput: OutputPath | null
    selectedInput: InputPath | null
    potentialDoubleClick: boolean
    nodePlacementLocation: ScreenCoordinates
    finder: Finder
    camera: Matrix3x3
    operations: Operations
    theme: Theme
}
