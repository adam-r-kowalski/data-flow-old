import { CrossAxisAlignment } from "./alignment"
import { Color, rgba } from "./color"
import { Mat3 } from "./linear_algebra"
import { padding } from "./padding"
import { pointerDown } from "./renderer/pointer_down"
import { render } from "./renderer/render"
import { webGL2Renderer } from "./renderer/webgl2"
import { Pointer, UI } from "./ui"
import { column } from "./ui/column"
import { container } from "./ui/container"
import { row } from "./ui/row"
import { scene } from "./ui/scene"
import { stack } from "./ui/stack"
import { text } from "./ui/text"

interface Node {
    name: string
    inputs: string[]
    outputs: string[]
    x: number
    y: number
}

interface Theme {
    background: Color
    node: Color
    input: Color
}

interface State {
    nodes: Node[]
    dragging: boolean
    draggedNode: number | null
    pointers: Pointer[]
    camera: Mat3
    theme: Theme
}

type Dispatch = (event: Event) => void

const spacer = (size: number) =>
    container({ width: size, height: size })

const intersperse = <T>(array: T[], seperator: T): T[] => {
    const result = [array[0]]
    for (const element of array.slice(1)) {
        result.push(seperator, element)
    }
    return result
}

const inputUi = (theme: Theme, input: string): UI =>
    row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        container({
            width: 24,
            height: 24,
            color: theme.input
        }),
        spacer(10),
        text(input)
    ])

const inputsUi = (theme: Theme, inputs: string[]) =>
    column(intersperse(inputs.map(input => inputUi(theme, input)), spacer(10)))

const outputUi = (theme: Theme, output: string): UI =>
    row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        text(output),
        spacer(10),
        container({
            width: 24,
            height: 24,
            color: theme.input
        }),
    ])

const outputsUi = (theme: Theme, outputs: string[]) =>
    column(intersperse(outputs.map(output => outputUi(theme, output)), spacer(10)))

const nodeUi = (dispatch: Dispatch, theme: Theme, { name, x, y, inputs, outputs }: Node, index: number) => {
    const rowEntries: UI[] = []
    if (inputs.length) rowEntries.push(inputsUi(theme, inputs))
    if (inputs.length && outputs.length) rowEntries.push(spacer(30))
    if (outputs.length) rowEntries.push(outputsUi(theme, outputs))
    return container({
        color: theme.node,
        padding: padding(10),
        x, y,
        onClick: () => dispatch({
            kind: EventKind.CLICKED_NODE,
            index: index
        })
    },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text(name),
            spacer(10),
            row(rowEntries)
        ])
    )
}

const ui = (dispatch: Dispatch, state: State) => stack([
    container({ color: state.theme.background }),
    scene({ camera: state.camera },
        state.nodes.map((node, i) => nodeUi(dispatch, state.theme, node, i))
    ),
])

const transformPointer = (p: PointerEvent): Pointer => ({
    x: p.clientX,
    y: p.clientY,
    id: p.pointerId,
})

enum EventKind {
    POINTER_MOVE,
    POINTER_DOWN,
    POINTER_UP,
    CLICKED_NODE,
    FRAME_TIME,
}

interface PointerMove {
    kind: EventKind.POINTER_MOVE,
    pointer: Pointer
}

interface PointerDown {
    kind: EventKind.POINTER_DOWN,
    pointer: Pointer
}

interface PointerUp {
    kind: EventKind.POINTER_UP,
    pointer: Pointer
}

interface ClickedNode {
    kind: EventKind.CLICKED_NODE,
    index: number
}

type Event =
    | PointerMove
    | PointerDown
    | PointerUp
    | ClickedNode

interface UpdateResult {
    state: State
    rerender: boolean
}

const update = (state: State, event: Event): UpdateResult => {
    switch (event.kind) {
        case EventKind.POINTER_DOWN: {
            state.pointers.push(event.pointer)
            if (state.pointers.length === 1) state.dragging = true
            return { state, rerender: false }
        }
        case EventKind.POINTER_UP: {
            const index = state.pointers.findIndex(p => p.id === event.pointer.id)
            state.pointers.splice(index, 1)
            if (state.pointers.length === 0) {
                state.dragging = false
                state.draggedNode = null
            }
            return { state, rerender: false }
        }
        case EventKind.POINTER_MOVE: {
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
        case EventKind.CLICKED_NODE: {
            const lastIndex = state.nodes.length - 1
            if (event.index !== lastIndex) {
                const node = state.nodes[lastIndex]
                state.nodes[lastIndex] = state.nodes[event.index]
                state.nodes[event.index] = node
            }
            state.draggedNode = lastIndex
            return { state, rerender: true }
        }
    }
}

const run = (state: State) => {
    let renderer = webGL2Renderer({
        width: window.innerWidth,
        height: window.innerHeight
    })
    let renderQueued = false
    const scheduleRender = () => {
        if (!renderQueued) {
            renderQueued = true
            requestAnimationFrame(() => {
                renderer = render(renderer, ui(dispatch, state))
                renderQueued = false
            })
        }
    }
    const dispatch = (event: Event) => {
        const result = update(state, event)
        state = result.state
        if (result.rerender) scheduleRender()
    }
    document.body.appendChild(renderer.canvas)
    if (typeof PointerEvent.prototype.getCoalescedEvents === 'function') {
        document.addEventListener('pointermove', (e) => {
            e.getCoalescedEvents().forEach(p => {
                dispatch({
                    kind: EventKind.POINTER_MOVE,
                    pointer: transformPointer(p)
                })
            })
        })
    } else {
        document.addEventListener('pointermove', p =>
            dispatch({
                kind: EventKind.POINTER_MOVE,
                pointer: transformPointer(p)
            })
        )
    }
    document.addEventListener("pointerdown", p => {
        const pointer = transformPointer(p)
        renderer = pointerDown(renderer, pointer)
        dispatch({
            kind: EventKind.POINTER_DOWN,
            pointer: pointer
        })
    })
    document.addEventListener("pointerup", p => {
        dispatch({
            kind: EventKind.POINTER_UP,
            pointer: transformPointer(p)
        })
    })
    window.addEventListener("resize", () => {
        renderer.size = { width: window.innerWidth, height: window.innerHeight }
        scheduleRender()
    })
    scheduleRender()
}

run({
    nodes: [
        {
            name: "Source",
            inputs: [],
            outputs: ["Out 1", "Out 2"],
            x: 100,
            y: 200
        },
        {
            name: "Transform",
            inputs: ["In 1", "In 2"],
            outputs: ["Out 1", "Out 2"],
            x: 400,
            y: 300
        },
        {
            name: "Sink",
            inputs: ["In 1", "In 2"],
            outputs: [],
            x: 800,
            y: 250
        },
    ],
    dragging: false,
    draggedNode: null,
    pointers: [],
    camera: Mat3.identity(),
    theme: {
        background: rgba(1, 22, 39, 255),
        node: rgba(41, 95, 120, 255),
        input: rgba(188, 240, 192, 255)
    },
})