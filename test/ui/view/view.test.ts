import { AppEvent, EventKind } from "../../../src/event"
import { identity } from "../../../src/linear_algebra/matrix3x3"
import { Input, Output, Theme, Body, Node, VirtualKeyboardKind, InputTargetKind, State } from "../../../src/state"
import { column, container, row, scene, stack, text } from "../../../src/ui"
import { CrossAxisAlignment, MainAxisAlignment } from "../../../src/ui/alignment"
import {
    alphabeticVirtualKeyboard,
    finder,
    inputsUi,
    inputUi,
    intersperse,
    nodeUi,
    numberUi,
    numericVirtualKeyboard,
    outputsUi,
    outputUi,
    spacer,
    view,
    virtualKey,
    virtualKeyboard,
    virtualKeys
} from "../../../src/ui/view"

test("spacer", () => {
    expect(spacer(10)).toEqual(container({ width: 10, height: 10 }))
})

test("intersperse", () => {
    expect(intersperse([1, 2, 3], 0)).toEqual([1, 0, 2, 0, 3])
})

const theme: Theme = {
    background: { red: 2, green: 22, blue: 39, alpha: 255 },
    node: { red: 41, green: 95, blue: 120, alpha: 255 },
    input: { red: 188, green: 240, blue: 192, alpha: 255 },
    selectedInput: { red: 175, green: 122, blue: 208, alpha: 255 },
    connection: { red: 255, green: 255, blue: 255, alpha: 255 },
}

test("inputUi not selected", () => {
    const name = "node name"
    const selected = false
    const input: Input = {
        name,
        selected,
        edgeIndices: []
    }
    const nodeUUID = 'some node'
    const inputIndex = 1
    const actual = inputUi(theme, input, nodeUUID, inputIndex)
    const expected = container<AppEvent>({
        onClick: {
            kind: EventKind.CLICKED_INPUT,
            inputPath: { nodeUUID, inputIndex }
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container({
                id: `input ${nodeUUID} ${inputIndex}`,
                width: 14,
                height: 14,
                color: theme.input,
            }),
            spacer(4),
            text(name)
        ])
    )
    expect(actual).toEqual(expected)
})

test("inputUi selected", () => {
    const name = "node name"
    const selected = true
    const input: Input = {
        name,
        selected,
        edgeIndices: []
    }
    const nodeUUID = 'some node'
    const inputIndex = 1
    const actual = inputUi(theme, input, nodeUUID, inputIndex)
    const expected = container<AppEvent>({
        onClick: {
            kind: EventKind.CLICKED_INPUT,
            inputPath: { nodeUUID, inputIndex }
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container({
                id: `input ${nodeUUID} ${inputIndex}`,
                width: 14,
                height: 14,
                color: theme.selectedInput,
            }),
            spacer(4),
            text(name)
        ])
    )
    expect(actual).toEqual(expected)
})

test("inputsUi", () => {
    const inputs: Input[] = [
        {
            name: "first",
            selected: false,
            edgeIndices: []
        },
        {
            name: "second",
            selected: false,
            edgeIndices: []
        },
        {
            name: "third",
            selected: true,
            edgeIndices: []
        }
    ]
    const nodeUUID = 'some node'
    const actual = inputsUi(theme, inputs, nodeUUID)
    const expected = column([
        inputUi(theme, inputs[0], nodeUUID, 0),
        spacer(4),
        inputUi(theme, inputs[1], nodeUUID, 1),
        spacer(4),
        inputUi(theme, inputs[2], nodeUUID, 2),
    ])
    expect(actual).toEqual(expected)
})

test("outputUi not selected", () => {
    const name = "node name"
    const selected = false
    const output: Output = {
        name,
        selected,
        edgeIndices: []
    }
    const nodeUUID = 'some node'
    const outputIndex = 1
    const actual = outputUi(theme, output, nodeUUID, outputIndex)
    const expected = container<AppEvent>({
        onClick: {
            kind: EventKind.CLICKED_OUTPUT,
            outputPath: { nodeUUID, outputIndex }
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text(name),
            spacer(4),
            container({
                id: `output ${nodeUUID} ${outputIndex}`,
                width: 14,
                height: 14,
                color: theme.input,
            }),
        ])
    )
    expect(actual).toEqual(expected)
})

