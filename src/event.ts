import { fuzzyFind } from "./fuzzy_find"
import { multiplyMatrices, multiplyMatrixVector, scale, translate } from "./linear_algebra/matrix3x3"
import { length } from "./linear_algebra/vector3"
import { UpdateResult } from "./ui/run"
import { Focus, FocusFinder, FocusKind, PointerAction, PointerActionKind, State } from "./state"
import { GenerateUUID, Operation, Operations, Position, UUID } from './graph/model'
import { Pointer } from "./ui"
import { addEdge, addNode, changeBodyValue, changeNodePosition, removeInputEdge, removeNode, removeOutputEdges } from "./graph/update"

export enum EventKind {
    POINTER_MOVE,
    POINTER_DOWN,
    POINTER_UP,
    CLICKED_NODE,
    WHEEL,
    CLICKED_INPUT,
    CLICKED_OUTPUT,
    OPEN_FINDER_TIMEOUT,
    KEYDOWN,
    VIRTUAL_KEYDOWN,
    CLICKED_FINDER_OPTION,
    CLICKED_NUMBER,
    CLICKED_BACKGROUND,
    DELETE_NODE,
    DELETE_INPUT_EDGE,
    DELETE_OUTPUT_EDGES,
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

export interface OpenFinderTimeout {
    readonly kind: EventKind.OPEN_FINDER_TIMEOUT
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
    readonly body: UUID
}

export interface ClickedBackground {
    readonly kind: EventKind.CLICKED_BACKGROUND,
}

export interface DeleteNode {
    readonly kind: EventKind.DELETE_NODE,
    readonly node: UUID
}

export interface DeleteInputEdge {
    readonly kind: EventKind.DELETE_INPUT_EDGE,
    readonly input: UUID
}

export interface DeleteOutputEdges {
    readonly kind: EventKind.DELETE_OUTPUT_EDGES,
    readonly output: UUID
}


export type AppEvent =
    | PointerMove
    | PointerDown
    | PointerUp
    | ClickedNode
    | Wheel
    | ClickedInput
    | ClickedOutput
    | OpenFinderTimeout
    | KeyDown
    | VirtualKeyDown
    | ClickedFinderOption
    | ClickedNumber
    | ClickedBackground
    | DeleteNode
    | DeleteInputEdge
    | DeleteOutputEdges


const pointerDown = (state: State, event: PointerDown): UpdateResult<State, AppEvent> => {
    const pointers = [...state.pointers, event.pointer]
    if (state.focus.kind !== FocusKind.NONE) {
        return { state: { ...state, pointers } }
    } else if (pointers.length > 1) {
        const pointerAction: PointerAction = pointers.length === 2 ?
            {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 0, y: 0 },
                pointerDistance: 0
            } :
            { kind: PointerActionKind.NONE }
        return {
            state: {
                ...state,
                openFinderFirstClick: false,
                focus: {
                    kind: FocusKind.NONE,
                    pointerAction
                },
                pointers
            }
        }
    } else {
        return {
            state: {
                ...state,
                focus: {
                    kind: FocusKind.NONE,
                    pointerAction: { kind: PointerActionKind.PAN }
                },
                pointers
            }
        }
    }
}

const pointerUp = (state: State, event: PointerUp): UpdateResult<State, AppEvent> => {
    const pointers = state.pointers.filter(p => p.id !== event.pointer.id)
    switch (state.focus.kind) {
        case FocusKind.NONE:
            switch (pointers.length) {
                case 1: return {
                    state: {
                        ...state,
                        pointers,
                        focus: {
                            kind: FocusKind.NONE,
                            pointerAction: { kind: PointerActionKind.PAN }
                        },
                    }
                }
                case 0: return {
                    state: {
                        ...state,
                        pointers,
                        focus: {
                            kind: FocusKind.NONE,
                            pointerAction: { kind: PointerActionKind.NONE }
                        },
                    }
                }
                default: return { state: { ...state, pointers } }
            }
        case FocusKind.NODE:
            if (pointers.length === 0) {
                const focus: Focus = { ...state.focus, drag: false }
                return { state: { ...state, pointers, focus } }
            } else {
                return { state: { ...state, pointers } }
            }
        default:
            return { state: { ...state, pointers } }
    }
}

export const changeNth = <T>(xs: Readonly<T[]>, i: number, x: T): T[] =>
    [...xs.slice(0, i), x, ...xs.slice(i + 1)]

