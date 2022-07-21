import { fuzzyFind } from "./fuzzy_find"
import { multiplyMatrices, multiplyMatrixVector, scale, translate } from "./linear_algebra/matrix3x3"
import { length } from "./linear_algebra/vector3"
import { UpdateResult } from "./ui/run"
import { GenerateUUID, InputPath, InputTargetKind, OutputPath, State, UUID, VirtualKeyboardKind } from "./state"
import { Pointer } from "./ui"

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
    nodeUUID: UUID
}

export interface Wheel {
    kind: EventKind.WHEEL
    x: number
    y: number
    deltaY: number
}

export interface ClickedInput {
    kind: EventKind.CLICKED_INPUT
    inputPath: InputPath
}

export interface ClickedOutput {
    kind: EventKind.CLICKED_OUTPUT
    outputPath: OutputPath
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
    nodeUUID: UUID
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
    state.pointers.push(event.pointer)
    if (state.pointers.length > 1) {
        state.potentialDoubleClick = false
        state.dragging = false
        state.zooming = state.pointers.length === 2
        return { state }
    }
    if (state.potentialDoubleClick) {
        state.potentialDoubleClick = false
        return {
            state,
            dispatch: [{ kind: EventKind.DOUBLE_CLICK, pointer: event.pointer }]
        }
    }
    state.dragging = true
    state.potentialDoubleClick = true
    return {
        state,
        schedule: [
            { after: { milliseconds: 300 }, event: { kind: EventKind.DOUBLE_CLICK_TIMEOUT } }
        ]
    }
}

const pointerUp = (state: State, event: PointerUp) => {
    const index = state.pointers.findIndex(p => p.id === event.pointer.id)
    state.pointers.splice(index, 1)
    if (state.pointers.length === 1) {
        state.zooming = false
        state.dragging = true
        state.pointerDistance = 0
    }
    else if (state.pointers.length === 0) {
        state.dragging = false
        state.draggedNode = null
        state.pointerDistance = 0
    }
    return { state }
}

const pointerMove = (state: State, event: PointerMove) => {
    if (!state.dragging && !state.zooming) {
        if (!state.finder.show) {
            state.nodePlacementLocation = { x: event.pointer.x, y: event.pointer.y }
        }
        return { state, rerender: false }
    }
    const index = state.pointers.findIndex(p => p.id === event.pointer.id)
    const pointer = state.pointers[index]
    state.pointers[index] = event.pointer
    if (state.dragging) {
        const dx = event.pointer.x - pointer.x
        const dy = event.pointer.y - pointer.y
        if (state.draggedNode !== null) {
            const scaling = length(multiplyMatrixVector(state.camera, [0, 1, 0]))
            const node = state.graph.nodes[state.draggedNode]
            node.x += dx * scaling
            node.y += dy * scaling
        } else {
            state.camera = multiplyMatrices(state.camera, translate(-dx, -dy))
        }
        return { state, render: true }
    }
    // must be zooming
    const [p0, p1] = [state.pointers[0], state.pointers[1]]
    const [x1, y1] = [p0.x, p0.y]
    const [x2, y2] = [p1.x, p1.y]
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    const previousDistance = state.pointerDistance
    const previousCenter = state.pointerCenter
    state.pointerDistance = distance
    const x = (p0.x + p1.x) / 2
    const y = (p0.y + p1.y) / 2
    state.pointerCenter = [x, y]
    if (previousDistance > 0) {
        const move = translate(x, y)
        const zoom = Math.pow(2, (previousDistance - distance) * 0.01)
        const moveBack = translate(-x, -y)
        const dx = x - previousCenter[0]
        const dy = y - previousCenter[1]
        state.camera = multiplyMatrices(state.camera, move, scale(zoom, zoom), moveBack, translate(-dx, -dy))
        return { state, render: true }
    } else return { state }
}

