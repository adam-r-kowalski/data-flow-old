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

export interface Body {
    value: number
    editing: boolean
}

export interface Node {
    name: string
    inputs: Input[]
    body?: Body
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

export enum VirtualKeyboardKind {
    ALPHABETIC,
    NUMERIC
}

export interface VirtualKeyboard {
    show: boolean
    kind: VirtualKeyboardKind
}

export enum InputTargetKind {
    FINDER,
    NUMBER,
    NONE
}

export interface FinderInputTarget { kind: InputTargetKind.FINDER }

export interface NumberInputTarget {
    kind: InputTargetKind.NUMBER,
    nodeIndex: number
}

export interface NoInputTarget {
    kind: InputTargetKind.NONE,
}

export type InputTarget =
    | FinderInputTarget
    | NumberInputTarget
    | NoInputTarget

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
    virtualKeyboard: VirtualKeyboard
    inputTarget: InputTarget
    camera: Matrix3x3
    operations: Operations
    theme: Theme
}