const pointerMove = (state: State, event: PointerMove): UpdateResult<State, AppEvent> => {
    const index = state.pointers.findIndex(p => p.id === event.pointer.id)
    const pointer = state.pointers[index]
    const pointers = index === -1 ? state.pointers : changeNth(state.pointers, index, event.pointer)
    const nodePlacementLocation = event.pointer.position
    switch (state.focus.kind) {
        case FocusKind.NONE:
            const previousPointerAction = state.focus.pointerAction
            switch (previousPointerAction.kind) {
                case PointerActionKind.NONE:
                    return { state: { ...state, nodePlacementLocation, pointers } }
                case PointerActionKind.PAN:
                    const dx = event.pointer.position.x - pointer.position.x
                    const dy = event.pointer.position.y - pointer.position.y
                    const camera = multiplyMatrices(state.camera, translate(-dx, -dy))
                    return {
                        state: { ...state, pointers, camera },
                        render: true
                    }
                case PointerActionKind.ZOOM:
                    const [p0, p1] = [pointers[0], pointers[1]]
                    const { x: x1, y: y1 } = p0.position
                    const { x: x2, y: y2 } = p1.position
                    const x = (p0.position.x + p1.position.x) / 2
                    const y = (p0.position.y + p1.position.y) / 2
                    const pointerAction: PointerAction = {
                        kind: PointerActionKind.ZOOM,
                        pointerDistance: Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
                        pointerCenter: { x, y },
                    }
                    const focus: Focus = {
                        kind: FocusKind.NONE,
                        pointerAction
                    }
                    if (previousPointerAction.pointerDistance > 0) {
                        const move = translate(x, y)
                        const zoom = Math.pow(2, (previousPointerAction.pointerDistance - pointerAction.pointerDistance) * 0.01)
                        const moveBack = translate(-x, -y)
                        const dx = x - previousPointerAction.pointerCenter.x
                        const dy = y - previousPointerAction.pointerCenter.y
                        const camera = multiplyMatrices(state.camera, move, scale(zoom, zoom), moveBack, translate(-dx, -dy))
                        return {
                            state: { ...state, focus, pointers, camera },
                            render: true
                        }
                    } else {
                        return { state: { ...state, focus, pointers } }
                    }
            }
        case FocusKind.NODE:
            if (state.focus.drag) {
                const dx = event.pointer.position.x - pointer.position.x
                const dy = event.pointer.position.y - pointer.position.y
                const scaling = length(multiplyMatrixVector(state.camera, [0, 1, 0]))
                const graph = changeNodePosition(state.graph, state.focus.node, p => ({
                    x: p.x + dx * scaling,
                    y: p.y + dy * scaling,
                }))
                return {
                    state: { ...state, pointers, graph },
                    render: true
                }
            } else {
                return { state: { ...state, pointers, nodePlacementLocation } }
            }
        case FocusKind.BODY:
        case FocusKind.INPUT:
        case FocusKind.OUTPUT:
            return { state: { ...state, pointers, nodePlacementLocation } }
        case FocusKind.FINDER:
            return { state: { ...state, pointers } }
    }
}