test("outputUi selected", () => {
    const name = "node name"
    const selected = true
    const output: Output = {
        name,
        selected,
        edgeIndices: []
    }
    const nodeUUID = 'some node'
    const outputIndex = 1
    const actual = outputUi(theme, output, nodeUUID, outputIndex)
    const expected = container<AppEvent>({
        onClick: {
            kind: EventKind.CLICKED_OUTPUT,
            outputPath: { nodeUUID, outputIndex }
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text(name),
            spacer(4),
            container({
                id: `output ${nodeUUID} ${outputIndex}`,
                width: 14,
                height: 14,
                color: theme.selectedInput,
            }),
        ])
    )
    expect(actual).toEqual(expected)
})

test("outputsUi", () => {
    const outputs: Output[] = [
        {
            name: "first",
            selected: false,
            edgeIndices: []
        },
        {
            name: "second",
            selected: false,
            edgeIndices: []
        },
        {
            name: "third",
            selected: true,
            edgeIndices: []
        }
    ]
    const nodeUUID = 'some node'
    const actual = outputsUi(theme, outputs, nodeUUID)
    const expected = column([
        outputUi(theme, outputs[0], nodeUUID, 0),
        spacer(4),
        outputUi(theme, outputs[1], nodeUUID, 1),
        spacer(4),
        outputUi(theme, outputs[2], nodeUUID, 2),
    ])
    expect(actual).toEqual(expected)
})

test("numberUi not editing", () => {
    const body: Body = {
        value: 0,
        editing: false
    }
    const nodeUUID = 'some node'
    const actual = numberUi(theme, body, nodeUUID)
    const expected = container({
        color: theme.background,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_NUMBER,
            nodeUUID
        }
    },
        text(body.value.toString()))
    expect(actual).toEqual(expected)
})

test("numberUi editing", () => {
    const body: Body = {
        value: 0,
        editing: true
    }
    const nodeUUID = 'some node'
    const actual = numberUi(theme, body, nodeUUID)
    const expected = container({
        color: theme.selectedInput,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_NUMBER,
            nodeUUID
        }
    },
        text(body.value.toString()))
    expect(actual).toEqual(expected)
})

test("nodeUi no inputs body or outputs", () => {
    const nodeUUID = 'some node'
    const node: Node = {
        uuid: nodeUUID,
        name: "node",
        x: 0,
        y: 0,
        inputs: [],
        outputs: [],
    }
    const actual = nodeUi(theme, node)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                nodeUUID
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi 1 input, no body and no outputs", () => {
    const nodeUUID = 'some node'
    const node: Node = {
        uuid: nodeUUID,
        name: "node",
        x: 0,
        y: 0,
        inputs: [
            {
                name: "first",
                selected: false,
                edgeIndices: []
            },
        ],
        outputs: [],
    }
    const actual = nodeUi(theme, node)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                nodeUUID
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([inputsUi(theme, node.inputs, nodeUUID)])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi 1 output, no body and no inputs", () => {
    const nodeUUID = 'some node'
    const node: Node = {
        uuid: nodeUUID,
        name: "node",
        x: 0,
        y: 0,
        inputs: [],
        outputs: [
            {
                name: "first",
                selected: false,
                edgeIndices: []
            },
        ],
    }
    const actual = nodeUi(theme, node)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                nodeUUID
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([outputsUi(theme, node.outputs, nodeUUID)])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi no inputs or outputs but body defined", () => {
    const nodeUUID = 'some node'
    const node: Node = {
        uuid: nodeUUID,
        name: "node",
        x: 0,
        y: 0,
        inputs: [],
        body: {
            value: 0,
            editing: false
        },
        outputs: [],
    }
    const actual = nodeUi(theme, node)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                nodeUUID
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([numberUi(theme, node.body!, nodeUUID), spacer(15)])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi 1 input and 1 output but no body", () => {
    const nodeUUID = 'some node'
    const node: Node = {
        uuid: nodeUUID,
        name: "node",
        x: 0,
        y: 0,
        inputs: [
            {
                name: "first",
                selected: false,
                edgeIndices: []
            },
        ],
        outputs: [
            {
                name: "first",
                selected: false,
                edgeIndices: []
            },
        ],
    }
    const actual = nodeUi(theme, node)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                nodeUUID
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(theme, node.inputs, nodeUUID),
                spacer(15),
                outputsUi(theme, node.outputs, nodeUUID)
            ])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi 1 input body but no outputs", () => {
    const nodeUUID = 'some node'
    const node: Node = {
        uuid: nodeUUID,
        name: "node",
        x: 0,
        y: 0,
        inputs: [
            {
                name: "first",
                selected: false,
                edgeIndices: []
            },
        ],
        body: {
            value: 0,
            editing: false
        },
        outputs: [],
    }
    const actual = nodeUi(theme, node)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                nodeUUID
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(theme, node.inputs, nodeUUID),
                numberUi(theme, node.body!, nodeUUID),
                spacer(15),
            ])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi 1 output body but no inputs", () => {
    const nodeUUID = 'some node'
    const node: Node = {
        uuid: nodeUUID,
        name: "node",
        x: 0,
        y: 0,
        inputs: [],
        body: {
            value: 0,
            editing: false
        },
        outputs: [
            {
                name: "first",
                selected: false,
                edgeIndices: []
            },
        ],
    }
    const actual = nodeUi(theme, node)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                nodeUUID
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                numberUi(theme, node.body!, nodeUUID),
                spacer(15),
                outputsUi(theme, node.outputs, nodeUUID),
            ])
        ])
    )
    expect(actual).toEqual(expected)
})


