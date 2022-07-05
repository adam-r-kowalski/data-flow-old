import { CrossAxisAlignment } from "./alignment"
import { Event, EventKind, update } from "./event"
import { identity } from "./linear_algebra/matrix3x3"
import { padding } from "./padding"
import { Dispatch, run, transformPointer } from "./run"
import { Input, Node, Output, State, Theme } from "./state"
import { Connection, UI } from "./ui"
import { center } from "./ui/center"
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
            id: `input ${nodeIndex} ${inputIndex}`,
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
            id: `output ${nodeIndex} ${outputIndex}`,
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

const finder = (theme: Theme) =>
    center(
        container({ color: theme.node, padding: padding(10) },
            column([
                container({ color: theme.background, width: 700, padding: padding(10) },
                    text({ color: theme.input, size: 40 }, "Search Operations...")),
                container({ width: 10, height: 10 }),
                container({ padding: padding(10) }, text("Add")),
                container({ padding: padding(10) }, text("Subtract")),
                container({ padding: padding(10) }, text("Multiply")),
                container({ padding: padding(10) }, text("Divide")),
                container({ padding: padding(10) }, text("Equal")),
            ])
        )
    )

const view = (dispatch: Dispatch<Event>, state: State) => {
    const nodes: UI[] = []
    state.graph.nodes.forEach((node, i) => {
        if (i !== state.draggedNode) nodes.push(nodeUi(dispatch, state.theme, node, i))
    })
    if (state.draggedNode !== null) {
        const i = state.draggedNode
        nodes.push(nodeUi(dispatch, state.theme, state.graph.nodes[i], i))
    }
    const connections: Connection[] = state.graph.edges.map(({ input, output }) => ({
        from: `output ${output.nodeIndex} ${output.outputIndex}`,
        to: `input ${input.nodeIndex} ${input.inputIndex}`,
        color: state.theme.connection
    }))
    const stacked: UI[] = [
        container({ color: state.theme.background }),
        scene({ camera: state.camera, children: nodes, connections }),
    ]
    if (state.showFinder) stacked.push(finder(state.theme))
    return stack(stacked)
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
    camera: identity(),
    selectedOutput: null,
    selectedInput: null,
    theme: {
        background: { red: 2, green: 22, blue: 39, alpha: 255 },
        node: { red: 41, green: 95, blue: 120, alpha: 255 },
        input: { red: 188, green: 240, blue: 192, alpha: 255 },
        selectedInput: { red: 175, green: 122, blue: 208, alpha: 255 },
        connection: { red: 255, green: 255, blue: 255, alpha: 255 },
    },
    potentialDoubleClick: false,
    showFinder: false,
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