import { identity, Matrix3x3 } from "./linear_algebra/matrix3x3"
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

export const initialState = (): State => ({
    graph: {
        nodes: [
            {
                name: "Number",
                inputs: [],
                body: { value: 5, editing: false },
                outputs: [
                    { name: "out", selected: false, edgeIndices: [0] },
                ],
                x: 25,
                y: 25
            },
            {
                name: "Number",
                inputs: [],
                body: { value: 10, editing: false },
                outputs: [
                    { name: "out", selected: false, edgeIndices: [1] },
                ],
                x: 25,
                y: 100
            },
            {
                name: "Add",
                inputs: [
                    { name: "x", selected: false, edgeIndices: [0] },
                    { name: "y", selected: false, edgeIndices: [1] }
                ],
                outputs: [
                    { name: "out", selected: false, edgeIndices: [2] },
                ],
                x: 150,
                y: 50
            },
            {
                name: "Number",
                inputs: [],
                body: { value: 15, editing: false },
                outputs: [
                    { name: "out", selected: false, edgeIndices: [3] },
                ],
                x: 175,
                y: 150
            },
            {
                name: "Divide",
                inputs: [
                    { name: "x", selected: false, edgeIndices: [2] },
                    { name: "y", selected: false, edgeIndices: [3] }
                ],
                outputs: [
                    { name: "out", selected: false, edgeIndices: [4] },
                ],
                x: 350,
                y: 50
            },
            {
                name: "Log",
                inputs: [
                    { name: "value", selected: false, edgeIndices: [4] },
                ],
                outputs: [],
                x: 550,
                y: 50
            },
        ],
        edges: [
            {
                output: { nodeIndex: 0, outputIndex: 0 },
                input: { nodeIndex: 2, inputIndex: 0 },
            },
            {
                output: { nodeIndex: 1, outputIndex: 0 },
                input: { nodeIndex: 2, inputIndex: 1 },
            },
            {
                output: { nodeIndex: 2, outputIndex: 0 },
                input: { nodeIndex: 4, inputIndex: 0 },
            },
            {
                output: { nodeIndex: 3, outputIndex: 0 },
                input: { nodeIndex: 4, inputIndex: 1 },
            },
            {
                output: { nodeIndex: 4, outputIndex: 0 },
                input: { nodeIndex: 5, inputIndex: 0 },
            }
        ]
    },
    zooming: false,
    dragging: false,
    draggedNode: null,
    pointers: [],
    pointerDistance: 0,
    pointerCenter: [0, 0],
    camera: identity(),
    selectedOutput: null,
    selectedInput: null,
    theme: {
        background: { red: 2, green: 22, blue: 39, alpha: 255 },
        node: { red: 41, green: 95, blue: 120, alpha: 255 },
        input: { red: 188, green: 240, blue: 192, alpha: 255 },
        selectedInput: { red: 175, green: 122, blue: 208, alpha: 255 },
        connection: { red: 255, green: 255, blue: 255, alpha: 255 },
    },
    potentialDoubleClick: false,
    nodePlacementLocation: { x: 0, y: 0 },
    finder: {
        search: '',
        options: [],
        show: false
    },
    virtualKeyboard: {
        show: false,
        kind: VirtualKeyboardKind.ALPHABETIC
    },
    inputTarget: { kind: InputTargetKind.NONE },
    operations: {
        "Number": {
            name: "Number",
            inputs: [],
            body: 0,
            outputs: ["out"]
        },
        "Add": {
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"]
        },
        "Subtract": {
            name: "Subtract",
            inputs: ["x", "y"],
            outputs: ["out"]
        },
        "Multiply": {
            name: "Multiply",
            inputs: ["x", "y"],
            outputs: ["out"]
        },
        "Divide": {
            name: "Divide",
            inputs: ["x", "y"],
            outputs: ["out"]
        },
        "Equal": {
            name: "Equal",
            inputs: ["x", "y"],
            outputs: ["out"]
        },
        "Less Than": {
            name: "Less Than",
            inputs: ["x", "y"],
            outputs: ["out"]
        },
        "Log": {
            name: "Log",
            inputs: ["value"],
            outputs: []
        }
    }
})
