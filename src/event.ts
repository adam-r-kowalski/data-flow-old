import { fuzzyFind } from "./fuzzy_find"
import { multiplyMatrices, multiplyMatrixVector, scale, translate } from "./linear_algebra/matrix3x3"
import { length } from "./linear_algebra/vector3"
import { UpdateResult } from "./ui/run"
import { InputTargetKind, SelectedKind, State, VirtualKeyboardKind } from "./state"
import { GenerateUUID, Operation, Position, UUID } from './graph/model'
import { Pointer } from "./ui"
import { addEdge, addNode, changeBodyValue, changeNodePosition, removeNode } from "./graph/update"

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
    CLICKED_BACKGROUND,
    DELETE_NODE
}

export interface PointerMove {
    readonly kind: EventKind.POINTER_MOVE
    readonly pointer: Pointer
}

export interface PointerDown {
    readonly kind: EventKind.POINTER_DOWN
    readonly pointer: Pointer
}

export interface PointerUp {
    readonly kind: EventKind.POINTER_UP
    readonly pointer: Pointer
}

export interface ClickedNode {
    readonly kind: EventKind.CLICKED_NODE
    readonly node: UUID
}

export interface Wheel {
    readonly kind: EventKind.WHEEL
    readonly position: Position
    readonly deltaY: number
}

export interface ClickedInput {
    readonly kind: EventKind.CLICKED_INPUT
    readonly input: UUID
}

export interface ClickedOutput {
    readonly kind: EventKind.CLICKED_OUTPUT
    readonly output: UUID
}

export interface DoubleClickTimeout {
    readonly kind: EventKind.DOUBLE_CLICK_TIMEOUT
}

export interface DoubleClick {
    readonly kind: EventKind.DOUBLE_CLICK
    readonly pointer: Pointer
}

export interface KeyDown {
    readonly kind: EventKind.KEYDOWN
    readonly key: string
}

export interface VirtualKeyDown {
    readonly kind: EventKind.VIRTUAL_KEYDOWN
    readonly key: string
}

export interface ClickedFinderOption {
    readonly kind: EventKind.CLICKED_FINDER_OPTION
    readonly option: string
}

export interface ClickedNumber {
    readonly kind: EventKind.CLICKED_NUMBER,
    readonly node: UUID
}

export interface ClickedBackground {
    readonly kind: EventKind.CLICKED_BACKGROUND,
}

export interface DeleteNode {
    readonly kind: EventKind.DELETE_NODE,
    readonly node: UUID
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
    | DeleteNode


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
    [...xs.slice(0, i), x, ...xs.slice(i + 1)]

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
            if (state.selected.kind === SelectedKind.NODE) {
                const scaling = length(multiplyMatrixVector(state.camera, [0, 1, 0]))
                const graph = changeNodePosition(state.graph, state.selected.node, p => ({
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
            const [p0, p1] = [pointers[0], pointers[1]]
            const { x: x1, y: y1 } = p0.position
            const { x: x2, y: y2 } = p1.position
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
                    state: { ...state, pointerCenter, pointerDistance, pointers, camera },
                    render: true
                }
            } else {
                return { state: { ...state, pointerCenter, pointerDistance, pointers } }
            }
        }
    }
}

const clickedNode = (state: State, event: ClickedNode): UpdateResult<State, AppEvent> => {
    const nodeOrder = state.nodeOrder.filter(uuid => uuid !== event.node)
    nodeOrder.push(event.node)
    return {
        state: {
            ...state,
            selected: {
                kind: SelectedKind.NODE,
                node: event.node,
            },
            nodeOrder
        },
        render: true
    }
}

const wheel = (state: State, event: Wheel): UpdateResult<State, AppEvent> => {
    const move = translate(event.position.x, event.position.y)
    const zoom = Math.pow(2, event.deltaY * 0.01)
    const moveBack = translate(-event.position.x, -event.position.y)
    const camera = multiplyMatrices(state.camera, move, scale(zoom, zoom), moveBack)
    return {
        state: { ...state, camera },
        render: true
    }
}

