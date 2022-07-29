import { identity, Matrix3x3 } from "../linear_algebra/matrix3x3"
import { Pointer, Color } from "../ui"
import { Graph, Operations, Position, UUID, emptyGraph, GenerateUUID } from '../graph/model'
import { addEdge, addNode, changeBodyValue } from "../graph/update"

export interface Theme {
    readonly background: Color
    readonly node: Color
    readonly focusNode: Color
    readonly input: Color
    readonly focusInput: Color
    readonly connection: Color
}

export enum FocusKind {
    NODE,
    INPUT,
    OUTPUT,
    BODY,
    FINDER,
    NONE
}

export interface FocusNode {
    readonly kind: FocusKind.NODE
    readonly node: UUID
    readonly drag: boolean
}


export interface FocusInput {
    readonly kind: FocusKind.INPUT
    readonly input: UUID
}

export interface FocusOutput {
    readonly kind: FocusKind.OUTPUT
    readonly output: UUID
}

export interface FocusBody {
    readonly kind: FocusKind.BODY
    readonly body: UUID
}

export interface FocusFinder {
    readonly kind: FocusKind.FINDER,
    readonly search: string
    readonly options: Readonly<string[]>
}

export enum PointerActionKind { PAN, ZOOM, NONE }

export interface PointerActionPan {
    readonly kind: PointerActionKind.PAN
}

export interface PointerActionZoom {
    readonly kind: PointerActionKind.ZOOM
    readonly pointerDistance: number
    readonly pointerCenter: Position
}

export interface PointerActionNone {
    readonly kind: PointerActionKind.NONE
}

export type PointerAction =
    | PointerActionPan
    | PointerActionZoom
    | PointerActionNone

export interface FocusNone {
    readonly kind: FocusKind.NONE
    readonly pointerAction: PointerAction
}

export type Focus =
    | FocusNode
    | FocusInput
    | FocusOutput
    | FocusBody
    | FocusFinder
    | FocusNone

export interface Model {
    readonly graph: Graph
    readonly nodeOrder: Readonly<UUID[]>
    readonly pointers: Readonly<Pointer[]>
    readonly focus: Focus
    readonly openFinderFirstClick: boolean
    readonly nodePlacementLocation: Position
    readonly camera: Readonly<Matrix3x3>
    readonly operations: Readonly<Operations>
    readonly theme: Theme
}

export const emptyModel = (): Model => ({
    graph: emptyGraph(),
    nodeOrder: [],
    pointers: [],
    camera: identity(),
    focus: {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE }
    },
    openFinderFirstClick: false,
    theme: {
        background: { red: 2, green: 22, blue: 39, alpha: 255 },
        node: { red: 41, green: 95, blue: 120, alpha: 255 },
        focusNode: { red: 23, green: 54, blue: 69, alpha: 255 },
        input: { red: 188, green: 240, blue: 192, alpha: 255 },
        focusInput: { red: 175, green: 122, blue: 208, alpha: 255 },
        connection: { red: 255, green: 255, blue: 255, alpha: 255 },
    },
    nodePlacementLocation: { x: 0, y: 0 },
    operations: {}
})

export const demoModel = (generateUUID: GenerateUUID): Model => {
    const model = {
        ...emptyModel(),
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
            "Print": {
                name: "Print",
                inputs: ["value"],
                outputs: []
            }
        }
    }
    const { graph: graph0, node: number0 } = addNode({
        graph: model.graph,
        operation: model.operations["Number"],
        position: { x: 25, y: 20 },
        generateUUID
    })
    const graph1 = changeBodyValue(graph0, graph0.nodes[number0].body!, () => 10)
    const { graph: graph2, node: number1 } = addNode({
        graph: graph1,
        operation: model.operations["Number"],
        position: { x: 55, y: 105 },
        generateUUID
    })
    const graph3 = changeBodyValue(graph2, graph2.nodes[number1].body!, () => 25)
    const { graph: graph4, node: add } = addNode({
        graph: graph3,
        operation: model.operations["Add"],
        position: { x: 175, y: 55 },
        generateUUID
    })
    const { graph: graph5 } = addEdge({
        graph: graph4,
        input: graph4.nodes[add].inputs[0],
        output: graph4.nodes[number0].outputs[0],
        generateUUID
    })
    const { graph: graph6 } = addEdge({
        graph: graph5,
        input: graph5.nodes[add].inputs[1],
        output: graph5.nodes[number1].outputs[0],
        generateUUID
    })
    const { graph: graph7, node: number2 } = addNode({
        graph: graph6,
        operation: model.operations["Number"],
        position: { x: 225, y: 145 },
        generateUUID
    })
    const graph8 = changeBodyValue(graph7, graph7.nodes[number2].body!, () => 5)
    const { graph: graph9, node: div } = addNode({
        graph: graph8,
        operation: model.operations["Divide"],
        position: { x: 355, y: 75 },
        generateUUID
    })
    const { graph: graph10 } = addEdge({
        graph: graph9,
        input: graph9.nodes[div].inputs[0],
        output: graph9.nodes[add].outputs[0],
        generateUUID
    })
    const { graph: graph11 } = addEdge({
        graph: graph10,
        input: graph10.nodes[div].inputs[1],
        output: graph10.nodes[number2].outputs[0],
        generateUUID
    })
    const { graph: graph12, node: print } = addNode({
        graph: graph11,
        operation: model.operations["Print"],
        position: { x: 535, y: 85 },
        generateUUID
    })
    const { graph: graph13 } = addEdge({
        graph: graph12,
        input: graph12.nodes[print].inputs[0],
        output: graph12.nodes[div].outputs[0],
        generateUUID
    })
    return {
        ...model,
        graph: graph13,
        nodeOrder: [number0, number1, add, number2, div, print]
    }
}