test("nodeUi 1 input body and 1 output", () => {
    const nodeUUID = 'some node'
    const node: Node = {
        uuid: nodeUUID,
        name: "node",
        x: 0,
        y: 0,
        inputs: [
            {
                name: "first",
                selected: false,
                edgeIndices: []
            },
        ],
        body: {
            value: 0,
            editing: false
        },
        outputs: [
            {
                name: "first",
                selected: false,
                edgeIndices: []
            },
        ],
    }
    const actual = nodeUi(theme, node)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                nodeUUID
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(theme, node.outputs, nodeUUID),
                spacer(15),
                numberUi(theme, node.body!, nodeUUID),
                spacer(15),
                outputsUi(theme, node.outputs, nodeUUID),
            ])
        ])
    )
    expect(actual).toEqual(expected)
})

test("finder", () => {
    const actual = finder({ search: "text", options: ["foo", "bar"], show: true }, theme)
    const expected = column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        container({ height: 10 }),
        container({ color: theme.node, padding: 4 },
            column([
                container({ color: theme.background, width: 300, padding: 4 },
                    text({ color: theme.input, size: 24 }, "text")),
                container({ width: 10, height: 10 }),
                container({
                    padding: 4,
                    onClick: {
                        kind: EventKind.CLICKED_FINDER_OPTION,
                        option: "foo"
                    }
                },
                    text({
                        size: 18,
                        color: theme.input
                    }, "foo")
                ),
                container({
                    padding: 4,
                    onClick: {
                        kind: EventKind.CLICKED_FINDER_OPTION,
                        option: "bar"
                    }
                },
                    text({
                        size: 18,
                        color: { red: 255, green: 255, blue: 255, alpha: 255 },
                    }, "bar")
                )
            ])
        )
    ])
    expect(actual).toEqual(expected)
})


test("virtual key", () => {
    const actual = virtualKey("key")
    const expected = container({
        padding: 10,
        onClick: {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key: "key"
        }
    }, text({ size: 24 }, "key"))
    expect(actual).toEqual(expected)
})

test("virtual keys", () => {
    const actual = virtualKeys(["a", "b", "c"])
    const expected = row([
        container({
            padding: 10,
            onClick: {
                kind: EventKind.VIRTUAL_KEYDOWN,
                key: "a"
            }
        }, text({ size: 24 }, "a")),
        container({
            padding: 10,
            onClick: {
                kind: EventKind.VIRTUAL_KEYDOWN,
                key: "b"
            }
        }, text({ size: 24 }, "b")),
        container({
            padding: 10,
            onClick: {
                kind: EventKind.VIRTUAL_KEYDOWN,
                key: "c"
            }
        }, text({ size: 24 }, "c")),
    ])
    expect(actual).toEqual(expected)
})