const clickedInput = (state: State, event: ClickedInput, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> => {
    if (state.selected.kind === SelectedKind.OUTPUT) {
        const { graph } = addEdge({
            graph: state.graph,
            input: event.input,
            output: state.selected.output,
            generateUUID
        })
        return {
            state: {
                ...state,
                selected: { kind: SelectedKind.NONE },
                graph
            },
            render: true
        }
    } else {
        return {
            state: {
                ...state,
                selected: { kind: SelectedKind.INPUT, input: event.input }
            },
            render: true
        }
    }
}

const clickedOutput = (state: State, event: ClickedOutput, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> => {
    if (state.selected.kind === SelectedKind.INPUT) {
        const { graph } = addEdge({
            graph: state.graph,
            input: state.selected.input,
            output: event.output,
            generateUUID
        })
        return {
            state: {
                ...state,
                selected: { kind: SelectedKind.NONE },
                graph
            },
            render: true
        }
    } else {
        return {
            state: {
                ...state,
                selected: { kind: SelectedKind.OUTPUT, output: event.output }
            },
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

const insertOperationFromFinder = (state: State, name: string, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> => {
    const operation = state.operations[name]
    const [x, y, _] = multiplyMatrixVector(
        state.camera,
        [state.nodePlacementLocation.x, state.nodePlacementLocation.y, 1]
    )
    const { state: nextState } = addNodeToGraph({ state, operation, position: { x, y }, generateUUID })
    return {
        state: closeFinder(nextState),
        render: true
    }
}

const updateFinderSearch = (state: State, transform: (search: string) => string): UpdateResult<State, AppEvent> => ({
    state: updateFinderOptions({
        ...state,
        finder: {
            ...state.finder,
            search: transform(state.finder.search)
        }
    }),
    render: true
})

const updateBodyValue = (state: State, body: UUID, transform: (value: number) => number): UpdateResult<State, AppEvent> => {
    return {
        state: {
            ...state,
            graph: changeBodyValue(state.graph, body, transform)
        },
        render: true
    }
}

interface AddNodeInputs {
    state: State
    operation: Operation
    position: Position
    generateUUID: GenerateUUID
}

interface AddNodeOutputs {
    state: State
    node: UUID
}


export const addNodeToGraph = ({ state, operation, position, generateUUID }: AddNodeInputs): AddNodeOutputs => {
    const { graph, node } = addNode({ graph: state.graph, operation, position, generateUUID })
    return {
        state: {
            ...state,
            graph,
            nodeOrder: [...state.nodeOrder, node]
        },
        node
    }
}

export const removeNodeFromGraph = (state: State, node: UUID): State => ({
    ...state,
    graph: removeNode(state.graph, node),
    nodeOrder: state.nodeOrder.filter(n => n !== node),
    selected: { kind: SelectedKind.NONE }
})

const keyDown = (state: State, { key }: KeyDown, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> => {
    switch (state.inputTarget.kind) {
        case InputTargetKind.FINDER:
            switch (key) {
                case 'Backspace':
                    return updateFinderSearch(state, search => search.slice(0, -1))
                case 'Shift':
                case 'Alt':
                case 'Control':
                case 'Meta':
                case 'Tab':
                    return { state }
                case 'Enter':
                    if (state.finder.options.length > 0) {
                        const name = state.finder.options[0]
                        return insertOperationFromFinder(state, name, generateUUID)
                    } else {
                        return { state: closeFinder(state), render: true }
                    }
                case 'Escape':
                    return { state: closeFinder(state), render: true }
                default:
                    return updateFinderSearch(state, search => search + key)
            }
        case InputTargetKind.NUMBER:
            const node = state.graph.nodes[state.inputTarget.node]
            switch (key) {
                case 'Backspace':
                    return updateBodyValue(state, node.body!, value => {
                        let newValue = value.toString().slice(0, -1)
                        return newValue === '' ? 0 : parseFloat(newValue)
                    })
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
                    return updateBodyValue(state, node.body!, value => parseFloat(value.toString() + key))
                case 'Enter':
                    return {
                        state: {
                            ...state,
                            virtualKeyboard: {
                                show: false,
                                kind: VirtualKeyboardKind.ALPHABETIC
                            },
                            inputTarget: { kind: InputTargetKind.NONE },
                            selected: { kind: SelectedKind.NONE }
                        },
                        render: true
                    }
                default:
                    return { state }
            }
        case InputTargetKind.NONE:
            switch (key) {
                case 'f':
                    return { state: openFinder(state), render: true }
                case 'd':
                    switch (state.selected.kind) {
                        case SelectedKind.NODE:
                            return {
                                state: removeNodeFromGraph(state, state.selected.node),
                                render: true
                            }
                        default:
                            return { state }
                    }
                default:
                    return { state }
            }
    }
}

const virtualKeyDown = (state: State, { key }: VirtualKeyDown, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> => {
    switch (state.inputTarget.kind) {
        case InputTargetKind.FINDER:
            switch (key) {
                case 'del':
                    return updateFinderSearch(state, search => search.slice(0, -1))
                case 'sft':
                    return { state }
                case 'space':
                    return updateFinderSearch(state, search => search + ' ')
                case 'ret':
                    if (state.finder.options.length > 0) {
                        const name = state.finder.options[0]
                        return insertOperationFromFinder(state, name, generateUUID)
                    } else {
                        return { state: closeFinder(state), render: true }
                    }
                default:
                    return updateFinderSearch(state, search => search + key)
            }
        case InputTargetKind.NUMBER:
            const node = state.graph.nodes[state.inputTarget.node]
            switch (key) {
                case 'del':
                    return updateBodyValue(state, node.body!, value => {
                        let newValue = value.toString().slice(0, -1)
                        return newValue === '' ? 0 : parseFloat(newValue)
                    })
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
                    return updateBodyValue(state, node.body!, value => parseFloat(value.toString() + key))
                case 'ret':
                    return {
                        state: {
                            ...state,
                            virtualKeyboard: {
                                show: false,
                                kind: VirtualKeyboardKind.ALPHABETIC
                            },
                            inputTarget: { kind: InputTargetKind.NONE },
                            selected: { kind: SelectedKind.NONE }
                        },
                        render: true
                    }
                default:
                    return { state }
            }
        case InputTargetKind.NONE:
            return { state }
    }
}

const clickedFinderOption = (state: State, { option }: ClickedFinderOption, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> =>
    insertOperationFromFinder(state, option, generateUUID)

export const openNumericKeyboard = (state: State, node: UUID): State => ({
    ...state,
    virtualKeyboard: {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    },
    inputTarget: {
        kind: InputTargetKind.NUMBER,
        node
    },
    selected: {
        kind: SelectedKind.BODY,
        body: state.graph.nodes[node].body!
    }
})

const clickedNumber = (state: State, { node }: ClickedNumber): UpdateResult<State, AppEvent> => ({
    state: openNumericKeyboard(closeFinder(state), node),
    render: true
})

const clickedBackground = (state: State): UpdateResult<State, AppEvent> => ({
    state: closeFinder({ ...state, selected: { kind: SelectedKind.NONE } }),
    render: true
})

const deleteNode = (state: State, { node }: DeleteNode): UpdateResult<State, AppEvent> => ({
    state: removeNodeFromGraph(state, node),
    render: true
})

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
        case EventKind.DELETE_NODE: return deleteNode(state, event)
    }
}
