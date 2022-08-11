import { AppEvent, EventKind } from "../../src/update"
import { Body, emptyGraph, Graph, Input, Node, Output } from "../../src/model/graph"
import { identity } from "../../src/linear_algebra/matrix3x3"
import { Model } from "../../src/model"
import { Theme } from "../../src/model/theme"
import { Focus, FocusFinder, FocusKind } from "../../src/model/focus"
import { PointerActionKind } from "../../src/model/pointer_action"
import { column, container, row, scene, stack, text } from "../../src/ui"
import { CrossAxisAlignment, MainAxisAlignment } from "../../src/ui/alignment"
import {
    alphabeticVirtualKeyboard,
    finder,
    inputsUi,
    inputUi,
    intersperse,
    nodeUi,
    bodyUi,
    numericVirtualKeyboard,
    outputsUi,
    outputUi,
    spacer,
    view,
    virtualKey,
    virtualKeys,
} from "../../src/view"
import { contextMenu } from "../../src/view/context_menu"
import { QuickSelectKind } from "../../src/model/quick_select"

test("spacer", () => {
    expect(spacer(10)).toEqual(container({ width: 10, height: 10 }))
})

test("intersperse", () => {
    expect(intersperse([1, 2, 3], 0)).toEqual([1, 0, 2, 0, 3])
})

const theme: Theme = {
    background: { red: 2, green: 22, blue: 39, alpha: 255 },
    node: { red: 41, green: 95, blue: 120, alpha: 255 },
    nodePlacementLocation: { red: 41, green: 95, blue: 120, alpha: 50 },
    focusNode: { red: 23, green: 54, blue: 69, alpha: 255 },
    input: { red: 188, green: 240, blue: 192, alpha: 255 },
    focusInput: { red: 175, green: 122, blue: 208, alpha: 255 },
    connection: { red: 255, green: 255, blue: 255, alpha: 255 },
}

test("inputUi not focused", () => {
    const input: Input = {
        uuid: 'uuid',
        node: 'node',
        name: 'name',
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = inputUi(theme, input, focus)
    const expected = container<AppEvent>({
        onClick: {
            kind: EventKind.CLICKED_INPUT,
            input: 'uuid'
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container({
                id: 'uuid',
                padding: { top: 2, right: 4, bottom: 2, left: 4 },
                color: theme.input,
            }, text({ color: theme.background }, " ")),
            spacer(4),
            text('name')
        ])
    )
    expect(actual).toEqual(expected)
})

test("inputUi focused", () => {
    const input: Input = {
        uuid: 'uuid',
        node: 'node',
        name: 'name'
    }
    const actual = inputUi(theme, input, {
        kind: FocusKind.INPUT,
        input: 'uuid',
        quickSelect: { kind: QuickSelectKind.NONE }
    })
    const expected = container<AppEvent>({
        onClick: {
            kind: EventKind.CLICKED_INPUT,
            input: 'uuid'
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container({
                id: 'uuid',
                padding: { top: 2, right: 4, bottom: 2, left: 4 },
                color: theme.focusInput,
            }, text({ color: theme.background }, " ")),
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
    const focus: Focus = {
        kind: FocusKind.INPUT,
        input: 'third',
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = inputsUi(theme, inputs, focus)
    const expected = column([
        inputUi(theme, inputs[0], focus),
        spacer(4),
        inputUi(theme, inputs[1], focus),
        spacer(4),
        inputUi(theme, inputs[2], focus),
    ])
    expect(actual).toEqual(expected)
})

test("outputUi not focused", () => {
    const output: Output = {
        uuid: 'uuid',
        node: 'node',
        name: 'name',
        edges: []
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = outputUi(theme, output, focus)
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
                padding: { top: 2, right: 4, bottom: 2, left: 4 },
                color: theme.input,
            }, text({ color: theme.background }, ' ')),
        ])
    )
    expect(actual).toEqual(expected)
})

test("outputUi focused", () => {
    const output: Output = {
        uuid: "uuid",
        node: 'node',
        name: 'name',
        edges: []
    }
    const actual = outputUi(theme, output, {
        kind: FocusKind.OUTPUT,
        output: 'uuid',
        quickSelect: { kind: QuickSelectKind.NONE }
    })
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
                padding: { top: 2, right: 4, bottom: 2, left: 4 },
                color: theme.focusInput,
            }, text({ color: theme.background }, ' ')),
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
    const focus: Focus = {
        kind: FocusKind.OUTPUT,
        output: 'third',
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = outputsUi(theme, outputs, focus)
    const expected = column([
        outputUi(theme, outputs[0], focus),
        spacer(4),
        outputUi(theme, outputs[1], focus),
        spacer(4),
        outputUi(theme, outputs[2], focus),
    ])
    expect(actual).toEqual(expected)
})

