import { AppEvent, EventKind } from "../../../src/event"
import { Body, emptyGraph, Graph, Input, Node, Output } from "../../../src/graph/model"
import { identity } from "../../../src/linear_algebra/matrix3x3"
import { InputTargetKind, Selected, SelectedKind, State, Theme, VirtualKeyboardKind } from "../../../src/state"
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
    virtualKeys,
} from "../../../src/ui/view"
import { contextMenu } from "../../../src/ui/view/context_menu"

test("spacer", () => {
    expect(spacer(10)).toEqual(container({ width: 10, height: 10 }))
})

test("intersperse", () => {
    expect(intersperse([1, 2, 3], 0)).toEqual([1, 0, 2, 0, 3])
})

const theme: Theme = {
    background: { red: 2, green: 22, blue: 39, alpha: 255 },
    node: { red: 41, green: 95, blue: 120, alpha: 255 },
    selectedNode: { red: 23, green: 54, blue: 69, alpha: 255 },
    input: { red: 188, green: 240, blue: 192, alpha: 255 },
    selectedInput: { red: 175, green: 122, blue: 208, alpha: 255 },
    connection: { red: 255, green: 255, blue: 255, alpha: 255 },
}

test("inputUi not selected", () => {
    const input: Input = {
        uuid: 'uuid',
        node: 'node',
        name: 'name',
    }
    const actual = inputUi(theme, input, { kind: SelectedKind.NONE })
    const expected = container<AppEvent>({
        onClick: {
            kind: EventKind.CLICKED_INPUT,
            input: 'uuid'
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container({
                id: 'uuid',
                width: 14,
                height: 14,
                color: theme.input,
            }),
            spacer(4),
            text('name')
        ])
    )
    expect(actual).toEqual(expected)
})

test("inputUi selected", () => {
    const input: Input = {
        uuid: 'uuid',
        node: 'node',
        name: 'name'
    }
    const actual = inputUi(theme, input, { kind: SelectedKind.INPUT, input: 'uuid' })
    const expected = container<AppEvent>({
        onClick: {
            kind: EventKind.CLICKED_INPUT,
            input: 'uuid'
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container({
                id: 'uuid',
                width: 14,
                height: 14,
                color: theme.selectedInput,
            }),
            spacer(4),
            text('name')
        ])
    )
    expect(actual).toEqual(expected)
})

test("inputsUi", () => {
    const inputs: Input[] = [
        {
            uuid: 'first',
            node: 'node',
            name: "first",
        },
        {
            uuid: 'second',
            node: 'node',
            name: "second",
        },
        {
            uuid: 'third',
            node: 'node',
            name: "third",
        }
    ]
    const selected: Selected = { kind: SelectedKind.INPUT, input: 'third' }
    const actual = inputsUi(theme, inputs, selected)
    const expected = column([
        inputUi(theme, inputs[0], selected),
        spacer(4),
        inputUi(theme, inputs[1], selected),
        spacer(4),
        inputUi(theme, inputs[2], selected),
    ])
    expect(actual).toEqual(expected)
})

test("outputUi not selected", () => {
    const output: Output = {
        uuid: 'uuid',
        node: 'node',
        name: 'name',
        edges: []
    }
    const actual = outputUi(theme, output, { kind: SelectedKind.NONE })
    const expected = container<AppEvent>({
        onClick: {
            kind: EventKind.CLICKED_OUTPUT,
            output: 'uuid'
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text('name'),
            spacer(4),
            container({
                id: 'uuid',
                width: 14,
                height: 14,
                color: theme.input,
            }),
        ])
    )
    expect(actual).toEqual(expected)
})