const clickedNode = (state: State, event: ClickedNode): UpdateResult<State, AppEvent> => {
    const nodeOrder = state.nodeOrder.filter(uuid => uuid !== event.node)
    nodeOrder.push(event.node)
    return {
        state: {
            ...state,
            focus: {
                kind: FocusKind.NODE,
                node: event.node,
                drag: true
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

const clearFocus = (state: State): State => ({
    ...state,
    focus: {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE }
    }
})

const clickedInput = (state: State, event: ClickedInput, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> => {
    if (state.focus.kind === FocusKind.OUTPUT) {
        const input = state.graph.inputs[event.input]
        const output = state.graph.outputs[state.focus.output]
        if (input.node === output.node) {
            return { state }
        } else {
            const graph0 = input.edge !== undefined ?
                removeInputEdge(state.graph, input.uuid) :
                state.graph
            const { graph: graph1 } = addEdge({
                graph: graph0,
                input: event.input,
                output: state.focus.output,
                generateUUID
            })
            return {
                state: clearFocus({ ...state, graph: graph1 }),
                render: true
            }
        }
    } else {
        return {
            state: {
                ...state,
                focus: { kind: FocusKind.INPUT, input: event.input }
            },
            render: true
        }
    }
}

const clickedOutput = (state: State, event: ClickedOutput, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> => {
    if (state.focus.kind === FocusKind.INPUT) {
        const input = state.graph.inputs[state.focus.input]
        const output = state.graph.outputs[event.output]
        if (output.node === input.node) {
            return { state }
        } else {
            const graph0 = input.edge !== undefined ?
                removeInputEdge(state.graph, input.uuid) :
                state.graph
            const { graph: graph1 } = addEdge({
                graph: graph0,
                input: state.focus.input,
                output: event.output,
                generateUUID
            })
            return {
                state: clearFocus({ ...state, graph: graph1 }),
                render: true
            }
        }
    } else {
        return {
            state: {
                ...state,
                focus: { kind: FocusKind.OUTPUT, output: event.output },
            },
            render: true
        }
    }
}

const openFinderTimeout = (state: State, _: OpenFinderTimeout): UpdateResult<State, AppEvent> => ({
    state: {
        ...state,
        openFinderFirstClick: false
    }
})

const finderOptions = (operations: Operations, search: string): string[] =>
    Object.keys(operations)
        .filter(item => fuzzyFind({ haystack: item, needle: search }))

export const openFinder = (state: State): State => ({
    ...state,
    focus: {
        kind: FocusKind.FINDER,
        search: '',
        options: Object.keys(state.operations),
    },
    openFinderFirstClick: false
})


const insertOperationFromFinder = (state: State, name: string, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> => {
    const operation = state.operations[name]
    const [x, y, _] = multiplyMatrixVector(
        state.camera,
        [state.nodePlacementLocation.x, state.nodePlacementLocation.y, 1]
    )
    const { state: nextState } = addNodeToGraph({ state, operation, position: { x, y }, generateUUID })
    return {
        state: clearFocus(nextState),
        render: true
    }
}

const updateFinderSearch = (state: State, focus: FocusFinder, transform: (search: string) => string): UpdateResult<State, AppEvent> => {
    const search = transform(focus.search)
    return {
        state: {
            ...state,
            focus: {
                kind: FocusKind.FINDER,
                options: finderOptions(state.operations, search),
                search
            }
        },
        render: true
    }
}

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

export const removeNodeFromGraph = (state: State, node: UUID): State => clearFocus({
    ...state,
    graph: removeNode(state.graph, node),
    nodeOrder: state.nodeOrder.filter(n => n !== node),
})

const keyDown = (state: State, { key }: KeyDown, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> => {
    switch (state.focus.kind) {
        case FocusKind.FINDER:
            switch (key) {
                case 'Backspace':
                    return updateFinderSearch(state, state.focus, search => search.slice(0, -1))
                case 'Shift':
                case 'Alt':
                case 'Control':
                case 'Meta':
                case 'Tab':
                    return { state }
                case 'Enter':
                    if (state.focus.options.length > 0) {
                        const name = state.focus.options[0]
                        return insertOperationFromFinder(state, name, generateUUID)
                    } else {
                        return { state: clearFocus(state), render: true }
                    }
                case 'Escape':
                    return { state: clearFocus(state), render: true }
                default:
                    return updateFinderSearch(state, state.focus, search => search + key)
            }
        case FocusKind.BODY:
            switch (key) {
                case 'Backspace':
                    return updateBodyValue(state, state.focus.body, value => {
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
                    return updateBodyValue(state, state.focus.body, value => parseFloat(value.toString() + key))
                case 'Enter':
                case 'Escape':
                    return {
                        state: clearFocus(state),
                        render: true
                    }
                default:
                    return { state }
            }
        case FocusKind.NODE:
            switch (key) {
                case 'f':
                    return { state: openFinder(state), render: true }
                case 'd':
                    return {
                        state: removeNodeFromGraph(state, state.focus.node),
                        render: true
                    }
                case 'Escape':
                    return { state: clearFocus(state), render: true }
                default:
                    return { state }
            }
        case FocusKind.INPUT:
            switch (key) {
                case 'f':
                    return { state: openFinder(state), render: true }
                case 'd':
                    return {
                        state: clearFocus({
                            ...state,
                            graph: removeInputEdge(state.graph, state.focus.input),
                        }),
                        render: true
                    }
                case 'Escape':
                    return { state: clearFocus(state), render: true }
                default:
                    return { state }
            }
        case FocusKind.OUTPUT:
            switch (key) {
                case 'f':
                    return { state: openFinder(state), render: true }
                case 'd':
                    return {
                        state: clearFocus({
                            ...state,
                            graph: removeOutputEdges(state.graph, state.focus.output),
                        }),
                        render: true
                    }
                case 'Escape':
                    return { state: clearFocus(state), render: true }
                default:
                    return { state }
            }
        case FocusKind.NONE:
            switch (key) {
                case 'f':
                    return { state: openFinder(state), render: true }
                default:
                    return { state }
            }
    }
}

const virtualKeyDown = (state: State, { key }: VirtualKeyDown, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> => {
    switch (state.focus.kind) {
        case FocusKind.FINDER:
            switch (key) {
                case 'del':
                    return updateFinderSearch(state, state.focus, search => search.slice(0, -1))
                case 'sft':
                    return { state }
                case 'space':
                    return updateFinderSearch(state, state.focus, search => search + ' ')
                case 'ret':
                    if (state.focus.options.length > 0) {
                        const name = state.focus.options[0]
                        return insertOperationFromFinder(state, name, generateUUID)
                    } else {
                        return { state: clearFocus(state), render: true }
                    }
                default:
                    return updateFinderSearch(state, state.focus, search => search + key)
            }
        case FocusKind.BODY:
            switch (key) {
                case 'del':
                    return updateBodyValue(state, state.focus.body, value => {
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
                    return updateBodyValue(state, state.focus.body, value => parseFloat(value.toString() + key))
                case 'ret':
                    return {
                        state: clearFocus(state),
                        render: true
                    }
                default:
                    return { state }
            }
        default:
            return { state }
    }
}

const clickedFinderOption = (state: State, { option }: ClickedFinderOption, generateUUID: GenerateUUID): UpdateResult<State, AppEvent> =>
    insertOperationFromFinder(state, option, generateUUID)

export const openNumericKeyboard = (state: State, body: UUID): State => ({
    ...state,
    focus: {
        kind: FocusKind.BODY,
        body
    }
})

const clickedNumber = (state: State, { body }: ClickedNumber): UpdateResult<State, AppEvent> => ({
    state: openNumericKeyboard(clearFocus(state), body),
    render: true
})

const clickedBackground = (state: State): UpdateResult<State, AppEvent> => {
    if (state.focus.kind === FocusKind.FINDER) {
        return {
            state: clearFocus(state),
            render: true
        }
    } else if (state.openFinderFirstClick) {
        return {
            state: openFinder({
                ...state,
                nodePlacementLocation: state.pointers[0].position,
            }),
            render: true
        }
    } else {
        return {
            state: {
                ...state,
                openFinderFirstClick: true,
                focus: {
                    kind: FocusKind.NONE,
                    pointerAction: { kind: PointerActionKind.PAN }
                }
            },
            schedule: [
                { after: { milliseconds: 300 }, event: { kind: EventKind.OPEN_FINDER_TIMEOUT } }
            ],
            render: true
        }
    }
}

const deleteNode = (state: State, { node }: DeleteNode): UpdateResult<State, AppEvent> => ({
    state: removeNodeFromGraph(state, node),
    render: true
})

const deleteInputEdge = (state: State, { input }: DeleteInputEdge): UpdateResult<State, AppEvent> => ({
    state: clearFocus({
        ...state,
        graph: removeInputEdge(state.graph, input),
    }),
    render: true
})

const deleteOutputEdges = (state: State, { output }: DeleteOutputEdges): UpdateResult<State, AppEvent> => ({
    state: clearFocus({
        ...state,
        graph: removeOutputEdges(state.graph, output),
    }),
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
        case EventKind.OPEN_FINDER_TIMEOUT: return openFinderTimeout(state, event)
        case EventKind.KEYDOWN: return keyDown(state, event, generateUUID)
        case EventKind.VIRTUAL_KEYDOWN: return virtualKeyDown(state, event, generateUUID)
        case EventKind.CLICKED_FINDER_OPTION: return clickedFinderOption(state, event, generateUUID)
        case EventKind.CLICKED_NUMBER: return clickedNumber(state, event)
        case EventKind.CLICKED_BACKGROUND: return clickedBackground(state)
        case EventKind.DELETE_NODE: return deleteNode(state, event)
        case EventKind.DELETE_INPUT_EDGE: return deleteInputEdge(state, event)
        case EventKind.DELETE_OUTPUT_EDGES: return deleteOutputEdges(state, event)
    }
}
