import { fuzzyFind } from "./fuzzy_find"
import { multiplyMatrices, multiplyMatrixVector, scale, translate } from "./linear_algebra/matrix3x3"
import { length } from "./linear_algebra/vector3"
import { UpdateResult } from "./ui/run"
import { InputTargetKind, State, VirtualKeyboardKind } from "./state"
import { Edge, GenerateUUID, Input, Output, UUID } from './graph/model'
import { Pointer } from "./ui"
import { addEdge, addNode, changeNodePosition } from "./graph/update"

export enum EventKind {
    POINTER_MOVE,
    POINTER_DOWN,
    POINTER_UP,
    CLICKED_NODE,
    WHEEL,
    CLICKED_INPUT,
    CLICKED_OUTPUT,
    DOUBLE_CLICK_TIMEOUT,
    DOUBLE_CLICK,
    KEYDOWN,
    VIRTUAL_KEYDOWN,
    CLICKED_FINDER_OPTION,
    CLICKED_NUMBER,
    CLICKED_BACKGROUND
}

export interface PointerMove {
    kind: EventKind.POINTER_MOVE
    pointer: Pointer
}

export interface PointerDown {
    kind: EventKind.POINTER_DOWN
    pointer: Pointer
}

export interface PointerUp {
    kind: EventKind.POINTER_UP
    pointer: Pointer
}

export interface ClickedNode {
    kind: EventKind.CLICKED_NODE
    node: UUID
}

export interface Wheel {
    kind: EventKind.WHEEL
    x: number
    y: number
    deltaY: number
}

export interface ClickedInput {
    kind: EventKind.CLICKED_INPUT
    input: UUID
}

export interface ClickedOutput {
    kind: EventKind.CLICKED_OUTPUT
    output: UUID
}

export interface DoubleClickTimeout {
    kind: EventKind.DOUBLE_CLICK_TIMEOUT
}

export interface DoubleClick {
    kind: EventKind.DOUBLE_CLICK
    pointer: Pointer
}

export interface KeyDown {
    kind: EventKind.KEYDOWN
    key: string
}

export interface VirtualKeyDown {
    kind: EventKind.VIRTUAL_KEYDOWN
    key: string
}

export interface ClickedFinderOption {
    kind: EventKind.CLICKED_FINDER_OPTION
    option: string
}

export interface ClickedNumber {
    kind: EventKind.CLICKED_NUMBER,
    node: UUID
}

export interface ClickedBackground {
    kind: EventKind.CLICKED_BACKGROUND,
}

export type AppEvent =
    | PointerMove
    | PointerDown
    | PointerUp
    | ClickedNode
    | Wheel
    | ClickedInput
    | ClickedOutput
    | DoubleClickTimeout
    | DoubleClick
    | KeyDown
    | VirtualKeyDown
    | ClickedFinderOption
    | ClickedNumber
    | ClickedBackground


const pointerDown = (state: State, event: PointerDown): UpdateResult<State, AppEvent> => {
    if (state.inputTarget.kind !== InputTargetKind.NONE) return { state }
    const pointers = [...state.pointers, event.pointer]
    if (pointers.length > 1) {
        return {
            state: {
                ...state,
                potentialDoubleClick: false,
                dragging: false,
                zooming: pointers.length === 2,
                pointers
            }
        }
    } else if (state.potentialDoubleClick) {
        return {
            state: {
                ...state,
                potentialDoubleClick: false,
                pointers
            },
            dispatch: [{ kind: EventKind.DOUBLE_CLICK, pointer: event.pointer }]
        }
    } else {
        return {
            state: {
                ...state,
                dragging: true,
                potentialDoubleClick: true,
                pointers
            },
            schedule: [
                { after: { milliseconds: 300 }, event: { kind: EventKind.DOUBLE_CLICK_TIMEOUT } }
            ]
        }
    }
}

const pointerUp = (state: State, event: PointerUp): UpdateResult<State, AppEvent> => {
    const pointers = state.pointers.filter(p => p.id !== event.pointer.id)
    switch (pointers.length) {
        case 1: return {
            state: {
                ...state,
                pointers,
                zooming: false,
                dragging: true,
                pointerDistance: 0
            }
        }
        case 0: return {
            state: {
                ...state,
                pointers,
                dragging: false,
                pointerDistance: 0
            }
        }
        default: return { state: { ...state, pointers } }
    }
}

