import { identity, Matrix3x3 } from "./linear_algebra/matrix3x3"
import { Pointer, Color } from "./ui"
import { Graph, Operations, Position, UUID, emptyGraph, GenerateUUID } from './graph/model'
import { addNode } from "./graph/update"

export interface Theme {
    readonly background: Color
    readonly node: Color
    readonly input: Color
    readonly selectedInput: Color
    readonly connection: Color
}

export interface Finder {
    readonly search: string
    readonly show: boolean
    readonly options: Readonly<string[]>
}

export enum VirtualKeyboardKind {
    ALPHABETIC,
    NUMERIC
}

export interface VirtualKeyboard {
    readonly show: boolean
    readonly kind: VirtualKeyboardKind
}

export enum InputTargetKind {
    FINDER,
    NUMBER,
    NONE
}

export interface FinderInputTarget {
    readonly kind: InputTargetKind.FINDER
}

export interface NumberInputTarget {
    readonly kind: InputTargetKind.NUMBER,
    readonly node: UUID
}

export interface NoInputTarget {
    readonly kind: InputTargetKind.NONE,
}

export type InputTarget =
    | FinderInputTarget
    | NumberInputTarget
    | NoInputTarget


export enum SelectedKind {
    NODE,
    INPUT,
    OUTPUT,
    BODY,
    NONE
}

export interface SelectedNode {
    kind: SelectedKind.NODE
    node: UUID
}


export interface SelectedInput {
    kind: SelectedKind.INPUT
    input: UUID
}

export interface SelectedOutput {
    kind: SelectedKind.OUTPUT
    output: UUID
}

export interface SelectedBody {
    kind: SelectedKind.BODY
    body: UUID
}

export interface SelectedNone {
    kind: SelectedKind.NONE
}

export type Selected =
    | SelectedNode
    | SelectedInput
    | SelectedOutput
    | SelectedBody
    | SelectedNone

export interface State {
    readonly graph: Graph
    readonly nodeOrder: Readonly<UUID[]>
    readonly zooming: boolean
    readonly dragging: boolean
    readonly pointers: Readonly<Pointer[]>
    readonly pointerDistance: number
    readonly pointerCenter: Position
    readonly selected: Selected
    readonly potentialDoubleClick: boolean
    readonly nodePlacementLocation: Position
    readonly finder: Finder
    readonly virtualKeyboard: VirtualKeyboard
    readonly inputTarget: InputTarget
    readonly camera: Readonly<Matrix3x3>
    readonly operations: Readonly<Operations>
    readonly theme: Theme
}

export const emptyState = (): State => ({
    graph: emptyGraph(),
    nodeOrder: [],
    zooming: false,
    dragging: false,
    pointers: [],
    pointerDistance: 0,
    pointerCenter: { x: 0, y: 0 },
    camera: identity(),
    selected: { kind: SelectedKind.NONE },
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
    operations: {}
})

export const demoState = (generateUUID: GenerateUUID): State => {
    const operations: Operations = {
        "Number": {
            name: "Number",
            inputs: [],
            body: 0,
            outputs: ["out"]
        }
    }
    const graph = emptyGraph()
    const { graph: graph1, node } = addNode({
        graph: graph,
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        generateUUID
    })
    return {
        ...emptyState(),
        nodeOrder: [node],
        graph: graph1,
        operations
    }
}