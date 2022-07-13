import { CrossAxisAlignment, MainAxisAlignment } from "./ui/alignment"
import { AppEvent, EventKind, update } from "./event"
import { identity } from "./linear_algebra/matrix3x3"
import { run, transformPointer } from "./ui/run"
import { Finder, Input, Node, Output, State, Theme, VirtualKeyboardKind } from "./state"
import { text, stack, scene, row, container, column, Connection, UI } from './ui'

const spacer = (size: number): UI<AppEvent> =>
    container({ width: size, height: size })

const intersperse = <T>(array: T[], seperator: T): T[] => {
    const result = [array[0]]
    for (const element of array.slice(1)) {
        result.push(seperator, element)
    }
    return result
}

const inputUi = (theme: Theme, { name, selected }: Input, nodeIndex: number, inputIndex: number): UI<AppEvent> =>
    container({
        onClick: {
            kind: EventKind.CLICKED_INPUT,
            inputPath: { nodeIndex: nodeIndex, inputIndex: inputIndex }
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container({
                id: `input ${nodeIndex} ${inputIndex}`,
                width: 14,
                height: 14,
                color: selected ? theme.selectedInput : theme.input,
            }),
            spacer(4),
            text(name)
        ])
    )

const inputsUi = (theme: Theme, inputs: Input[], nodeIndex: number) =>
    column(
        intersperse(
            inputs.map((input, inputIndex) => inputUi(theme, input, nodeIndex, inputIndex)),
            spacer(4)
        )
    )

const outputUi = (theme: Theme, { name, selected }: Output, nodeIndex: number, outputIndex: number): UI<AppEvent> =>
    container({
        onClick: {
            kind: EventKind.CLICKED_OUTPUT,
            outputPath: { nodeIndex: nodeIndex, outputIndex: outputIndex }
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text(name),
            spacer(4),
            container({
                id: `output ${nodeIndex} ${outputIndex}`,
                width: 14,
                height: 14,
                color: selected ? theme.selectedInput : theme.input,
            }),
        ])
    )


const outputsUi = (theme: Theme, outputs: Output[], nodeIndex: number) =>
    column(
        intersperse(
            outputs.map((output, outputIndex) => outputUi(theme, output, nodeIndex, outputIndex)),
            spacer(4)
        )
    )

const numberUi = (theme: Theme, body: number, nodeIndex: number): UI<AppEvent> =>
    container({
        color: theme.background,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_NUMBER,
            nodeIndex
        }
    },
        text(body.toString()))

const nodeUi = (theme: Theme, { name, x, y, inputs, body, outputs }: Node, index: number): UI<AppEvent> => {
    const rowEntries: UI<AppEvent>[] = []
    if (inputs.length) rowEntries.push(inputsUi(theme, inputs, index))
    if (inputs.length && outputs.length) rowEntries.push(spacer(15))
    if (body !== undefined) rowEntries.push(numberUi(theme, body, index), spacer(15))
    if (outputs.length) rowEntries.push(outputsUi(theme, outputs, index))
    return container(
        {
            color: theme.node,
            padding: 4,
            x, y,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                index: index
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text(name),
            spacer(4),
            row(rowEntries)
        ])
    )
}

const finder = ({ search, options }: Finder, theme: Theme): UI<AppEvent> =>
    column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        container({ height: 10 }),
        container({ color: theme.node, padding: 4 },
            column([
                container({ color: theme.background, width: 300, padding: 4 },
                    text({ color: theme.input, size: 24 }, search.length ? search : "Search ...")),
                container({ width: 10, height: 10 }),
                ...options.map((option, i) =>
                    container<AppEvent>({
                        padding: 4,
                        onClick: {
                            kind: EventKind.CLICKED_FINDER_OPTION,
                            option
                        }
                    },
                        text({
                            size: 18,
                            color: i == 0 ? theme.input : { red: 255, green: 255, blue: 255, alpha: 255 }
                        }, option)
                    )
                )
            ])
        )
    ])

const virtualKey = (key: string): UI<AppEvent> =>
    container({
        padding: 10,
        onClick: {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        }
    }, text({ size: 24 }, key))

const virtualKeys = (keys: string[]) =>
    row(keys.map(c => virtualKey(c)))

const alphabeticVirtualKeyboard = (theme: Theme) =>
    column({ mainAxisAlignment: MainAxisAlignment.END }, [
        row({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
            container({ padding: 4, color: theme.node },
                column([
                    virtualKeys(['1', '2', '3', '4', '5']),
                    virtualKeys(['q', 'w', 'e', 'r', 't']),
                    virtualKeys(['a', 's', 'd', 'f', 'g']),
                    virtualKeys(['z', 'x', 'c', 'v']),
                    virtualKeys(['sft', 'space']),
                ])
            ),
            container({ padding: 4, color: theme.node },
                column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                    virtualKeys(['6', '7', '8', '9', '0']),
                    virtualKeys(['y', 'u', 'i', 'o', 'p']),
                    virtualKeys(['h', 'j', 'k', 'l']),
                    virtualKeys(['b', 'n', 'm', 'del']),
                    virtualKeys(['space', 'ret']),
                ])
            ),
        ]),
    ])