export const changeNth = <T>(xs: Readonly<T[]>, i: number, x: T): T[] =>
    [...xs.slice(0, i), x, ...xs.slice(i)]

const pointerMove = (state: State, event: PointerMove): UpdateResult<State, AppEvent> => {
    if (!state.dragging && !state.zooming) {
        const nodePlacementLocation = !state.finder.show ?
            event.pointer.position :
            state.nodePlacementLocation
        return { state: { ...state, nodePlacementLocation } }
    } else {
        const index = state.pointers.findIndex(p => p.id === event.pointer.id)
        const pointer = state.pointers[index]
        const pointers = changeNth(state.pointers, index, event.pointer)
        if (state.dragging) {
            const dx = event.pointer.position.x - pointer.position.x
            const dy = event.pointer.position.y - pointer.position.y
            if (state.selectedNode) {
                const scaling = length(multiplyMatrixVector(state.camera, [0, 1, 0]))
                const graph = changeNodePosition(state.graph, state.selectedNode, p => ({
                    x: p.x + dx * scaling,
                    y: p.y + dy * scaling,
                }))
                return {
                    state: { ...state, pointers, graph },
                    render: true
                }
            } else {
                const camera = multiplyMatrices(state.camera, translate(-dx, -dy))
                return {
                    state: { ...state, pointers, camera },
                    render: true
                }
            }
        } else {
            // must be zooming
            const [p0, p1] = [state.pointers[0], state.pointers[1]]
            const [x1, y1] = [p0.position.x, p0.position.y]
            const [x2, y2] = [p1.position.x, p1.position.y]
            const pointerDistance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
            const previousDistance = state.pointerDistance
            const previousCenter = state.pointerCenter
            const x = (p0.position.x + p1.position.x) / 2
            const y = (p0.position.y + p1.position.y) / 2
            const pointerCenter = { x, y }
            if (previousDistance > 0) {
                const move = translate(x, y)
                const zoom = Math.pow(2, (previousDistance - pointerDistance) * 0.01)
                const moveBack = translate(-x, -y)
                const dx = x - previousCenter.x
                const dy = y - previousCenter.y
                const camera = multiplyMatrices(state.camera, move, scale(zoom, zoom), moveBack, translate(-dx, -dy))
                return {
                    state: { ...state, pointerCenter, pointerDistance, camera },
                    render: true
                }
            } else {
                return { state: { ...state, pointerCenter, pointerDistance } }
            }
        }
    }
}

const clickedNode = (state: State, event: ClickedNode): UpdateResult<State, AppEvent> => {
    const nodeOrder = state.nodeOrder.filter(uuid => uuid !== event.node)
    nodeOrder.push(event.node)
    return {
        state: { ...state, selectedNode: event.node, nodeOrder },
        render: true
    }
}

const wheel = (state: State, event: Wheel): UpdateResult<State, AppEvent> => {
    const move = translate(event.x, event.y)
    const zoom = Math.pow(2, event.deltaY * 0.01)
    const moveBack = translate(-event.x, -event.y)
    const camera = multiplyMatrices(state.camera, move, scale(zoom, zoom), moveBack)
    return {
        state: { ...state, camera },
        render: true
    }
}

