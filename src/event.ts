import { Mat3 } from "./linear_algebra"
import { State } from "./state"
import { Pointer } from "./ui"

export enum EventKind {
    POINTER_MOVE,
    POINTER_DOWN,
    POINTER_UP,
    CLICKED_NODE,
    FRAME_TIME,
}

export interface PointerMove {
    kind: EventKind.POINTER_MOVE,
    pointer: Pointer
}

export interface PointerDown {
    kind: EventKind.POINTER_DOWN,
    pointer: Pointer
}

export interface PointerUp {
    kind: EventKind.POINTER_UP,
    pointer: Pointer
}

export interface ClickedNode {
    kind: EventKind.CLICKED_NODE,
    index: number
}

export type Event =
    | PointerMove
    | PointerDown
    | PointerUp
    | ClickedNode


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
    }
    return { state, rerender: false }
}

const pointerMove = (state: State, event: PointerMove) => {
    if (!state.dragging) return { state, rerender: false }
    const index = state.pointers.findIndex(p => p.id === event.pointer.id)
    const pointer = state.pointers[index]
    state.pointers[index] = event.pointer
    const dx = event.pointer.x - pointer.x
    const dy = event.pointer.y - pointer.y
    if (state.pointers.length === 1) {
        if (state.draggedNode !== null) {
            const node = state.nodes[state.draggedNode]
            node.x += dx
            node.y += dy
        } else {
            state.camera = state.camera.matMul(Mat3.translate(-dx, -dy))
        }
    }
    return { state, rerender: true }
}

const clickedNode = (state: State, event: ClickedNode) => {
    const lastIndex = state.nodes.length - 1
    if (event.index !== lastIndex) {
        const node = state.nodes[lastIndex]
        state.nodes[lastIndex] = state.nodes[event.index]
        state.nodes[event.index] = node
    }
    state.draggedNode = lastIndex
    return { state, rerender: true }

}

export const update = (state: State, event: Event) => {
    switch (event.kind) {
        case EventKind.POINTER_DOWN: return pointerDown(state, event)
        case EventKind.POINTER_UP: return pointerUp(state, event)
        case EventKind.POINTER_MOVE: return pointerMove(state, event)
        case EventKind.CLICKED_NODE: return clickedNode(state, event)
    }
}