const clickedNode = (state: State, event: ClickedNode) => {
    state.draggedNode = event.nodeUUID
    const nodeOrder = state.graph.nodeOrder.filter(uuid => uuid !== event.nodeUUID)
    nodeOrder.push(event.nodeUUID)
    state.graph.nodeOrder = nodeOrder
    return { state, render: true }
}

const wheel = (state: State, event: Wheel) => {
    const move = translate(event.x, event.y)
    const zoom = Math.pow(2, event.deltaY * 0.01)
    const moveBack = translate(-event.x, -event.y)
    state.camera = multiplyMatrices(state.camera, move, scale(zoom, zoom), moveBack)
    return { state, render: true }
}

const clickedInput = (state: State, event: ClickedInput) => {
    state.draggedNode = event.inputPath.nodeUUID
    const nodeOrder = state.graph.nodeOrder.filter(uuid => uuid !== event.inputPath.nodeUUID)
    nodeOrder.push(event.inputPath.nodeUUID)
    state.graph.nodeOrder = nodeOrder
    if (state.selectedOutput) {
        const edgeIndex = state.graph.edges.length
        state.graph.edges.push({
            input: event.inputPath,
            output: state.selectedOutput
        })
        {
            const { nodeUUID, outputIndex } = state.selectedOutput
            const output = state.graph.nodes[nodeUUID].outputs[outputIndex]
            output.edgeIndices.push(edgeIndex)
            output.selected = false
        }
        {
            const { nodeUUID, inputIndex } = event.inputPath
            const input = state.graph.nodes[nodeUUID].inputs[inputIndex]
            input.edgeIndices.push(edgeIndex)
        }
        state.selectedOutput = null
        state.draggedNode = null
        return { state, render: true }
    }
    if (state.selectedInput) {
        const { nodeUUID, inputIndex } = state.selectedInput
        state.graph.nodes[nodeUUID].inputs[inputIndex].selected = false
    }
    const { nodeUUID, inputIndex } = event.inputPath
    state.graph.nodes[nodeUUID].inputs[inputIndex].selected = true
    state.selectedInput = event.inputPath
    return { state, render: true }
}

const clickedOutput = (state: State, event: ClickedOutput) => {
    state.draggedNode = event.outputPath.nodeUUID
    const nodeOrder = state.graph.nodeOrder.filter(uuid => uuid !== event.outputPath.nodeUUID)
    nodeOrder.push(event.outputPath.nodeUUID)
    state.graph.nodeOrder = nodeOrder
    if (state.selectedInput) {
        const edgeIndex = state.graph.edges.length
        state.graph.edges.push({
            input: state.selectedInput,
            output: event.outputPath
        })
        {
            const { nodeUUID, inputIndex } = state.selectedInput
            const input = state.graph.nodes[nodeUUID].inputs[inputIndex]
            input.edgeIndices.push(edgeIndex)
            input.selected = false
        }
        {
            const { nodeUUID, outputIndex } = event.outputPath
            const output = state.graph.nodes[nodeUUID].outputs[outputIndex]
            output.edgeIndices.push(edgeIndex)
        }
        state.selectedInput = null
        state.draggedNode = null
        return { state, render: true }
    }
    if (state.selectedOutput) {
        const { nodeUUID, outputIndex } = state.selectedOutput
        state.graph.nodes[nodeUUID].outputs[outputIndex].selected = false
    }
    const { nodeUUID, outputIndex } = event.outputPath
    state.graph.nodes[nodeUUID].outputs[outputIndex].selected = true
    state.selectedOutput = event.outputPath
    return { state, render: true }
}

const doubleClickTimeout = (state: State, _: DoubleClickTimeout) => {
    if (state.potentialDoubleClick) {
        state.potentialDoubleClick = false
    }
    return { state }
}

const updateFinderOptions = (state: State): State => {
    state.finder.options = Object.keys(state.operations)
        .filter(item => fuzzyFind({ haystack: item, needle: state.finder.search }))
    return state
}

