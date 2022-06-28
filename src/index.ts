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
    theme: Theme
    dragging: boolean
    draggedNode: number | null
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
        x,
        y, onClick: () => dispatch({
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
    scene({ camera: Mat3.identity() },
        state.nodes.map((node, i) => nodeUi(dispatch, state.theme, node, i))
    )
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
    PointerMove
    | PointerDown
    | PointerUp
    | ClickedNode

const update = (state: State, event: Event): State => {
    switch (event.kind) {
        case EventKind.POINTER_DOWN:
            state.dragging = true
            return state
        case EventKind.POINTER_UP:
            state.dragging = false
            state.draggedNode = null
            return state
        case EventKind.POINTER_MOVE:
            if (state.dragging && state.draggedNode !== null) {
                const node = state.nodes[state.draggedNode]
                node.x = event.pointer.x
                node.y = event.pointer.y
            }
            return state
        case EventKind.CLICKED_NODE:
            state.draggedNode = event.index
            return state
    }
}

const run = (state: State) => {
    let renderer = webGL2Renderer({
        width: window.innerWidth,
        height: window.innerHeight
    })
    let renderQueued = false
    const dispatch = (event: Event) => {
        state = update(state, event)
        if (!renderQueued) {
            renderQueued = true
            requestAnimationFrame(() => {
                renderer = render(renderer, ui(dispatch, state))
                renderQueued = false
            })
        }
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
    requestAnimationFrame(() => renderer = render(renderer, ui(dispatch, state)))
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
    theme: {
        background: rgba(1, 22, 39, 255),
        node: rgba(0, 191, 249, 50),
        input: rgba(188, 240, 192, 255)
    },
})