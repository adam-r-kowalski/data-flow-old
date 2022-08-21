import { fuzzyFind } from "../fuzzy_find"
import { multiplyMatrices, multiplyMatrixVector, scale, translate } from "../linear_algebra/matrix3x3"
import { length } from "../linear_algebra/vector3"
import { Effects, UpdateResult } from "../ui/run"
import { Model, NodePlacementLocation } from "../model"
import { Focus, FocusFinder, FocusKind } from '../model/focus'
import { PointerAction, PointerActionKind } from '../model/pointer_action'
import { GenerateUUID, Operation, Operations, Position, UUID } from '../model/graph'
import { Pointer } from "../ui"
import { addNode, changeNumberText, changeNodePosition, removeInputEdge, removeNode, removeOutputEdges } from "./graph"
import { maybeTriggerQuickSelect, quickSelectInput, quickSelectOutput, quickSelectNode, quickSelectBody } from "./quick_select"
import { QuickSelectKind } from "../model/quick_select"
import { clearFocus, selectInput, selectOutput } from "./focus"
import { maybeStartMoveCamera, maybeStopMoveCamera, panCamera, zoomCamera } from "./move_camera"
import { maybeStartMoveNode, maybeStopMoveNode, moveNode } from "./move_node"

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
    KEYUP,
    CLICKED_FINDER_OPTION,
    CLICKED_BODY,
    CLICKED_BACKGROUND,
    DELETE_NODE,
    DELETE_INPUT_EDGE,
    DELETE_OUTPUT_EDGES,
    PAN_CAMERA,
    ZOOM_CAMERA,
    MOVE_NODE,
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

export interface KeyUp {
    readonly kind: EventKind.KEYUP
    readonly key: string
    readonly ctrl: boolean
}


export interface KeyDown {
    readonly kind: EventKind.KEYDOWN
    readonly key: string
    readonly ctrl: boolean
}

export interface ClickedFinderOption {
    readonly kind: EventKind.CLICKED_FINDER_OPTION
    readonly option: string
}