export const openFinder = (state: State) => {
    state.finder.show = true
    state.finder.search = ''
    state.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.ALPHABETIC
    }
    state.inputTarget = { kind: InputTargetKind.FINDER }
    state.potentialDoubleClick = false
    state = updateFinderOptions(state)
    return state
}


const doubleClick = (state: State, { pointer }: DoubleClick) => {
    state = openFinder(state)
    state.nodePlacementLocation = { x: pointer.x, y: pointer.y }
    return { state: state, render: true }
}

const closeFinder = (state: State) => {
    state.finder.show = false
    state.finder.search = ''
    state.virtualKeyboard = {
        show: false,
        kind: VirtualKeyboardKind.ALPHABETIC
    }
    state.inputTarget = { kind: InputTargetKind.NONE }
    return state
}

const insertOperationFromFinder = (state: State, name: string, gnerateUUID: GenerateUUID): State => {
    state = closeFinder(state)
    const operation = state.operations[name]
    const [x, y, _] = multiplyMatrixVector(state.camera, [state.nodePlacementLocation.x, state.nodePlacementLocation.y, 1])
    const uuid = gnerateUUID()
    state.graph.nodes[uuid] = {
        uuid,
        name,
        inputs: operation.inputs.map(input => ({
            name: input,
            selected: false,
            edgeIndices: []
        })),
        outputs: operation.outputs.map(output => ({
            name: output,
            selected: false,
            edgeIndices: []
        })),
        x,
        y,
        body: operation.body !== undefined ? {
            value: operation.body,
            editing: false
        } : undefined
    }
    state.graph.nodeOrder.push(uuid)
    return state
}

const keyDown = (state: State, { key }: KeyDown, generateUUID: GenerateUUID) => {
    switch (state.inputTarget.kind) {
        case InputTargetKind.FINDER:
            switch (key) {
                case 'Backspace':
                    state.finder.search = state.finder.search.slice(0, -1)
                    break
                case 'Shift':
                case 'Alt':
                case 'Control':
                case 'Meta':
                case 'Tab':
                    break
                case 'Enter':
                    if (state.finder.options.length > 0) {
                        const name = state.finder.options[0]
                        state = insertOperationFromFinder(state, name, generateUUID)
                    } else {
                        state = closeFinder(state)
                    }
                    break
                case 'Escape':
                    state = closeFinder(state)
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
            if (key == 'f') {
                return { state: openFinder(state), render: true }
            }
            return { state }
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

const clickedNumber = (state: State, { nodeUUID }: ClickedNumber) => {
    if (state.inputTarget.kind === InputTargetKind.NUMBER) {
        state.graph.nodes[state.inputTarget.nodeUUID].body!.editing = false
    }
    state = closeFinder(state)
    state = openNumericKeyboard(state, nodeUUID)
    return {
        state,
        render: true
    }
}

const clickedBackground = (state: State) => {
    if (state.inputTarget.kind === InputTargetKind.NUMBER) {
        state.graph.nodes[state.inputTarget.nodeUUID].body!.editing = false
    }
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
        case EventKind.CLICKED_INPUT: return clickedInput(state, event)
        case EventKind.CLICKED_OUTPUT: return clickedOutput(state, event)
        case EventKind.DOUBLE_CLICK_TIMEOUT: return doubleClickTimeout(state, event)
        case EventKind.DOUBLE_CLICK: return doubleClick(state, event)
        case EventKind.KEYDOWN: return keyDown(state, event, generateUUID)
        case EventKind.VIRTUAL_KEYDOWN: return virtualKeyDown(state, event, generateUUID)
        case EventKind.CLICKED_FINDER_OPTION: return clickedFinderOption(state, event, generateUUID)
        case EventKind.CLICKED_NUMBER: return clickedNumber(state, event)
        case EventKind.CLICKED_BACKGROUND: return clickedBackground(state)
    }
}
