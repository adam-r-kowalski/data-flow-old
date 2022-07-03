import { CrossAxisAlignment } from "./alignment"
import { rgba } from "./color"
import { Event, EventKind, update } from "./event"
import { Mat3 } from "./linear_algebra"
import { padding } from "./padding"
import { Dispatch, run, transformPointer } from "./run"
import { Input, Node, Output, State, Theme } from "./state"
import { UI } from "./ui"
import { column } from "./ui/column"
import { container } from "./ui/container"
import { row } from "./ui/row"
import { scene } from "./ui/scene"
import { stack } from "./ui/stack"
import { text } from "./ui/text"

const spacer = (size: number) =>
    container({ width: size, height: size })

const intersperse = <T>(array: T[], seperator: T): T[] => {
    const result = [array[0]]
    for (const element of array.slice(1)) {
        result.push(seperator, element)
    }
    return result
}

const inputUi = (theme: Theme, { name, selected }: Input, nodeIndex: number, inputIndex: number): UI =>
    row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        container({
            width: 24,
            height: 24,
            color: selected ? theme.selectedInput : theme.input,
            onClick: () => dispatch({
                kind: EventKind.CLICKED_INPUT,
                inputPath: { nodeIndex: nodeIndex, inputIndex: inputIndex }
            })
        }),
        spacer(10),
        text(name)
    ])

const inputsUi = (theme: Theme, inputs: Input[], nodeIndex: number) =>
    column(
        intersperse(
            inputs.map((input, inputIndex) => inputUi(theme, input, nodeIndex, inputIndex)),
            spacer(10)
        )
    )

const outputUi = (theme: Theme, { name, selected }: Output, nodeIndex: number, outputIndex: number): UI =>
    row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        text(name),
        spacer(10),
        container({
            width: 24,
            height: 24,
            color: selected ? theme.selectedInput : theme.input,
            onClick: () => dispatch({
                kind: EventKind.CLICKED_OUTPUT,
                outputPath: { nodeIndex: nodeIndex, outputIndex: outputIndex }
            })
        }),
    ])

const outputsUi = (theme: Theme, outputs: Output[], nodeIndex: number) =>
    column(
        intersperse(
            outputs.map((output, outputIndex) => outputUi(theme, output, nodeIndex, outputIndex)),
            spacer(10)
        )
    )

const nodeUi = (dispatch: Dispatch<Event>, theme: Theme, { name, x, y, inputs, outputs }: Node, index: number) => {
    const rowEntries: UI[] = []
    if (inputs.length) rowEntries.push(inputsUi(theme, inputs, index))
    if (inputs.length && outputs.length) rowEntries.push(spacer(30))
    if (outputs.length) rowEntries.push(outputsUi(theme, outputs, index))
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

const view = (dispatch: Dispatch<Event>, state: State) => {
    console.log(state.graph.edges)
    const nodes: UI[] = []
    state.graph.nodes.forEach((node, i) => {
        if (i !== state.draggedNode) nodes.push(nodeUi(dispatch, state.theme, node, i))
    })
    if (state.draggedNode !== null) {
        const i = state.draggedNode
        nodes.push(nodeUi(dispatch, state.theme, state.graph.nodes[i], i))
    }
    return stack([
        container({ color: state.theme.background }),
        scene({ camera: state.camera, children: nodes }),
    ])
}

const initialState: State = {
    graph: {
        nodes: [
            {
                name: "Source",
                inputs: [],
                outputs: [
                    { name: "Out 1", selected: false, edgeIndices: [] },
                    { name: "Out 2", selected: false, edgeIndices: [] }
                ],
                x: 100,
                y: 200
            },
            {
                name: "Transform",
                inputs: [
                    { name: "In 1", selected: false, edgeIndices: [] },
                    { name: "In 2", selected: false, edgeIndices: [] }
                ],
                outputs: [
                    { name: "Out 1", selected: false, edgeIndices: [] },
                    { name: "Out 2", selected: false, edgeIndices: [] }
                ],
                x: 400,
                y: 300
            },
            {
                name: "Sink",
                inputs: [
                    { name: "In 1", selected: false, edgeIndices: [] },
                    { name: "In 2", selected: false, edgeIndices: [] }
                ],
                outputs: [],
                x: 800,
                y: 250
            },
        ],
        edges: []
    },
    dragging: false,
    draggedNode: null,
    pointers: [],
    pointerDistance: 0,
    pointerCenter: [0, 0],
    camera: Mat3.identity(),
    selectedOutput: null,
    selectedInput: null,
    theme: {
        background: rgba(1, 22, 39, 255),
        node: rgba(41, 95, 120, 255),
        input: rgba(188, 240, 192, 255),
        selectedInput: rgba(175, 122, 208, 255)
    },
}

const dispatch = run(initialState, view, update)

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
    dispatch({
        kind: EventKind.POINTER_DOWN,
        pointer: transformPointer(p)
    })
})

document.addEventListener("pointerup", p => {
    dispatch({
        kind: EventKind.POINTER_UP,
        pointer: transformPointer(p)
    })
})

document.addEventListener('wheel', e => {
    e.preventDefault()
    dispatch({
        kind: EventKind.WHEEL,
        x: e.clientX,
        y: e.clientY,
        deltaY: e.deltaY,
    })
}, { passive: false })

document.addEventListener('contextmenu', e => {
    e.preventDefault()
})

document.addEventListener('touchend', () => {
    document.body.requestFullscreen()
})