test("bodyUi not focused", () => {
    const body: Body = {
        uuid: 'body uuid',
        node: 'node',
        value: 0,
        editable: true,
        rank: 0,
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = bodyUi(theme, body, focus)
    const expected = container({
        color: theme.background,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_BODY,
            body: 'body uuid'
        }
    },
        text(body.value.toString()))
    expect(actual).toEqual(expected)
})

test("bodyUi editing", () => {
    const body: Body = {
        uuid: 'body uuid',
        node: 'node',
        value: 0,
        editable: true,
        rank: 0,
    }
    const actual = bodyUi(theme, body, {
        kind: FocusKind.BODY,
        body: 'body uuid',
        quickSelect: { kind: QuickSelectKind.NONE }
    })
    const expected = container({
        color: theme.focusInput,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_BODY,
            body: 'body uuid'
        }
    },
        text(body.value.toString()))
    expect(actual).toEqual(expected)
})

test("bodyUi with vector", () => {
    const body: Body = {
        uuid: 'body uuid',
        node: 'node',
        value: [0, 1, 2],
        rank: 1,
        editable: false,
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = bodyUi(theme, body, focus)
    const expected = container({ color: theme.background },
        column([
            container({ padding: 5 }, text("0")),
            container({ padding: 5 }, text("1")),
            container({ padding: 5 }, text("2")),
        ])
        )
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
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = nodeUi(theme, node.uuid, graph, focus)
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
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = nodeUi(theme, node.uuid, graph, focus)
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
            row([inputsUi(theme, node.inputs.map(i => graph.inputs[i]), focus)])
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
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = nodeUi(theme, node.uuid, graph, focus)
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
            row([outputsUi(theme, node.outputs.map(o => graph.outputs[o]), focus)])
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
        value: 0,
        editable: true,
        rank: 0,
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        bodys: { [body.uuid]: body }
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = nodeUi(theme, node.uuid, graph, focus)
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
            row([bodyUi(theme, body, focus), spacer(15)])
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
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = nodeUi(theme, node.uuid, graph, focus)
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
                inputsUi(theme, node.inputs.map(i => graph.inputs[i]), focus),
                spacer(15),
                outputsUi(theme, node.outputs.map(o => graph.outputs[o]), focus)
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
        value: 0,
        editable: true,
        rank: 0,
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        inputs: { [input.uuid]: input },
        bodys: { [body.uuid]: body }
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = nodeUi(theme, node.uuid, graph, focus)
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
                inputsUi(theme, node.inputs.map(i => graph.inputs[i]), focus),
                bodyUi(theme, body, focus),
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
        value: 0,
        editable: true,
        rank: 0,
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        outputs: { [output.uuid]: output },
        bodys: { [body.uuid]: body }
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = nodeUi(theme, node.uuid, graph, focus)
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
                bodyUi(theme, body, focus),
                spacer(15),
                outputsUi(theme, node.outputs.map(o => graph.outputs[o]), focus),
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
        value: 0,
        editable: true,
        rank: 0,
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        inputs: { [input.uuid]: input },
        outputs: { [output.uuid]: output },
        bodys: { [body.uuid]: body }
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    }
    const actual = nodeUi(theme, node.uuid, graph, focus)
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
                inputsUi(theme, node.inputs.map(i => graph.inputs[i]), focus),
                spacer(15),
                bodyUi(theme, body, focus),
                spacer(15),
                outputsUi(theme, node.outputs.map(o => graph.outputs[o]), focus),
            ])
        ])
    )
    expect(actual).toEqual(expected)
})

