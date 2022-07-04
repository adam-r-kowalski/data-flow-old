import { Mat3, Vec3 } from "./linear_algebra"
import { InputPath, OutputPath, State } from "./state"
import { Pointer } from "./ui"

export enum EventKind {
    POINTER_MOVE,
    POINTER_DOWN,
    POINTER_UP,
    CLICKED_NODE,
    WHEEL,
    CLICKED_INPUT,
    CLICKED_OUTPUT,
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
    index: number
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

export type Event =
    | PointerMove
    | PointerDown
    | PointerUp
    | ClickedNode
    | Wheel
    | ClickedInput
    | ClickedOutput


const pointerDown = (state: State, event: PointerDown) => {
    state.pointers.push(event.pointer)
    if (state.pointers.length === 1) state.dragging = true
    return { state, rerender: false }
}

const pointerUp = (state: State, event: PointerUp) => {
    const index = state.pointers.findIndex(p => p.id === event.pointer.id)
    state.pointers.splice(index, 1)
    if (state.pointers.length === 0) {
        state.dragging = false
        state.draggedNode = null
        state.pointerDistance = 0
    }
    return { state, rerender: false }
}

const pointerMove = (state: State, event: PointerMove) => {
    if (!state.dragging) return { state, rerender: false }
    const index = state.pointers.findIndex(p => p.id === event.pointer.id)
    const pointer = state.pointers[index]
    state.pointers[index] = event.pointer
    if (state.pointers.length === 1) {
        const dx = event.pointer.x - pointer.x
        const dy = event.pointer.y - pointer.y
        if (state.draggedNode !== null) {
            const scaling = state.camera.vecMul(new Vec3([0, 1, 0])).length()
            const node = state.graph.nodes[state.draggedNode]
            node.x += dx * scaling
            node.y += dy * scaling
        } else {
            state.camera = state.camera.matMul(Mat3.translate(-dx, -dy))
        }
        return { state, rerender: true }
    }
    if (state.pointers.length === 2) {
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
            const move = Mat3.translate(x, y)
            const zoom = Math.pow(2, (previousDistance - distance) * 0.01)
            const scale = Mat3.scale(zoom, zoom)
            const moveBack = Mat3.translate(-x, -y)
            const transform = move.matMul(scale).matMul(moveBack)
            const dx = x - previousCenter[0]
            const dy = y - previousCenter[1]
            state.camera = state.camera.matMul(transform).matMul(Mat3.translate(-dx, -dy))
            return { state, rerender: true }
        } else return { state, rerender: false }
    }
    return { state, rerender: false }
}

const clickedNode = (state: State, event: ClickedNode) => {
    state.draggedNode = event.index
    return { state, rerender: true }
}

const wheel = (state: State, event: Wheel) => {
    const move = Mat3.translate(event.x, event.y)
    const zoom = Math.pow(2, event.deltaY * 0.01)
    const scale = Mat3.scale(zoom, zoom)
    const moveBack = Mat3.translate(-event.x, -event.y)
    const transform = move.matMul(scale).matMul(moveBack)
    state.camera = state.camera.matMul(transform)
    return { state, rerender: true }
}

const clickedInput = (state: State, event: ClickedInput) => {
    state.draggedNode = event.inputPath.nodeIndex
    if (state.selectedOutput) {
        const edgeIndex = state.graph.edges.length
        state.graph.edges.push({
            input: event.inputPath,
            output: state.selectedOutput
        })
        {
            const { nodeIndex, outputIndex } = state.selectedOutput
            const output = state.graph.nodes[nodeIndex].outputs[outputIndex]
            output.edgeIndices.push(edgeIndex)
            output.selected = false
        }
        {
            const { nodeIndex, inputIndex } = event.inputPath
            const input = state.graph.nodes[nodeIndex].inputs[inputIndex]
            input.edgeIndices.push(edgeIndex)
        }
        state.selectedOutput = null
        return { state, rerender: true }
    }
    if (state.selectedInput) {
        const { nodeIndex, inputIndex } = state.selectedInput
        state.graph.nodes[nodeIndex].inputs[inputIndex].selected = false
    }
    const { nodeIndex, inputIndex } = event.inputPath
    state.graph.nodes[nodeIndex].inputs[inputIndex].selected = true
    state.selectedInput = event.inputPath
    return { state, rerender: true }
}

const clickedOutput = (state: State, event: ClickedOutput) => {
    state.draggedNode = event.outputPath.nodeIndex
    if (state.selectedInput) {
        const edgeIndex = state.graph.edges.length
        state.graph.edges.push({
            input: state.selectedInput,
            output: event.outputPath
        })
        {
            const { nodeIndex, inputIndex } = state.selectedInput
            const input = state.graph.nodes[nodeIndex].inputs[inputIndex]
            input.edgeIndices.push(edgeIndex)
            input.selected = false
        }
        {
            const { nodeIndex, outputIndex } = event.outputPath
            const output = state.graph.nodes[nodeIndex].outputs[outputIndex]
            output.edgeIndices.push(edgeIndex)
        }
        state.selectedInput = null
        return { state, rerender: true }
    }
    if (state.selectedOutput) {
        const { nodeIndex, outputIndex } = state.selectedOutput
        state.graph.nodes[nodeIndex].outputs[outputIndex].selected = false
    }
    const { nodeIndex, outputIndex } = event.outputPath
    state.graph.nodes[nodeIndex].outputs[outputIndex].selected = true
    state.selectedOutput = event.outputPath
    return { state, rerender: true }
}

export const update = (state: State, event: Event) => {
    switch (event.kind) {
        case EventKind.POINTER_DOWN: return pointerDown(state, event)
        case EventKind.POINTER_UP: return pointerUp(state, event)
        case EventKind.POINTER_MOVE: return pointerMove(state, event)
        case EventKind.CLICKED_NODE: return clickedNode(state, event)
        case EventKind.WHEEL: return wheel(state, event)
        case EventKind.CLICKED_INPUT: return clickedInput(state, event)
        case EventKind.CLICKED_OUTPUT: return clickedOutput(state, event)
    }
}