test("outputUi selected", () => {
    const output: Output = {
        uuid: "uuid",
        node: 'node',
        name: 'name',
        edges: []
    }
    const actual = outputUi(theme, output, { kind: SelectedKind.OUTPUT, output: 'uuid' })
    const expected = container<AppEvent>({
        onClick: {
            kind: EventKind.CLICKED_OUTPUT,
            output: 'uuid'
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text('name'),
            spacer(4),
            container({
                id: 'uuid',
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
            uuid: 'first',
            node: 'node',
            name: "first",
            edges: []
        },
        {
            uuid: 'second',
            node: 'node',
            name: "second",
            edges: []
        },
        {
            uuid: "third",
            node: 'node',
            name: "third",
            edges: []
        }
    ]
    const selected: Selected = { kind: SelectedKind.OUTPUT, output: 'third' }
    const actual = outputsUi(theme, outputs, selected)
    const expected = column([
        outputUi(theme, outputs[0], selected),
        spacer(4),
        outputUi(theme, outputs[1], selected),
        spacer(4),
        outputUi(theme, outputs[2], selected),
    ])
    expect(actual).toEqual(expected)
})

test("numberUi not selected", () => {
    const body: Body = {
        uuid: 'body uuid',
        node: 'node',
        value: 0,
    }
    const actual = numberUi(theme, body, { kind: SelectedKind.NONE })
    const expected = container({
        color: theme.background,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_NUMBER,
            body: 'body uuid'
        }
    },
        text(body.value.toString()))
    expect(actual).toEqual(expected)
})

test("numberUi editing", () => {
    const body: Body = {
        uuid: 'body uuid',
        node: 'node',
        value: 0,
    }
    const actual = numberUi(theme, body, { kind: SelectedKind.BODY, body: 'body uuid' })
    const expected = container({
        color: theme.selectedInput,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_NUMBER,
            body: 'body uuid'
        }
    },
        text(body.value.toString()))
    expect(actual).toEqual(expected)
})

test("nodeUi no inputs body or outputs", () => {
    const node: Node = {
        uuid: 'uuid',
        name: "node",
        position: { x: 0, y: 0 },
        inputs: [],
        outputs: [],
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node }
    }
    const actual = nodeUi(theme, node.uuid, graph, { kind: SelectedKind.NONE })
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                node: 'uuid'
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
    const node: Node = {
        uuid: 'node uuid',
        name: "node",
        position: { x: 0, y: 0 },
        inputs: ['input uuid'],
        outputs: [],
    }
    const input: Input = {
        uuid: 'input uuid',
        node: 'node',
        name: 'first'
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        inputs: { [input.uuid]: input }
    }
    const selected: Selected = { kind: SelectedKind.NONE }
    const actual = nodeUi(theme, node.uuid, graph, selected)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                node: 'node uuid'
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([inputsUi(theme, node.inputs.map(i => graph.inputs[i]), selected)])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi 1 output, no body and no inputs", () => {
    const node: Node = {
        uuid: 'node uuid',
        name: "node",
        position: { x: 0, y: 0 },
        inputs: [],
        outputs: ['output uuid'],
    }
    const output: Output = {
        uuid: 'output uuid',
        node: 'node',
        name: 'first',
        edges: []
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        outputs: { [output.uuid]: output }
    }
    const selected: Selected = { kind: SelectedKind.NONE }
    const actual = nodeUi(theme, node.uuid, graph, selected)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                node: 'node uuid'
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([outputsUi(theme, node.outputs.map(o => graph.outputs[o]), selected)])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi no inputs or outputs but body defined", () => {
    const node: Node = {
        uuid: 'node uuid',
        name: "node",
        position: { x: 0, y: 0 },
        inputs: [],
        body: 'body uuid',
        outputs: [],
    }
    const body: Body = {
        uuid: 'body uuid',
        node: 'node',
        value: 0
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        bodys: { [body.uuid]: body }
    }
    const selected: Selected = { kind: SelectedKind.NONE }
    const actual = nodeUi(theme, node.uuid, graph, selected)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                node: 'node uuid'
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([numberUi(theme, body, selected), spacer(15)])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi 1 input and 1 output but no body", () => {
    const node: Node = {
        uuid: 'node uuid',
        name: "node",
        position: { x: 0, y: 0 },
        inputs: ['input uuid'],
        outputs: ['output uuid'],
    }
    const input: Input = {
        uuid: 'input uuid',
        node: 'node',
        name: 'first'
    }
    const output: Output = {
        uuid: 'output uuid',
        node: 'node',
        name: 'first',
        edges: []
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        inputs: { [input.uuid]: input },
        outputs: { [output.uuid]: output }
    }
    const selected: Selected = { kind: SelectedKind.NONE }
    const actual = nodeUi(theme, node.uuid, graph, selected)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                node: 'node uuid'
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(theme, node.inputs.map(i => graph.inputs[i]), selected),
                spacer(15),
                outputsUi(theme, node.outputs.map(o => graph.outputs[o]), selected)
            ])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi 1 input body but no outputs", () => {
    const node: Node = {
        uuid: 'node uuid',
        name: "node",
        position: { x: 0, y: 0 },
        inputs: ['input uuid'],
        body: 'body uuid',
        outputs: [],
    }
    const input: Input = {
        uuid: 'input uuid',
        node: 'node uuid',
        name: 'first'
    }
    const body: Body = {
        uuid: 'body uuid',
        node: 'node uuid',
        value: 0
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        inputs: { [input.uuid]: input },
        bodys: { [body.uuid]: body }
    }
    const selected: Selected = { kind: SelectedKind.NONE }
    const actual = nodeUi(theme, node.uuid, graph, selected)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                node: 'node uuid'
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(theme, node.inputs.map(i => graph.inputs[i]), selected),
                numberUi(theme, body, selected),
                spacer(15),
            ])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi 1 output body but no inputs", () => {
    const node: Node = {
        uuid: 'node uuid',
        name: "node",
        position: { x: 0, y: 0 },
        inputs: [],
        body: 'body uuid',
        outputs: ['output uuid'],
    }
    const output: Output = {
        uuid: 'output uuid',
        node: 'node uuid',
        name: 'first',
        edges: []
    }
    const body: Body = {
        uuid: 'body uuid',
        node: 'node uuid',
        value: 0
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        outputs: { [output.uuid]: output },
        bodys: { [body.uuid]: body }
    }
    const selected: Selected = { kind: SelectedKind.NONE }
    const actual = nodeUi(theme, node.uuid, graph, selected)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                node: 'node uuid'
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                numberUi(theme, body, selected),
                spacer(15),
                outputsUi(theme, node.outputs.map(o => graph.outputs[o]), selected),
            ])
        ])
    )
    expect(actual).toEqual(expected)
})