export interface ClickedNumber {
    readonly kind: EventKind.CLICKED_BODY,
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

export interface PanCamera {
    readonly kind: EventKind.PAN_CAMERA,
}

export interface ZoomCamera {
    readonly kind: EventKind.ZOOM_CAMERA,
}

export interface MoveNode {
    readonly kind: EventKind.MOVE_NODE,
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
    | KeyUp
    | ClickedFinderOption
    | ClickedNumber
    | ClickedBackground
    | DeleteNode
    | DeleteInputEdge
    | DeleteOutputEdges
    | PanCamera
    | ZoomCamera
    | MoveNode

const pointerDown = (model: Model, event: PointerDown): UpdateResult<Model, AppEvent> => {
    const pointers = [...model.pointers, event.pointer]
    if (model.focus.kind !== FocusKind.NONE) {
        return { model: { ...model, pointers } }
    } else if (pointers.length > 1) {
        const pointerAction: PointerAction = pointers.length === 2 ?
            {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 0, y: 0 },
                pointerDistance: 0
            } :
            { kind: PointerActionKind.NONE }
        return {
            model: {
                ...model,
                openFinderFirstClick: false,
                focus: {
                    kind: FocusKind.NONE,
                    pointerAction,
                    quickSelect: { kind: QuickSelectKind.NONE }
                },
                pointers
            }
        }
    } else {
        return {
            model: {
                ...model,
                focus: {
                    kind: FocusKind.NONE,
                    pointerAction: { kind: PointerActionKind.PAN },
                    quickSelect: { kind: QuickSelectKind.NONE }
                },
                pointers
            }
        }
    }
}

const pointerUp = (model: Model, event: PointerUp): UpdateResult<Model, AppEvent> => {
    const pointers = model.pointers.filter(p => p.id !== event.pointer.id)
    switch (model.focus.kind) {
        case FocusKind.NONE:
            switch (pointers.length) {
                case 1: return {
                    model: {
                        ...model,
                        pointers,
                        focus: {
                            kind: FocusKind.NONE,
                            pointerAction: { kind: PointerActionKind.PAN },
                            quickSelect: { kind: QuickSelectKind.NONE }
                        },
                    }
                }
                case 0: return {
                    model: {
                        ...model,
                        pointers,
                        focus: {
                            kind: FocusKind.NONE,
                            pointerAction: { kind: PointerActionKind.NONE },
                            quickSelect: { kind: QuickSelectKind.NONE }
                        },
                    }
                }
                default: return { model: { ...model, pointers } }
            }
        case FocusKind.NODE:
            if (pointers.length === 0) {
                const focus: Focus = { ...model.focus, drag: false }
                return { model: { ...model, pointers, focus } }
            } else {
                return { model: { ...model, pointers } }
            }
        default:
            return { model: { ...model, pointers } }
    }
}

export const changeNth = <T>(xs: Readonly<T[]>, i: number, x: T): T[] =>
    [...xs.slice(0, i), x, ...xs.slice(i + 1)]

const pointerMove = (model: Model, event: PointerMove): UpdateResult<Model, AppEvent> => {
    const result = (() => {
        const index = model.pointers.findIndex(p => p.id === event.pointer.id)
        const pointer = model.pointers[index]
        const pointers = index === -1 ? model.pointers : changeNth(model.pointers, index, event.pointer)
        const nodePlacementLocation: NodePlacementLocation = {
            x: event.pointer.position.x,
            y: event.pointer.position.y,
            show: false
        }
        switch (model.focus.kind) {
            case FocusKind.NONE:
                const previousPointerAction = model.focus.pointerAction
                switch (previousPointerAction.kind) {
                    case PointerActionKind.NONE:
                        const render = model.nodePlacementLocation.show ? true : undefined
                        return { model: { ...model, nodePlacementLocation, pointers }, render }
                    case PointerActionKind.PAN:
                        const dx = event.pointer.position.x - pointer.position.x
                        const dy = event.pointer.position.y - pointer.position.y
                        const camera = multiplyMatrices(model.camera, translate(-dx, -dy))
                        return {
                            model: { ...model, pointers, camera },
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
                            pointerAction,
                            quickSelect: { kind: QuickSelectKind.NONE }
                        }
                        if (previousPointerAction.pointerDistance > 0) {
                            const move = translate(x, y)
                            const zoom = Math.pow(2, (previousPointerAction.pointerDistance - pointerAction.pointerDistance) * 0.01)
                            const moveBack = translate(-x, -y)
                            const dx = x - previousPointerAction.pointerCenter.x
                            const dy = y - previousPointerAction.pointerCenter.y
                            const camera = multiplyMatrices(model.camera, move, scale(zoom, zoom), moveBack, translate(-dx, -dy))
                            return {
                                model: { ...model, focus, pointers, camera },
                                render: true
                            }
                        } else {
                            return { model: { ...model, focus, pointers } }
                        }
                }
            case FocusKind.NODE:
                if (model.focus.drag) {
                    const dx = event.pointer.position.x - pointer.position.x
                    const dy = event.pointer.position.y - pointer.position.y
                    const scaling = length(multiplyMatrixVector(model.camera, [0, 1, 0]))
                    const graph = changeNodePosition(model.graph, model.focus.node, p => ({
                        x: p.x + dx * scaling,
                        y: p.y + dy * scaling,
                    }))
                    return {
                        model: { ...model, pointers, graph },
                        render: true
                    }
                } else {
                    return { model: { ...model, pointers, nodePlacementLocation } }
                }
            case FocusKind.BODY:
            case FocusKind.INPUT:
            case FocusKind.OUTPUT:
                return { model: { ...model, pointers, nodePlacementLocation } }
            case FocusKind.FINDER:
                return { model: { ...model, pointers } }
        }
    })()
    return { ...result, cursor: true }
}

const clickedNode = (model: Model, event: ClickedNode): UpdateResult<Model, AppEvent> => {
    const nodeOrder = model.nodeOrder.filter(uuid => uuid !== event.node)
    nodeOrder.push(event.node)
    return {
        model: {
            ...model,
            focus: {
                kind: FocusKind.NODE,
                node: event.node,
                drag: true,
                quickSelect: { kind: QuickSelectKind.NONE },
                move: { left: false, up: false, down: false, right: false, now: 0 }
            },
            nodeOrder
        },
        render: true
    }
}

const wheel = (model: Model, event: Wheel): UpdateResult<Model, AppEvent> => {
    const move = translate(event.position.x, event.position.y)
    const zoom = Math.pow(2, event.deltaY * 0.01)
    const moveBack = translate(-event.position.x, -event.position.y)
    const camera = multiplyMatrices(model.camera, move, scale(zoom, zoom), moveBack)
    return {
        model: { ...model, camera },
        render: true
    }
}

const clickedInput = (model: Model, event: ClickedInput, generateUUID: GenerateUUID): UpdateResult<Model, AppEvent> =>
    selectInput(model, event.input, generateUUID)

const clickedOutput = (model: Model, event: ClickedOutput, generateUUID: GenerateUUID): UpdateResult<Model, AppEvent> =>
    selectOutput(model, event.output, generateUUID)

const openFinderTimeout = (model: Model, _: OpenFinderTimeout): UpdateResult<Model, AppEvent> => ({
    model: {
        ...model,
        openFinderFirstClick: false
    }
})

const finderOptions = (operations: Operations, search: string): string[] =>
    Object.keys(operations)
        .filter(item => fuzzyFind({ haystack: item, needle: search }))

export const openFinder = (model: Model): Model => ({
    ...model,
    focus: {
        kind: FocusKind.FINDER,
        search: '',
        options: Object.keys(model.operations),
        quickSelect: { kind: QuickSelectKind.NONE }
    },
    openFinderFirstClick: false,
})


const insertOperationFromFinder = (model: Model, name: string, generateUUID: GenerateUUID): UpdateResult<Model, AppEvent> => {
    const operation = model.operations[name]
    const [x, y, _] = multiplyMatrixVector(
        model.camera,
        [model.nodePlacementLocation.x, model.nodePlacementLocation.y, 1]
    )
    const { model: nextModel } = addNodeToGraph({ model, operation, position: { x, y }, generateUUID })
    return {
        model: clearFocus(nextModel),
        render: true
    }
}

const updateFinderSearch = (model: Model, focus: FocusFinder, transform: (search: string) => string): UpdateResult<Model, AppEvent> => {
    const search = transform(focus.search)
    return {
        model: {
            ...model,
            focus: {
                kind: FocusKind.FINDER,
                options: finderOptions(model.operations, search),
                search,
                quickSelect: { kind: QuickSelectKind.NONE }
            }
        },
        render: true
    }
}

export const updateNumberText = (model: Model, body: UUID, transform: (text: string) => string): UpdateResult<Model, AppEvent> => {
    return {
        model: {
            ...model,
            graph: changeNumberText(model.graph, body, transform)
        },
        render: true
    }
}

interface AddNodeInputs {
    model: Model
    operation: Operation
    position: Position
    generateUUID: GenerateUUID
}

interface AddNodeOutputs {
    model: Model
    node: UUID
}


export const addNodeToGraph = ({ model, operation, position, generateUUID }: AddNodeInputs): AddNodeOutputs => {
    const { graph, node } = addNode({ graph: model.graph, operation, position, generateUUID })
    return {
        model: {
            ...model,
            graph,
            nodeOrder: [...model.nodeOrder, node]
        },
        node
    }
}

export const removeNodeFromGraph = (model: Model, node: UUID): Model => clearFocus({
    ...model,
    graph: removeNode(model.graph, node),
    nodeOrder: model.nodeOrder.filter(n => n !== node),
})

const keyDown = (model: Model, event: KeyDown, { generateUUID, currentTime }: Effects): UpdateResult<Model, AppEvent> => {
    const { key } = event
    switch (model.focus.quickSelect.kind) {
        case QuickSelectKind.INPUT:
            return quickSelectInput(model, model.focus.quickSelect, key, generateUUID)
        case QuickSelectKind.OUTPUT:
            return quickSelectOutput(model, model.focus.quickSelect, key, generateUUID)
        case QuickSelectKind.NODE:
            return quickSelectNode(model, model.focus.quickSelect, key)
        case QuickSelectKind.BODY:
            return quickSelectBody(model, model.focus.quickSelect, key)
        case QuickSelectKind.NONE:
            switch (model.focus.kind) {
                case FocusKind.FINDER:
                    switch (key) {
                        case 'Backspace':
                            return updateFinderSearch(model, model.focus, search => search.slice(0, -1))
                        case 'Shift':
                        case 'Alt':
                        case 'Control':
                        case 'Meta':
                        case 'Tab':
                            return { model }
                        case 'Enter':
                            if (model.focus.options.length > 0) {
                                const name = model.focus.options[0]
                                return insertOperationFromFinder(model, name, generateUUID)
                            } else {
                                return { model: clearFocus(model), render: true }
                            }
                        case 'Escape':
                            return { model: clearFocus(model), render: true }
                        default:
                            return updateFinderSearch(model, model.focus, search => search + key)
                    }
                case FocusKind.BODY:
                    switch (key) {
                        case 'Backspace':
                            return updateNumberText(model, model.focus.body, text => {
                                const nextText = text.slice(0, -1)
                                return nextText === '' ? '0' : nextText
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
                            return updateNumberText(model, model.focus.body, text => {
                                if (text === '0') { return key }
                                else if (text === '-0') { return `-${key}` }
                                else { return text + key }
                            })
                        case '.':
                            return updateNumberText(model, model.focus.body, text => text.includes('.') ? text : text + key)
                        case '-':
                        case '+':
                            return updateNumberText(model, model.focus.body, text => {
                                if (text.length && text[0] === '-') {
                                    return text.slice(1)
                                } else {
                                    return '-' + text
                                }
                            })
                        case 'c':
                            return updateNumberText(model, model.focus.body, () => '0')
                        case 'Enter':
                        case 'Escape':
                            return {
                                model: clearFocus(model),
                                render: true
                            }
                        default:
                            return maybeTriggerQuickSelect(model, model.focus, key)
                    }
                case FocusKind.NODE:
                    switch (key) {
                        case 'f':
                            return { model: openFinder(model), render: true }
                        case 'd':
                        case 'Backspace':
                        case 'Delete':
                            return {
                                model: removeNodeFromGraph(model, model.focus.node),
                                render: true
                            }
                        case 'Escape':
                            return { model: clearFocus(model), render: true }
                        default:
                            const result = maybeTriggerQuickSelect(model, model.focus, key)
                            if (result.render) {
                                return result
                            } else {
                                return maybeStartMoveNode(result.model, model.focus, key, currentTime)
                            }
                    }
                case FocusKind.INPUT:
                    switch (key) {
                        case 'f':
                            return { model: openFinder(model), render: true }
                        case 'd':
                        case 'Backspace':
                        case 'Delete':
                            return {
                                model: clearFocus({
                                    ...model,
                                    graph: removeInputEdge(model.graph, model.focus.input, generateUUID),
                                }),
                                render: true
                            }
                        case 'Escape':
                            return { model: clearFocus(model), render: true }
                        default:
                            return maybeTriggerQuickSelect(model, model.focus, key)
                    }
                case FocusKind.OUTPUT:
                    switch (key) {
                        case 'f':
                            return { model: openFinder(model), render: true }
                        case 'd':
                        case 'Backspace':
                        case 'Delete':
                            return {
                                model: clearFocus({
                                    ...model,
                                    graph: removeOutputEdges(model.graph, model.focus.output),
                                }),
                                render: true
                            }
                        case 'Escape':
                            return { model: clearFocus(model), render: true }
                        default:
                            return maybeTriggerQuickSelect(model, model.focus, key)
                    }
                case FocusKind.NONE:
                    if (key == 'f') {
                        return { model: openFinder(model), render: true }
                    } else {
                        const result = maybeTriggerQuickSelect(model, model.focus, key)
                        if (result.render) {
                            return result
                        } else {
                            return maybeStartMoveCamera(result.model, event, currentTime)
                        }
                    }
            }
    }
}

const keyUp = (model: Model, event: KeyUp): UpdateResult<Model, AppEvent> => {
    switch (model.focus.kind) {
        case FocusKind.NONE:
            return maybeStopMoveCamera(model, event)
        case FocusKind.NODE:
            return maybeStopMoveNode(model, model.focus, event.key)
        default:
            return { model }
    }
}

const clickedFinderOption = (model: Model, { option }: ClickedFinderOption, generateUUID: GenerateUUID): UpdateResult<Model, AppEvent> =>
    insertOperationFromFinder(model, option, generateUUID)

export const openNumericKeyboard = (model: Model, body: UUID): Model => ({
    ...model,
    focus: {
        kind: FocusKind.BODY,
        body,
        quickSelect: { kind: QuickSelectKind.NONE }
    }
})

const clickedNumber = (model: Model, { body }: ClickedNumber): UpdateResult<Model, AppEvent> => ({
    model: openNumericKeyboard(clearFocus(model), body),
    render: true
})

const clickedBackground = (model: Model): UpdateResult<Model, AppEvent> => {
    if (model.focus.kind === FocusKind.FINDER) {
        return {
            model: clearFocus(model),
            render: true
        }
    } else if (model.openFinderFirstClick) {
        const { x, y } = model.pointers[0].position
        return {
            model: openFinder({
                ...model,
                nodePlacementLocation: { x, y, show: false },
            }),
            render: true
        }
    } else {
        const focus: Focus = model.focus.kind === FocusKind.NONE ? model.focus : {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE }
        }
        return {
            model: {
                ...model,
                openFinderFirstClick: model.pointers.length == 1,
                focus
            },
            schedule: [
                { after: { milliseconds: 300 }, event: { kind: EventKind.OPEN_FINDER_TIMEOUT } }
            ],
            render: true
        }
    }
}

const deleteNode = (model: Model, { node }: DeleteNode): UpdateResult<Model, AppEvent> => ({
    model: removeNodeFromGraph(model, node),
    render: true
})

const deleteInputEdge = (model: Model, { input }: DeleteInputEdge, generateUUID: GenerateUUID): UpdateResult<Model, AppEvent> => ({
    model: clearFocus({
        ...model,
        graph: removeInputEdge(model.graph, input, generateUUID),
    }),
    render: true
})

const deleteOutputEdges = (model: Model, { output }: DeleteOutputEdges): UpdateResult<Model, AppEvent> => ({
    model: clearFocus({
        ...model,
        graph: removeOutputEdges(model.graph, output),
    }),
    render: true
})

export const update = (effects: Effects, model: Model, event: AppEvent): UpdateResult<Model, AppEvent> => {
    switch (event.kind) {
        case EventKind.POINTER_DOWN: return pointerDown(model, event)
        case EventKind.POINTER_UP: return pointerUp(model, event)
        case EventKind.POINTER_MOVE: return pointerMove(model, event)
        case EventKind.CLICKED_NODE: return clickedNode(model, event)
        case EventKind.WHEEL: return wheel(model, event)
        case EventKind.CLICKED_INPUT: return clickedInput(model, event, effects.generateUUID)
        case EventKind.CLICKED_OUTPUT: return clickedOutput(model, event, effects.generateUUID)
        case EventKind.OPEN_FINDER_TIMEOUT: return openFinderTimeout(model, event)
        case EventKind.KEYDOWN: return keyDown(model, event, effects)
        case EventKind.KEYUP: return keyUp(model, event)
        case EventKind.CLICKED_FINDER_OPTION: return clickedFinderOption(model, event, effects.generateUUID)
        case EventKind.CLICKED_BODY: return clickedNumber(model, event)
        case EventKind.CLICKED_BACKGROUND: return clickedBackground(model)
        case EventKind.DELETE_NODE: return deleteNode(model, event)
        case EventKind.DELETE_INPUT_EDGE: return deleteInputEdge(model, event, effects.generateUUID)
        case EventKind.DELETE_OUTPUT_EDGES: return deleteOutputEdges(model, event)
        case EventKind.PAN_CAMERA: return panCamera(model, effects.currentTime)
        case EventKind.ZOOM_CAMERA: return zoomCamera(model, effects.currentTime)
        case EventKind.MOVE_NODE: return moveNode(model, effects.currentTime)
    }
}
