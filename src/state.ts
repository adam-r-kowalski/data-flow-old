import { identity, Matrix3x3 } from "./linear_algebra/matrix3x3"
import { Pointer, Color } from "./ui"

export type UUID = string

export interface Input {
    uuid: UUID
    name: string
    edge?: UUID
}

export interface Output {
    uuid: UUID
    name: string
    edges: UUID[]
}

export interface Body {
    value: number
    editing: boolean
}

export interface Node {
    uuid: UUID
    name: string
    inputs: UUID[]
    body?: Body
    outputs: UUID[]
    x: number
    y: number
}

export interface Edge {
    uuid: UUID
    input: UUID
    output: UUID
}

export type Nodes = { [uuid: UUID]: Node }
export type Edges = { [uuid: UUID]: Edge }
export type Inputs = { [uuid: UUID]: Input }
export type Outputs = { [uuid: UUID]: Output }

export interface Graph {
    nodes: Nodes
    edges: Edges
    inputs: Inputs
    outputs: Outputs
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
    nodeOrder: UUID[]
    zooming: boolean
    dragging: boolean
    pointers: Pointer[]
    pointerDistance: number
    pointerCenter: [number, number]
    selectedOutput?: UUID
    selectedInput?: UUID
    selectedNode?: UUID
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
    const node0output0: Output = {
        uuid: generateUUID(),
        name: "out",
        edges: []
    }
    const node0: Node = {
        uuid: generateUUID(),
        name: "Number",
        inputs: [],
        body: { value: 5, editing: false },
        outputs: [node0output0.uuid],
        x: 25,
        y: 25
    }
    const node1output0: Output = {
        uuid: generateUUID(),
        name: "out",
        edges: []
    }
    const node1: Node = {
        uuid: generateUUID(),
        name: "Number",
        inputs: [],
        body: { value: 10, editing: false },
        outputs: [node1output0.uuid],
        x: 25,
        y: 100
    }
    const node2input0: Input = {
        uuid: generateUUID(),
        name: "x",
    }
    const node2input1: Input = {
        uuid: generateUUID(),
        name: "y",
    }
    const node2output0: Output = {
        uuid: generateUUID(),
        name: "out",
        edges: []
    }
    const node2: Node = {
        uuid: generateUUID(),
        name: "Add",
        inputs: [node2input0.uuid, node2input1.uuid],
        outputs: [node2output0.uuid],
        x: 150,
        y: 50
    }
    const node3output0: Output = {
        uuid: generateUUID(),
        name: "out",
        edges: []
    }
    const node3: Node = {
        uuid: generateUUID(),
        name: "Number",
        inputs: [],
        body: { value: 15, editing: false },
        outputs: [node3output0.uuid],
        x: 175,
        y: 150
    }
    const node4input0: Input = {
        uuid: generateUUID(),
        name: "x",
    }
    const node4input1: Input = {
        uuid: generateUUID(),
        name: "y",
    }
    const node4output0: Output = {
        uuid: generateUUID(),
        name: "out",
        edges: []
    }
    const node4: Node = {
        uuid: generateUUID(),
        name: "Divide",
        inputs: [node4input0.uuid, node4input1.uuid],
        outputs: [node4output0.uuid],
        x: 350,
        y: 50
    }
    const node5input0: Input = {
        uuid: generateUUID(),
        name: "value",
    }
    const node5: Node = {
        uuid: generateUUID(),
        name: "Log",
        inputs: [node5input0.uuid],
        outputs: [],
        x: 550,
        y: 50
    }
    const edge0: Edge = {
        uuid: generateUUID(),
        output: node0output0.uuid,
        input: node2input0.uuid
    }
    node0output0.edges.push(edge0.uuid)
    node2input0.edge = edge0.uuid
    const edge1 = {
        uuid: generateUUID(),
        output: node1output0.uuid,
        input: node2input1.uuid
    }
    node1output0.edges.push(edge1.uuid)
    node2input1.edge = edge1.uuid
    const edge2 = {
        uuid: generateUUID(),
        output: node2output0.uuid,
        input: node4input0.uuid,
    }
    node2output0.edges.push(edge2.uuid)
    node4input0.edge = edge2.uuid
    const edge3 = {
        uuid: generateUUID(),
        output: node3output0.uuid,
        input: node4input1.uuid,
    }
    node3output0.edges.push(edge3.uuid)
    node4input1.edge = edge3.uuid
    const edge4 = {
        uuid: generateUUID(),
        output: node4output0.uuid,
        input: node5input0.uuid
    }
    node4output0.edges.push(edge4.uuid)
    node5input0.edge = edge4.uuid
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
            edges: {
                [edge0.uuid]: edge0,
                [edge1.uuid]: edge1,
                [edge2.uuid]: edge2,
                [edge3.uuid]: edge3,
                [edge4.uuid]: edge4,
            },
            inputs: {
                [node2input0.uuid]: node2input0,
                [node2input1.uuid]: node2input1,
                [node4input0.uuid]: node4input0,
                [node4input1.uuid]: node4input1,
                [node5input0.uuid]: node5input0,
            },
            outputs: {
                [node0output0.uuid]: node0output0,
                [node1output0.uuid]: node1output0,
                [node2output0.uuid]: node2output0,
                [node3output0.uuid]: node3output0,
                [node4output0.uuid]: node4output0,
            }
        },
        nodeOrder: [node0.uuid, node1.uuid, node2.uuid, node3.uuid, node4.uuid, node5.uuid],
        zooming: false,
        dragging: false,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: [0, 0],
        camera: identity(),
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