test("nodeUi 1 input body and 1 output", () => {
    const node: Node = {
        uuid: 'node uuid',
        name: "node",
        position: { x: 0, y: 0 },
        inputs: ['input uuid'],
        body: 'body uuid',
        outputs: ['output uuid'],
    }
    const input: Input = {
        uuid: 'input uuid',
        node: 'node uuid',
        name: 'first'
    }
    const output: Output = {
        uuid: "output uuid",
        node: 'node uuid',
        name: 'first',
        edges: []
    }
    const body: Body = {
        uuid: 'body uuid',
        node: 'node uuid',
        value: 0
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        inputs: { [input.uuid]: input },
        outputs: { [output.uuid]: output },
        bodys: { [body.uuid]: body }
    }
    const selected: Selected = { kind: SelectedKind.NONE }
    const actual = nodeUi(theme, node.uuid, graph, selected)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                node: 'node uuid'
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(theme, node.inputs.map(i => graph.inputs[i]), selected),
                spacer(15),
                numberUi(theme, body, selected),
                spacer(15),
                outputsUi(theme, node.outputs.map(o => graph.outputs[o]), selected),
            ])
        ])
    )
    expect(actual).toEqual(expected)
})

test("finder", () => {
    const actual = finder({ search: "text", options: ["foo", "bar"], show: true, openTimeout: false }, theme)
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
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {}
        },
        nodeOrder: [],
        zooming: false,
        dragging: false,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: { x: 0, y: 0 },
        nodePlacementLocation: { x: 0, y: 0 },
        finder: {
            search: "",
            options: [],
            show: false,
            openTimeout: false
        },
        virtualKeyboard: {
            show: false,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: { kind: InputTargetKind.NONE },
        selected: { kind: SelectedKind.NONE },
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
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {}
        },
        nodeOrder: [],
        zooming: false,
        dragging: false,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: { x: 0, y: 0 },
        nodePlacementLocation: { x: 0, y: 0 },
        finder: {
            search: "",
            options: [],
            show: true,
            openTimeout: false
        },
        virtualKeyboard: {
            show: false,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: { kind: InputTargetKind.NONE },
        selected: { kind: SelectedKind.NONE },
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
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {}
        },
        nodeOrder: [],
        zooming: false,
        dragging: false,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: { x: 0, y: 0 },
        nodePlacementLocation: { x: 0, y: 0 },
        finder: {
            search: "",
            options: [],
            show: false,
            openTimeout: false
        },
        virtualKeyboard: {
            show: true,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: { kind: InputTargetKind.NONE },
        selected: { kind: SelectedKind.NONE },
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
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {}
        },
        nodeOrder: [],
        zooming: false,
        dragging: false,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: { x: 0, y: 0 },
        nodePlacementLocation: {
            x: 0,
            y: 0,
        },
        finder: {
            search: "",
            options: [],
            show: true,
            openTimeout: false,
        },
        virtualKeyboard: {
            show: true,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: { kind: InputTargetKind.NONE },
        selected: { kind: SelectedKind.NONE },
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
                    position: { x: 0, y: 0 }
                },
                "second": {
                    uuid: "second",
                    name: "second",
                    inputs: [],
                    outputs: [],
                    position: { x: 0, y: 0 }
                },
                "third": {
                    uuid: "thrid",
                    name: "thrid",
                    inputs: [],
                    outputs: [],
                    position: { x: 0, y: 0 }
                }
            },
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {}
        },
        nodeOrder: ["first", "second", "third"],
        zooming: false,
        dragging: false,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: { x: 0, y: 0 },
        nodePlacementLocation: {
            x: 0,
            y: 0,
        },
        finder: {
            search: "",
            options: [],
            show: false,
            openTimeout: false,
        },
        virtualKeyboard: {
            show: false,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: { kind: InputTargetKind.NONE },
        selected: { kind: SelectedKind.NONE },
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
                nodeUi(state.theme, "first", state.graph, state.selected),
                nodeUi(state.theme, "second", state.graph, state.selected),
                nodeUi(state.theme, "third", state.graph, state.selected),
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
                    position: { x: 0, y: 0 },
                },
                "second": {
                    uuid: "second",
                    name: "second",
                    inputs: [],
                    outputs: [],
                    position: { x: 0, y: 0 },
                },
                "third": {
                    uuid: "thrid",
                    name: "thrid",
                    inputs: [],
                    outputs: [],
                    position: { x: 0, y: 0 },
                }
            },
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {}
        },
        nodeOrder: ["first", "second", "third"],
        zooming: false,
        dragging: false,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: { x: 0, y: 0 },
        nodePlacementLocation: { x: 0, y: 0, },
        finder: {
            search: "",
            options: [],
            show: false,
            openTimeout: false,
        },
        virtualKeyboard: {
            show: false,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: { kind: InputTargetKind.NONE },
        selected: {
            kind: SelectedKind.NODE,
            node: 'first'
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
                nodeUi(state.theme, "first", state.graph, state.selected),
                nodeUi(state.theme, "second", state.graph, state.selected),
                nodeUi(state.theme, "third", state.graph, state.selected),
            ],
            connections: []
        }),
        contextMenu({
            items: [{
                name: "Delete Node",
                shortcut: 'd',
                onClick: {
                    kind: EventKind.DELETE_NODE,
                    node: 'first'
                }
            }],
            backgroundColor: state.theme.node
        })
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
                    outputs: ['output uuid'],
                    position: { x: 0, y: 0 }
                },
                "second": {
                    uuid: "second",
                    name: "second",
                    inputs: ['input uuid'],
                    outputs: [],
                    position: { x: 0, y: 0 }
                },
                "third": {
                    uuid: "third",
                    name: "third",
                    inputs: [],
                    outputs: [],
                    position: { x: 0, y: 0 }
                },
            },
            edges: {
                'edge uuid': {
                    uuid: 'edge uuid',
                    input: 'input uuid',
                    output: 'output uuid'
                }
            },
            inputs: {
                'input uuid': {
                    uuid: 'input uuid',
                    node: 'second',
                    name: 'in',
                    edge: 'edge uuid'
                }
            },
            outputs: {
                'output uuid': {
                    uuid: 'output uuid',
                    node: 'first',
                    name: 'out',
                    edges: ['edge uuid']
                }
            },
            bodys: {}
        },
        nodeOrder: ["first", "second", "third"],
        zooming: false,
        dragging: false,
        pointers: [],
        pointerDistance: 0,
        pointerCenter: { x: 0, y: 0 },
        nodePlacementLocation: {
            x: 0,
            y: 0,
        },
        finder: {
            search: "",
            options: [],
            show: false,
            openTimeout: false,
        },
        virtualKeyboard: {
            show: false,
            kind: VirtualKeyboardKind.ALPHABETIC
        },
        inputTarget: { kind: InputTargetKind.NONE },
        selected: { kind: SelectedKind.NONE },
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
                nodeUi(state.theme, "first", state.graph, state.selected),
                nodeUi(state.theme, "second", state.graph, state.selected),
                nodeUi(state.theme, "third", state.graph, state.selected),
            ],
            connections: [
                {
                    from: 'output uuid',
                    to: 'input uuid',
                    color: theme.connection
                }
            ]
        }),
    ])
    expect(actual).toEqual(expected)
})