test("finder", () => {
    const actual = finder({
        kind: FocusKind.FINDER,
        search: "text",
        options: ["foo", "bar"],
        quickSelect: { kind: QuickSelectKind.NONE }
    }, theme)
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

test("view with no nodes or edges", () => {
    const model: Model = {
        graph: {
            nodes: {},
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {}
        },
        nodeOrder: [],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.NONE },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        camera: identity(),
        operations: {},
        openFinderFirstClick: false,
        panCamera: { left: false, up: false, down: false, right: false, now: 0 },
        zoomCamera: { in: false, out: false, now: 0 },
        theme
    }
    const actual = view(model)
    const expected = stack([
        container({ color: model.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({ camera: model.camera, children: [], connections: [] }),
    ])
    expect(actual).toEqual(expected)
})

test("view with no nodes or edges but finder shown", () => {
    const model: Model = {
        graph: {
            nodes: {},
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {}
        },
        nodeOrder: [],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.FINDER,
            search: "",
            options: [],
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        openFinderFirstClick: false,
        camera: identity(),
        operations: {},
        panCamera: { left: false, up: false, down: false, right: false, now: 0 },
        zoomCamera: { in: false, out: false, now: 0 },
        theme
    }
    const actual = view(model)
    const expected = stack([
        container({ color: model.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({ camera: model.camera, children: [], connections: [] }),
        finder(model.focus as FocusFinder, model.theme),
        alphabeticVirtualKeyboard(model.theme)
    ])
    expect(actual).toEqual(expected)
})

test("view with three nodes and no edges", () => {
    const model: Model = {
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
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.NONE },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        openFinderFirstClick: false,
        camera: identity(),
        operations: {},
        panCamera: { left: false, up: false, down: false, right: false, now: 0 },
        zoomCamera: { in: false, out: false, now: 0 },
        theme
    }
    const actual = view(model)
    const expected = stack([
        container({ color: model.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(model.theme, "first", model.graph, model.focus),
                nodeUi(model.theme, "second", model.graph, model.focus),
                nodeUi(model.theme, "third", model.graph, model.focus),
            ],
            connections: []
        }),
    ])
    expect(actual).toEqual(expected)
})

test("view with three nodes and no edges", () => {
    const model: Model = {
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
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.NODE,
            node: 'first',
            drag: false,
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        openFinderFirstClick: false,
        camera: identity(),
        operations: {},
        panCamera: { left: false, up: false, down: false, right: false, now: 0 },
        zoomCamera: { in: false, out: false, now: 0 },
        theme
    }
    const actual = view(model)
    const expected = stack([
        container({ color: model.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(model.theme, "first", model.graph, model.focus),
                nodeUi(model.theme, "second", model.graph, model.focus),
                nodeUi(model.theme, "third", model.graph, model.focus),
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
            backgroundColor: model.theme.node
        })
    ])
    expect(actual).toEqual(expected)
})


test("view with three nodes and one edges", () => {
    const model: Model = {
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
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.NONE },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        openFinderFirstClick: false,
        camera: identity(),
        operations: {},
        panCamera: { left: false, up: false, down: false, right: false, now: 0 },
        zoomCamera: { in: false, out: false, now: 0 },
        theme
    }
    const actual = view(model)
    const expected = stack([
        container({ color: model.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(model.theme, "first", model.graph, model.focus),
                nodeUi(model.theme, "second", model.graph, model.focus),
                nodeUi(model.theme, "third", model.graph, model.focus),
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

test("view with body selected", () => {
    const model: Model = {
        graph: {
            nodes: {
                "number": {
                    uuid: "number",
                    name: "number",
                    inputs: [],
                    body: "body",
                    outputs: ["out"],
                    position: { x: 0, y: 0 }
                }
            },
            edges: {},
            inputs: {},
            outputs: {
                "out": {
                    uuid: "out",
                    name: "out",
                    edges: [],
                    node: "number"
                }
            },
            bodys: {
                "body": {
                    uuid: "body",
                    node: "number",
                    value: 0,
                    editable: true,
                    rank: 0,
                }
            }
        },
        nodeOrder: ["number"],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.BODY,
            body: "body",
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        openFinderFirstClick: false,
        camera: identity(),
        operations: {},
        panCamera: { left: false, up: false, down: false, right: false, now: 0 },
        zoomCamera: { in: false, out: false, now: 0 },
        theme
    }
    const actual = view(model)
    const expected = stack([
        container({ color: model.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(model.theme, "number", model.graph, model.focus),
            ],
            connections: []
        }),
        numericVirtualKeyboard(model.theme)
    ])
    expect(actual).toEqual(expected)
})

test("view with input selected", () => {
    const model: Model = {
        graph: {
            nodes: {
                "add": {
                    uuid: "add",
                    name: "add",
                    inputs: ["x0", "y0"],
                    outputs: ["out0"],
                    position: { x: 0, y: 0 }
                },
                "sub": {
                    uuid: "sub",
                    name: "sub",
                    inputs: ["x1", "y1"],
                    outputs: ["out1"],
                    position: { x: 0, y: 0 }
                }
            },
            edges: {
                "edge": {
                    uuid: "edge",
                    input: "x1",
                    output: "out0"
                }
            },
            inputs: {
                "x0": {
                    uuid: "x0",
                    name: "x",
                    node: "add",
                },
                "y0": {
                    uuid: "y0",
                    name: "y",
                    node: "add",
                },
                "x1": {
                    uuid: "x1",
                    name: "x",
                    node: "sub",
                    edge: "edge"
                },
                "y1": {
                    uuid: "y1",
                    name: "y",
                    node: "sub",
                }
            },
            outputs: {
                "out0": {
                    uuid: "out0",
                    name: "out",
                    edges: ["edge"],
                    node: "add"
                },
                "out1": {
                    uuid: "out1",
                    name: "out",
                    edges: [],
                    node: "sub"
                }
            },
            bodys: {}
        },
        nodeOrder: ["add", "sub"],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.INPUT,
            input: "x1",
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        openFinderFirstClick: false,
        camera: identity(),
        operations: {},
        panCamera: { left: false, up: false, down: false, right: false, now: 0 },
        zoomCamera: { in: false, out: false, now: 0 },
        theme
    }
    const actual = view(model)
    const expected = stack([
        container({ color: model.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(model.theme, "add", model.graph, model.focus),
                nodeUi(model.theme, "sub", model.graph, model.focus),
            ],
            connections: [
                {
                    from: "out0",
                    to: "x1",
                    color: { red: 255, green: 255, blue: 255, alpha: 255 }
                }
            ]
        }),
        contextMenu({
            items: [{
                name: 'Delete Edge',
                shortcut: 'd',
                onClick: {
                    kind: EventKind.DELETE_INPUT_EDGE,
                    input: "x1"
                }
            }],
            backgroundColor: theme.node
        })
    ])
    expect(actual).toEqual(expected)
})


test("view with output selected", () => {
    const model: Model = {
        graph: {
            nodes: {
                "add": {
                    uuid: "add",
                    name: "add",
                    inputs: ["x0", "y0"],
                    outputs: ["out0"],
                    position: { x: 0, y: 0 }
                },
                "sub": {
                    uuid: "sub",
                    name: "sub",
                    inputs: ["x1", "y1"],
                    outputs: ["out1"],
                    position: { x: 0, y: 0 }
                }
            },
            edges: {
                "edge": {
                    uuid: "edge",
                    input: "x1",
                    output: "out0"
                }
            },
            inputs: {
                "x0": {
                    uuid: "x0",
                    name: "x",
                    node: "add",
                },
                "y0": {
                    uuid: "y0",
                    name: "y",
                    node: "add",
                },
                "x1": {
                    uuid: "x1",
                    name: "x",
                    node: "sub",
                    edge: "edge"
                },
                "y1": {
                    uuid: "y1",
                    name: "y",
                    node: "sub",
                }
            },
            outputs: {
                "out0": {
                    uuid: "out0",
                    name: "out",
                    edges: ["edge"],
                    node: "add"
                },
                "out1": {
                    uuid: "out1",
                    name: "out",
                    edges: [],
                    node: "sub"
                }
            },
            bodys: {}
        },
        nodeOrder: ["add", "sub"],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.OUTPUT,
            output: "out0",
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        openFinderFirstClick: false,
        camera: identity(),
        operations: {},
        panCamera: { left: false, up: false, down: false, right: false, now: 0 },
        zoomCamera: { in: false, out: false, now: 0 },
        theme
    }
    const actual = view(model)
    const expected = stack([
        container({ color: model.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(model.theme, "add", model.graph, model.focus),
                nodeUi(model.theme, "sub", model.graph, model.focus),
            ],
            connections: [
                {
                    from: "out0",
                    to: "x1",
                    color: { red: 255, green: 255, blue: 255, alpha: 255 }
                }
            ]
        }),
        contextMenu({
            items: [{
                name: 'Delete Edge',
                shortcut: 'd',
                onClick: {
                    kind: EventKind.DELETE_OUTPUT_EDGES,
                    output: "out0"
                }
            }],
            backgroundColor: theme.node
        })
    ])
    expect(actual).toEqual(expected)
})

test("view with node placement location shown", () => {
    const model: Model = {
        graph: {
            nodes: {},
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {}
        },
        nodeOrder: [],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: true },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.NONE },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        camera: identity(),
        operations: {},
        openFinderFirstClick: false,
        panCamera: { left: false, up: false, down: false, right: false, now: 0 },
        zoomCamera: { in: false, out: false, now: 0 },
        theme
    }
    const actual = view(model)
    const expected = stack([
        container({ color: model.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({ camera: model.camera, children: [], connections: [] }),
        scene({
            camera: identity(),
            children: [
                container({
                    color: model.theme.nodePlacementLocation,
                    width: 10,
                    height: 10,
                    x: 250,
                    y: 250,
                })
            ],
            connections: []
        }),
    ])
    expect(actual).toEqual(expected)
})