test("alphabetic virtual keyboard", () => {
    const actual = alphabeticVirtualKeyboard(theme)
    const expected = column({ mainAxisAlignment: MainAxisAlignment.END }, [
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
    expect(actual).toEqual(expected)
})

test("numeric virtual keyboard", () => {
    const actual = numericVirtualKeyboard(theme)
    const expected = column({ mainAxisAlignment: MainAxisAlignment.END }, [
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
    expect(actual).toEqual(expected)
})

test("virtual keyboard numeric", () => {
    const actual = virtualKeyboard(theme, VirtualKeyboardKind.NUMERIC)
    const expected = numericVirtualKeyboard(theme)
    expect(actual).toEqual(expected)
})


test("virtual keyboard alphabetic", () => {
    const actual = virtualKeyboard(theme, VirtualKeyboardKind.ALPHABETIC)
    const expected = alphabeticVirtualKeyboard(theme)
    expect(actual).toEqual(expected)
})

test("view with no nodes or edges", () => {
    const state: State = {
        graph: {
            nodes: {},
            nodeOrder: [],
            edges: []
        },
        zooming: false,
        dragging: false,
        draggedNode: null,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: [0, 0],
        selectedOutput: null,
        selectedInput: null,
        potentialDoubleClick: false,
        nodePlacementLocation: {
            x: 0,
            y: 0,
        },
        finder: {
            search: "",
            options: [],
            show: false,
        },
        virtualKeyboard: {
            show: false,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: {
            kind: InputTargetKind.NONE,
        },
        camera: identity(),
        operations: {},
        theme
    }
    const actual = view(state)
    const expected = stack([
        container({ color: state.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({ camera: state.camera, children: [], connections: [] }),
    ])
    expect(actual).toEqual(expected)
})

test("view with no nodes or edges but finder shown", () => {
    const state: State = {
        graph: {
            nodes: {},
            nodeOrder: [],
            edges: []
        },
        zooming: false,
        dragging: false,
        draggedNode: null,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: [0, 0],
        selectedOutput: null,
        selectedInput: null,
        potentialDoubleClick: false,
        nodePlacementLocation: {
            x: 0,
            y: 0,
        },
        finder: {
            search: "",
            options: [],
            show: true,
        },
        virtualKeyboard: {
            show: false,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: {
            kind: InputTargetKind.NONE,
        },
        camera: identity(),
        operations: {},
        theme
    }
    const actual = view(state)
    const expected = stack([
        container({ color: state.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({ camera: state.camera, children: [], connections: [] }),
        finder(state.finder, state.theme)
    ])
    expect(actual).toEqual(expected)
})

test("view with no nodes or edges but virtual keyboard shown", () => {
    const state: State = {
        graph: {
            nodes: {},
            nodeOrder: [],
            edges: []
        },
        zooming: false,
        dragging: false,
        draggedNode: null,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: [0, 0],
        selectedOutput: null,
        selectedInput: null,
        potentialDoubleClick: false,
        nodePlacementLocation: {
            x: 0,
            y: 0,
        },
        finder: {
            search: "",
            options: [],
            show: false,
        },
        virtualKeyboard: {
            show: true,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: {
            kind: InputTargetKind.NONE,
        },
        camera: identity(),
        operations: {},
        theme
    }
    const actual = view(state)
    const expected = stack([
        container({ color: state.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({ camera: state.camera, children: [], connections: [] }),
        virtualKeyboard(state.theme, state.virtualKeyboard.kind)
    ])
    expect(actual).toEqual(expected)
})


test("view with no nodes or edges but finder and virtual keyboard shown", () => {
    const state: State = {
        graph: {
            nodes: {},
            nodeOrder: [],
            edges: []
        },
        zooming: false,
        dragging: false,
        draggedNode: null,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: [0, 0],
        selectedOutput: null,
        selectedInput: null,
        potentialDoubleClick: false,
        nodePlacementLocation: {
            x: 0,
            y: 0,
        },
        finder: {
            search: "",
            options: [],
            show: true,
        },
        virtualKeyboard: {
            show: true,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: {
            kind: InputTargetKind.NONE,
        },
        camera: identity(),
        operations: {},
        theme
    }
    const actual = view(state)
    const expected = stack([
        container({ color: state.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({ camera: state.camera, children: [], connections: [] }),
        finder(state.finder, state.theme),
        virtualKeyboard(state.theme, state.virtualKeyboard.kind)
    ])
    expect(actual).toEqual(expected)
})

test("view with three nodes and no edges", () => {
    const state: State = {
        graph: {
            nodes: {
                "first": {
                    uuid: "first",
                    name: "first",
                    inputs: [],
                    outputs: [],
                    x: 0,
                    y: 0,
                },
                "second": {
                    uuid: "second",
                    name: "second",
                    inputs: [],
                    outputs: [],
                    x: 0,
                    y: 0,
                },
                "third": {
                    uuid: "thrid",
                    name: "thrid",
                    inputs: [],
                    outputs: [],
                    x: 0,
                    y: 0,
                }
            },
            nodeOrder: ["first", "second", "third"],
            edges: []
        },
        zooming: false,
        dragging: false,
        draggedNode: null,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: [0, 0],
        selectedOutput: null,
        selectedInput: null,
        potentialDoubleClick: false,
        nodePlacementLocation: {
            x: 0,
            y: 0,
        },
        finder: {
            search: "",
            options: [],
            show: false,
        },
        virtualKeyboard: {
            show: false,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: {
            kind: InputTargetKind.NONE,
        },
        camera: identity(),
        operations: {},
        theme
    }
    const actual = view(state)
    const expected = stack([
        container({ color: state.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({
            camera: state.camera,
            children: [
                nodeUi(state.theme, state.graph.nodes["first"]),
                nodeUi(state.theme, state.graph.nodes["second"]),
                nodeUi(state.theme, state.graph.nodes["third"]),
            ],
            connections: []
        }),
    ])
    expect(actual).toEqual(expected)
})

test("view with three nodes and no edges", () => {
    const state: State = {
        graph: {
            nodes: {
                "first": {
                    uuid: "first",
                    name: "first",
                    inputs: [],
                    outputs: [],
                    x: 0,
                    y: 0,
                },
                "second": {
                    uuid: "second",
                    name: "second",
                    inputs: [],
                    outputs: [],
                    x: 0,
                    y: 0,
                },
                "third": {
                    uuid: "thrid",
                    name: "thrid",
                    inputs: [],
                    outputs: [],
                    x: 0,
                    y: 0,
                }
            },
            nodeOrder: ["first", "second", "third"],
            edges: []
        },
        zooming: false,
        dragging: false,
        draggedNode: "first",
        pointers: [],
        pointerDistance: 0,
        pointerCenter: [0, 0],
        selectedOutput: null,
        selectedInput: null,
        potentialDoubleClick: false,
        nodePlacementLocation: {
            x: 0,
            y: 0,
        },
        finder: {
            search: "",
            options: [],
            show: false,
        },
        virtualKeyboard: {
            show: false,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: {
            kind: InputTargetKind.NONE,
        },
        camera: identity(),
        operations: {},
        theme
    }
    const actual = view(state)
    const expected = stack([
        container({ color: state.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({
            camera: state.camera,
            children: [
                nodeUi(state.theme, state.graph.nodes["first"]),
                nodeUi(state.theme, state.graph.nodes["second"]),
                nodeUi(state.theme, state.graph.nodes["third"]),
            ],
            connections: []
        }),
    ])
    expect(actual).toEqual(expected)
})


test("view with three nodes and one edges", () => {
    const state: State = {
        graph: {
            nodes: {
                "first": {
                    uuid: "first",
                    name: "first",
                    inputs: [],
                    outputs: [
                        {
                            name: "out",
                            selected: false,
                            edgeIndices: [0]
                        }
                    ],
                    x: 0,
                    y: 0,
                },
                "second": {
                    uuid: "second",
                    name: "second",
                    inputs: [
                        {
                            name: "in",
                            selected: false,
                            edgeIndices: [0]
                        }
                    ],
                    outputs: [],
                    x: 0,
                    y: 0,
                },
                "third": {
                    uuid: "third",
                    name: "thirdd",
                    inputs: [],
                    outputs: [],
                    x: 0,
                    y: 0,
                }
            },
            nodeOrder: ["first", "second", "third"],
            edges: [
                {
                    input: {
                        nodeUUID: "second",
                        inputIndex: 0,
                    },
                    output: {
                        nodeUUID: "first",
                        outputIndex: 0,
                    }
                }
            ]
        },
        zooming: false,
        dragging: false,
        draggedNode: null,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: [0, 0],
        selectedOutput: null,
        selectedInput: null,
        potentialDoubleClick: false,
        nodePlacementLocation: {
            x: 0,
            y: 0,
        },
        finder: {
            search: "",
            options: [],
            show: false,
        },
        virtualKeyboard: {
            show: false,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: {
            kind: InputTargetKind.NONE,
        },
        camera: identity(),
        operations: {},
        theme
    }
    const actual = view(state)
    const expected = stack([
        container({ color: state.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({
            camera: state.camera,
            children: [
                nodeUi(state.theme, state.graph.nodes["first"]),
                nodeUi(state.theme, state.graph.nodes["second"]),
                nodeUi(state.theme, state.graph.nodes["third"]),
            ],
            connections: [
                {
                    from: "output first 0",
                    to: "input second 0",
                    color: theme.connection
                }
            ]
        }),
    ])
    expect(actual).toEqual(expected)
})