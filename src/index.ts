import { CrossAxisAlignment } from "./alignment"
import { rgba } from "./color"
import { Event, EventKind, update } from "./event"
import { Mat3 } from "./linear_algebra"
import { padding } from "./padding"
import { Dispatch, run, transformPointer } from "./run"
import { Node, State, Theme } from "./state"
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

const nodeUi = (dispatch: Dispatch<Event>, theme: Theme, { name, x, y, inputs, outputs }: Node, index: number) => {
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

const view = (dispatch: Dispatch<Event>, state: State) => stack([
    container({ color: state.theme.background }),
    scene({ camera: state.camera },
        state.nodes.map((node, i) => nodeUi(dispatch, state.theme, node, i))
    ),
])

const initialState: State = {
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