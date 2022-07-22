import { identity, Matrix3x3 } from "./linear_algebra/matrix3x3"
import { Pointer, Color } from "./ui"

export type UUID = string

export interface InputPath {
    nodeUUID: UUID
    inputIndex: number
}

export interface OutputPath {
    nodeUUID: UUID
    outputIndex: number
}

export interface Input {
    name: string
    selected: boolean
    edgeUUIDs: UUID[]
}

export interface Output {
    name: string
    selected: boolean
    edgeUUIDs: UUID[]
}

export interface Body {
    value: number
    editing: boolean
}

export interface Node {
    uuid: UUID
    name: string
    inputs: Input[]
    body?: Body
    outputs: Output[]
    x: number
    y: number
}

export interface Edge {
    uuid: UUID
    input: InputPath
    output: OutputPath
}

export interface Graph {
    nodes: { [uuid: UUID]: Node }
    nodeOrder: UUID[]
    edges: { [uuid: UUID]: Edge }
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
    nodeUUID: UUID
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
    selectedNode: UUID | null
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

export type GenerateUUID = () => UUID

export const initialState = (generateUUID: GenerateUUID): State => {
    const node0: Node = {
        uuid: generateUUID(),
        name: "Number",
        inputs: [],
        body: { value: 5, editing: false },
        outputs: [],
        x: 25,
        y: 25
    }
    const node1: Node = {
        uuid: generateUUID(),
        name: "Number",
        inputs: [],
        body: { value: 10, editing: false },
        outputs: [],
        x: 25,
        y: 100
    }
    const node2: Node = {
        uuid: generateUUID(),
        name: "Add",
        inputs: [],
        outputs: [],
        x: 150,
        y: 50
    }
    const node3: Node = {
        uuid: generateUUID(),
        name: "Number",
        inputs: [],
        body: { value: 15, editing: false },
        outputs: [],
        x: 175,
        y: 150
    }
    const node4: Node = {
        uuid: generateUUID(),
        name: "Divide",
        inputs: [],
        outputs: [],
        x: 350,
        y: 50
    }
    const node5: Node = {
        uuid: generateUUID(),
        name: "Log",
        inputs: [],
        outputs: [],
        x: 550,
        y: 50
    }
    const edge0: Edge = {
        uuid: generateUUID(),
        output: { nodeUUID: node0.uuid, outputIndex: 0 },
        input: { nodeUUID: node2.uuid, inputIndex: 0 },
    }
    const edge1 = {
        uuid: generateUUID(),
        output: { nodeUUID: node1.uuid, outputIndex: 0 },
        input: { nodeUUID: node2.uuid, inputIndex: 1 },
    }
    const edge2 = {
        uuid: generateUUID(),
        output: { nodeUUID: node2.uuid, outputIndex: 0 },
        input: { nodeUUID: node4.uuid, inputIndex: 0 },
    }
    const edge3 = {
        uuid: generateUUID(),
        output: { nodeUUID: node3.uuid, outputIndex: 0 },
        input: { nodeUUID: node4.uuid, inputIndex: 1 },
    }
    const edge4 = {
        uuid: generateUUID(),
        output: { nodeUUID: node4.uuid, outputIndex: 0 },
        input: { nodeUUID: node5.uuid, inputIndex: 0 },
    }
    node0.outputs.push({ name: "out", selected: false, edgeUUIDs: [edge0.uuid] })
    node1.outputs.push({ name: "out", selected: false, edgeUUIDs: [edge1.uuid] })
    node2.inputs.push(
        { name: "x", selected: false, edgeUUIDs: [edge0.uuid] },
        { name: "y", selected: false, edgeUUIDs: [edge1.uuid] }
    )
    node2.outputs.push({ name: "out", selected: false, edgeUUIDs: [edge2.uuid] })
    node3.outputs.push({ name: "out", selected: false, edgeUUIDs: [edge3.uuid] })
    node4.inputs.push(
        { name: "x", selected: false, edgeUUIDs: [edge2.uuid] },
        { name: "y", selected: false, edgeUUIDs: [edge3.uuid] }
    )
    node4.outputs.push({ name: "out", selected: false, edgeUUIDs: [edge4.uuid] })
    node5.inputs.push({ name: "value", selected: false, edgeUUIDs: [edge4.uuid] })
    return {
        graph: {
            nodes: {
                [node0.uuid]: node0,
                [node1.uuid]: node1,
                [node2.uuid]: node2,
                [node3.uuid]: node3,
                [node4.uuid]: node4,
                [node5.uuid]: node5,
            },
            nodeOrder: [node0.uuid, node1.uuid, node2.uuid, node3.uuid, node4.uuid, node5.uuid],
            edges: {
                [edge0.uuid]: edge0,
                [edge1.uuid]: edge1,
                [edge2.uuid]: edge2,
                [edge3.uuid]: edge3,
                [edge4.uuid]: edge4,
            }
        },
        zooming: false,
        dragging: false,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: [0, 0],
        camera: identity(),
        selectedOutput: null,
        selectedInput: null,
        selectedNode: null,
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
    }
}