const numericVirtualKeyboard = (theme: Theme) =>
    column({ mainAxisAlignment: MainAxisAlignment.END }, [
        row({ mainAxisAlignment: MainAxisAlignment.END }, [
            container({ padding: 4, color: theme.node },
                column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                    virtualKeys(['1', '2', '3', '4']),
                    virtualKeys(['5', '6', '7', '8']),
                    virtualKeys(['9', '0', 'del']),
                    virtualKeys(['.', 'ret']),
                ])
            ),
        ]),
    ])

const virtualKeyboard = (theme: Theme, kind: VirtualKeyboardKind) => {
    switch (kind) {
        case VirtualKeyboardKind.ALPHABETIC: return alphabeticVirtualKeyboard(theme)
        case VirtualKeyboardKind.NUMERIC: return numericVirtualKeyboard(theme)
    }
}


const view = (state: State): UI<AppEvent> => {
    const nodes: UI<AppEvent>[] = []
    state.graph.nodes.forEach((node, i) => {
        if (i !== state.draggedNode) nodes.push(nodeUi(state.theme, node, i))
    })
    if (state.draggedNode !== null) {
        const i = state.draggedNode
        nodes.push(nodeUi(state.theme, state.graph.nodes[i], i))
    }
    const connections: Connection[] = state.graph.edges.map(({ input, output }) => ({
        from: `output ${output.nodeIndex} ${output.outputIndex}`,
        to: `input ${input.nodeIndex} ${input.inputIndex}`,
        color: state.theme.connection
    }))
    const stacked: UI<AppEvent>[] = [
        container({ color: state.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({ camera: state.camera, children: nodes, connections }),
    ]
    if (state.finder.show) stacked.push(finder(state.finder, state.theme))
    if (state.virtualKeyboard.show) stacked.push(virtualKeyboard(state.theme, state.virtualKeyboard.kind))
    return stack(stacked)
}

const initialState: State = {
    graph: {
        nodes: [
            {
                name: "Number",
                inputs: [],
                body: 5,
                outputs: [
                    { name: "out", selected: false, edgeIndices: [0] },
                ],
                x: 25,
                y: 25
            },
            {
                name: "Number",
                inputs: [],
                body: 10,
                outputs: [
                    { name: "out", selected: false, edgeIndices: [1] },
                ],
                x: 25,
                y: 100
            },
            {
                name: "Add",
                inputs: [
                    { name: "x", selected: false, edgeIndices: [0] },
                    { name: "y", selected: false, edgeIndices: [1] }
                ],
                outputs: [
                    { name: "out", selected: false, edgeIndices: [2] },
                ],
                x: 150,
                y: 50
            },
            {
                name: "Number",
                inputs: [],
                body: 15,
                outputs: [
                    { name: "out", selected: false, edgeIndices: [3] },
                ],
                x: 175,
                y: 150
            },
            {
                name: "Divide",
                inputs: [
                    { name: "x", selected: false, edgeIndices: [2] },
                    { name: "y", selected: false, edgeIndices: [3] }
                ],
                outputs: [
                    { name: "out", selected: false, edgeIndices: [4] },
                ],
                x: 350,
                y: 50
            },
            {
                name: "Return",
                inputs: [
                    { name: "value", selected: false, edgeIndices: [4] },
                ],
                outputs: [],
                x: 550,
                y: 50
            },
        ],
        edges: [
            {
                output: { nodeIndex: 0, outputIndex: 0 },
                input: { nodeIndex: 2, inputIndex: 0 },
            },
            {
                output: { nodeIndex: 1, outputIndex: 0 },
                input: { nodeIndex: 2, inputIndex: 1 },
            },
            {
                output: { nodeIndex: 2, outputIndex: 0 },
                input: { nodeIndex: 4, inputIndex: 0 },
            },
            {
                output: { nodeIndex: 3, outputIndex: 0 },
                input: { nodeIndex: 4, inputIndex: 1 },
            },
            {
                output: { nodeIndex: 4, outputIndex: 0 },
                input: { nodeIndex: 5, inputIndex: 0 },
            }
        ]
    },
    zooming: false,
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
    nodePlacementLocation: { x: 0, y: 0 },
    finder: {
        search: '',
        options: [],
        show: false
    },
    virtualKeyboard: {
        show: false,
        kind: VirtualKeyboardKind.ALPHABETIC
    },
    operations: {
        "Number": {
            name: "Number",
            inputs: [],
            body: 0,
            outputs: ["out"]
        },
        "Add": {
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"]
        },
        "Subtract": {
            name: "Subtract",
            inputs: ["x", "y"],
            outputs: ["out"]
        },
        "Multiply": {
            name: "Multiply",
            inputs: ["x", "y"],
            outputs: ["out"]
        },
        "Divide": {
            name: "Divide",
            inputs: ["x", "y"],
            outputs: ["out"]
        },
        "Equal": {
            name: "Equal",
            inputs: ["x", "y"],
            outputs: ["out"]
        },
        "Less Than": {
            name: "Less Than",
            inputs: ["x", "y"],
            outputs: ["out"]
        },
        "Less Than Or Equal": {
            name: "Less Than Or Equal",
            inputs: ["x", "y"],
            outputs: ["out"]
        }
    }
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

document.addEventListener('keydown', e => {
    e.preventDefault()
    dispatch({
        kind: EventKind.KEYDOWN,
        key: e.key
    })
})