const clickedInput = (state: State, event: ClickedInput, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> => {
    if (state.selectedOutput) {
        const { graph } = addEdge({
            graph: state.graph,
            input: event.input,
            output: state.selectedOutput,
            generateUUID
        })
        return {
            state: {
                ...state,
                selectedInput: undefined,
                selectedOutput: undefined,
                graph
            },
            render: true
        }
    } else {
        return {
            state: { ...state, selectedInput: event.input },
            render: true
        }
    }
}

const clickedOutput = (state: State, event: ClickedOutput, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> => {
    if (state.selectedInput) {
        const { graph } = addEdge({
            graph: state.graph,
            input: state.selectedInput,
            output: event.output,
            generateUUID
        })
        return {
            state: {
                ...state,
                selectedInput: undefined,
                selectedOutput: undefined,
                graph
            },
            render: true
        }
    } else {
        return {
            state: { ...state, selectedOutput: event.output },
            render: true
        }
    }
}

const doubleClickTimeout = (state: State, _: DoubleClickTimeout): UpdateResult<State, AppEvent> => ({
    state: { ...state, potentialDoubleClick: false }
})

const updateFinderOptions = (state: State): State => {
    const options = Object.keys(state.operations)
        .filter(item => fuzzyFind({ haystack: item, needle: state.finder.search }))
    return { ...state, finder: { ...state.finder, options } }
}

export const openFinder = (state: State): State =>
    updateFinderOptions({
        ...state,
        finder: {
            show: true,
            search: '',
            options: []
        },
        virtualKeyboard: {
            show: true,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: { kind: InputTargetKind.FINDER },
        potentialDoubleClick: false
    })


const doubleClick = (state: State, { pointer }: DoubleClick): UpdateResult<State, AppEvent> => ({
    state: openFinder({
        ...state,
        nodePlacementLocation: pointer.position
    }),
    render: true
})

const closeFinder = (state: State): State => ({
    ...state,
    finder: {
        show: false,
        search: '',
        options: []
    },
    virtualKeyboard: {
        show: false,
        kind: VirtualKeyboardKind.ALPHABETIC
    },
    inputTarget: { kind: InputTargetKind.NONE }
})

const insertOperationFromFinder = (state: State, name: string, generateUUID: GenerateUUID): State => {
    const operation = state.operations[name]
    const [x, y, _] = multiplyMatrixVector(
        state.camera,
        [state.nodePlacementLocation.x, state.nodePlacementLocation.y, 1]
    )
    const { graph, node } = addNode({
        graph: state.graph,
        operation,
        position: { x, y },
        generateUUID
    })
    return closeFinder({
        ...state,
        graph,
        nodeOrder: [...state.nodeOrder, node]
    })
}

const keyDown = (state: State, { key }: KeyDown, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> => {
    switch (state.inputTarget.kind) {
        case InputTargetKind.FINDER:
            switch (key) {
                case 'Backspace':
                    return {
                        state: updateFinderOptions({
                            ...state,
                            finder: {
                                ...state.finder,
                                search: state.finder.search.slice(0, -1)
                            }
                        }),
                        render: true
                    }
                case 'Shift':
                case 'Alt':
                case 'Control':
                case 'Meta':
                case 'Tab':
                    return { state }
                case 'Enter':
                    if (state.finder.options.length > 0) {
                        const name = state.finder.options[0]
                        return {
                            state: insertOperationFromFinder(state, name, generateUUID),
                            render: true
                        }
                    } else {
                        return { state: closeFinder(state), render: true }
                    }
                case 'Escape':
                    return { state: closeFinder(state), render: true }
                default:
                    return {
                        state: updateFinderOptions({
                            ...state,
                            finder: {
                                ...state.finder,
                                search: state.finder.search + key
                            }
                        }),
                        render: true
                    }
            }
        case InputTargetKind.NUMBER:
            const node = state.graph.nodes[state.inputTarget.nodeUUID]
            let value = node.body!.value.toString()
            switch (key) {
                case 'Backspace':
                    let newValue = value.slice(0, -1)
                    if (newValue === '') newValue = '0'
                    node.body!.value = parseFloat(newValue)
                    return { state, render: true }
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':
                    value += key
                    node.body!.value = parseFloat(value)
                    return { state, render: true }
                case 'Enter':
                    node.body!.editing = false
                    state.virtualKeyboard = {
                        show: false,
                        kind: VirtualKeyboardKind.ALPHABETIC
                    }
                    state.inputTarget = {
                        kind: InputTargetKind.NONE
                    }
                    return { state, render: true }
                default:
                    return { state }
            }
        case InputTargetKind.NONE:
            switch (key) {
                case 'f':
                    return { state: openFinder(state), render: true }
                case 'd':
                    if (!state.selectedNode) return { state }
                    const node = state.graph.nodes[state.selectedNode]
                    const inputEdges = node.inputs
                        .map(input => state.graph.inputs[input])
                        .map(input => input.edge)
                        .filter(edge => edge !== undefined)
                        .map(edge => state.graph.edges[edge!])
                    const outputEdges = node.outputs
                        .map(output => state.graph.outputs[output])
                        .flatMap(output => output.edges)
                        .map(edge => state.graph.edges[edge])
                    const edges = inputEdges.concat(outputEdges)
                    for (const edge of edges) {
                        state.graph.inputs[edge.input].edge = undefined
                        const output = state.graph.outputs[edge.output]
                        output.edges = output.edges.filter(uuid => uuid !== edge.uuid)
                        delete state.graph.edges[edge.uuid]
                    }
                    delete state.graph.nodes[state.selectedNode]
                    state.nodeOrder = state.nodeOrder.filter(n => n !== state.selectedNode)
                    state.selectedNode = undefined
                    return { state, render: true }
                default:
                    return { state }
            }
    }
}

const virtualKeyDown = (state: State, { key }: VirtualKeyDown, generateUUID: GenerateUUID) => {
    switch (state.inputTarget.kind) {
        case InputTargetKind.FINDER:
            switch (key) {
                case 'del':
                    state.finder.search = state.finder.search.slice(0, -1)
                    break
                case 'sft':
                    break
                case 'space':
                    state.finder.search += ' '
                    break
                case 'ret':
                    if (state.finder.options.length > 0) {
                        const name = state.finder.options[0]
                        state = insertOperationFromFinder(state, name, generateUUID)
                    } else {
                        state = closeFinder(state)
                    }
                    break
                default:
                    state.finder.search += key
                    break
            }
            return { state: updateFinderOptions(state), render: true }
        case InputTargetKind.NUMBER:
            const node = state.graph.nodes[state.inputTarget.nodeUUID]
            let value = node.body!.value.toString()
            switch (key) {
                case 'del':
                    let newValue = value.slice(0, -1)
                    if (newValue === '') newValue = '0'
                    node.body!.value = parseFloat(newValue)
                    return { state, render: true }
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':
                case '.':
                    value += key
                    node.body!.value = parseFloat(value)
                    return { state, render: true }
                case 'ret':
                    node.body!.editing = false
                    state.virtualKeyboard = {
                        show: false,
                        kind: VirtualKeyboardKind.ALPHABETIC
                    }
                    state.inputTarget = {
                        kind: InputTargetKind.NONE
                    }
                    return { state, render: true }
                default:
                    return { state }
            }
        case InputTargetKind.NONE:
            return { state }
    }
}

const clickedFinderOption = (state: State, { option }: ClickedFinderOption, generateUUID: GenerateUUID) => ({
    state: insertOperationFromFinder(state, option, generateUUID),
    render: true
})

export const openNumericKeyboard = (state: State, nodeUUID: UUID): State => {
    state.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    }
    state.inputTarget = {
        kind: InputTargetKind.NUMBER,
        nodeUUID
    }
    state.graph.nodes[nodeUUID].body!.editing = true
    return state
}

const clickedNumber = (state: State, { node }: ClickedNumber) => {
    if (state.inputTarget.kind === InputTargetKind.NUMBER) {
        state.graph.nodes[state.inputTarget.nodeUUID].body!.editing = false
    }
    state = closeFinder(state)
    state = openNumericKeyboard(state, node)
    return {
        state,
        render: true
    }
}

const clickedBackground = (state: State) => {
    if (state.inputTarget.kind === InputTargetKind.NUMBER) {
        state.graph.nodes[state.inputTarget.nodeUUID].body!.editing = false
    }
    state.selectedNode = undefined
    state.selectedInput = undefined
    state.selectedOutput = undefined
    return {
        state: closeFinder(state),
        render: true
    }
}

export const update = (generateUUID: GenerateUUID, state: State, event: AppEvent): UpdateResult<State, AppEvent> => {
    switch (event.kind) {
        case EventKind.POINTER_DOWN: return pointerDown(state, event)
        case EventKind.POINTER_UP: return pointerUp(state, event)
        case EventKind.POINTER_MOVE: return pointerMove(state, event)
        case EventKind.CLICKED_NODE: return clickedNode(state, event)
        case EventKind.WHEEL: return wheel(state, event)
        case EventKind.CLICKED_INPUT: return clickedInput(state, event, generateUUID)
        case EventKind.CLICKED_OUTPUT: return clickedOutput(state, event, generateUUID)
        case EventKind.DOUBLE_CLICK_TIMEOUT: return doubleClickTimeout(state, event)
        case EventKind.DOUBLE_CLICK: return doubleClick(state, event)
        case EventKind.KEYDOWN: return keyDown(state, event, generateUUID)
        case EventKind.VIRTUAL_KEYDOWN: return virtualKeyDown(state, event, generateUUID)
        case EventKind.CLICKED_FINDER_OPTION: return clickedFinderOption(state, event, generateUUID)
        case EventKind.CLICKED_NUMBER: return clickedNumber(state, event)
        case EventKind.CLICKED_BACKGROUND: return clickedBackground(state)
    }
}
