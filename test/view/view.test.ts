import * as tf from "@tensorflow/tfjs"

import {
    Body,
    BodyKind,
    emptyGraph,
    Graph,
    Input,
    Node,
    NodeKind,
    Output,
} from "../../src/model/graph"
import { Theme } from "../../src/model/theme"
import { Focus, FocusFinderInsert, FocusKind } from "../../src/model/focus"
import { PointerActionKind } from "../../src/model/pointer_action"
import { column, container, row, text, stack, scene } from "../../src/ui"
import {
    columnBody,
    formatCell,
    inputsUi,
    inputUi,
    intersperse,
    nodeUi,
    numberBody,
    outputsUi,
    outputUi,
    scatterBody,
    spacer,
    tableBody,
    tensorBody,
    textBody,
    view,
} from "../../src/view"
import { QuickSelectKind } from "../../src/model/quick_select"
import { CrossAxisAlignment } from "../../src/ui/alignment"
import "../toEqualData"
import { normalize } from "../../src/normalize"
import { tensorFunc } from "../../src/model/operations"
import { Model } from "../../src/model"
import { identity } from "../../src/linear_algebra/matrix3x3"
import { contextMenu } from "../../src/view/context_menu"
import * as finder from "../../src/finder"
import * as alphabeticVirtualKeyboard from "../../src/alphabetic_virtual_keyboard"
import * as numericVirtualKeyboard from "../../src/numeric_virtual_keyboard"

const addFunc = tensorFunc(tf.add)
const subFunc = tensorFunc(tf.sub)

test("spacer", () => {
    expect(spacer(10)).toEqualData(container({ width: 10, height: 10 }))
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
    error: { red: 199, green: 56, blue: 65, alpha: 255 },
    finder: {
        background: { red: 41, green: 95, blue: 120, alpha: 255 },
        searchBackground: { red: 2, green: 22, blue: 39, alpha: 255 },
        searchText: { red: 188, green: 240, blue: 192, alpha: 255 },
        selected: { red: 188, green: 240, blue: 192, alpha: 255 },
        unselected: { red: 255, green: 255, blue: 255, alpha: 255 },
    },
}

test("inputUi not focused", () => {
    const input: Input = {
        uuid: "uuid",
        node: "node",
        name: "name",
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClick = () => {}
    const actual = inputUi(theme, input, focus, onClick)
    const expected = container(
        { onClick },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container(
                {
                    id: "uuid",
                    padding: { top: 2, right: 4, bottom: 2, left: 4 },
                    color: theme.input,
                },
                text({ color: theme.background }, " ")
            ),
            spacer(4),
            text("name"),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("inputUi focused", () => {
    const input: Input = {
        uuid: "uuid",
        node: "node",
        name: "name",
    }
    const onClick = () => {}
    const actual = inputUi(
        theme,
        input,
        {
            kind: FocusKind.INPUT,
            input: "uuid",
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        onClick
    )
    const expected = container(
        { onClick },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container(
                {
                    id: "uuid",
                    padding: { top: 2, right: 4, bottom: 2, left: 4 },
                    color: theme.focusInput,
                },
                text({ color: theme.background }, " ")
            ),
            spacer(4),
            text("name"),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("inputsUi", () => {
    const inputs: Input[] = [
        {
            uuid: "first",
            node: "node",
            name: "first",
        },
        {
            uuid: "second",
            node: "node",
            name: "second",
        },
        {
            uuid: "third",
            node: "node",
            name: "third",
        },
    ]
    const focus: Focus = {
        kind: FocusKind.INPUT,
        input: "third",
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClick = () => {}
    const actual = inputsUi(theme, inputs, focus, onClick)
    const expected = column([
        inputUi(theme, inputs[0], focus, onClick),
        spacer(4),
        inputUi(theme, inputs[1], focus, onClick),
        spacer(4),
        inputUi(theme, inputs[2], focus, onClick),
    ])
    expect(actual).toEqualData(expected)
})

test("outputUi not focused", () => {
    const output: Output = {
        uuid: "uuid",
        node: "node",
        name: "name",
        edges: [],
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClick = () => {}
    const actual = outputUi(theme, output, focus, onClick)
    const expected = container(
        { onClick },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("name"),
            spacer(4),
            container(
                {
                    id: "uuid",
                    padding: { top: 2, right: 4, bottom: 2, left: 4 },
                    color: theme.input,
                },
                text({ color: theme.background }, " ")
            ),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("outputUi focused", () => {
    const output: Output = {
        uuid: "uuid",
        node: "node",
        name: "name",
        edges: [],
    }
    const onClick = () => {}
    const actual = outputUi(
        theme,
        output,
        {
            kind: FocusKind.OUTPUT,
            output: "uuid",
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        onClick
    )
    const expected = container(
        { onClick },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("name"),
            spacer(4),
            container(
                {
                    id: "uuid",
                    padding: { top: 2, right: 4, bottom: 2, left: 4 },
                    color: theme.focusInput,
                },
                text({ color: theme.background }, " ")
            ),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("outputsUi", () => {
    const outputs: Output[] = [
        {
            uuid: "first",
            node: "node",
            name: "first",
            edges: [],
        },
        {
            uuid: "second",
            node: "node",
            name: "second",
            edges: [],
        },
        {
            uuid: "third",
            node: "node",
            name: "third",
            edges: [],
        },
    ]
    const focus: Focus = {
        kind: FocusKind.OUTPUT,
        output: "third",
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClick = () => {}
    const actual = outputsUi(theme, outputs, focus, onClick)
    const expected = column([
        outputUi(theme, outputs[0], focus, onClick),
        spacer(4),
        outputUi(theme, outputs[1], focus, onClick),
        spacer(4),
        outputUi(theme, outputs[2], focus, onClick),
    ])
    expect(actual).toEqualData(expected)
})

test("numberBody not focused", () => {
    const body: Body = {
        kind: BodyKind.NUMBER,
        uuid: "body uuid",
        node: "node",
        value: 0,
        text: "0",
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClick = () => {}
    const actual = numberBody(theme, body, focus, onClick)
    const expected = container(
        {
            color: theme.background,
            padding: 5,
            onClick,
        },
        text(body.value.toString())
    )
    expect(actual).toEqualData(expected)
})

test("bodyUi editing", () => {
    const body: Body = {
        kind: BodyKind.NUMBER,
        uuid: "body uuid",
        node: "node",
        value: 0,
        text: "0",
    }
    const onClick = () => {}
    const actual = numberBody(
        theme,
        body,
        {
            kind: FocusKind.BODY_NUMBER,
            body: "body uuid",
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        onClick
    )
    const expected = container(
        {
            color: theme.focusInput,
            padding: 5,
            onClick,
        },
        text(body.value.toString())
    )
    expect(actual).toEqualData(expected)
})

test("tensorUi with scalar", () => {
    const body: Body = {
        kind: BodyKind.TENSOR,
        uuid: "body uuid",
        node: "node",
        value: 5,
        shape: [],
        rank: 0,
    }
    const actual = tensorBody(theme, body)
    const expected = container(
        {
            color: theme.background,
            padding: 5,
        },
        text("5")
    )
    expect(actual).toEqualData(expected)
})

test("tensorUi with scalar string", () => {
    const body: Body = {
        kind: BodyKind.TENSOR,
        uuid: "body uuid",
        node: "node",
        value: "hello",
        shape: [],
        rank: 0,
    }
    const actual = tensorBody(theme, body)
    const expected = container(
        {
            color: theme.background,
            padding: 5,
        },
        text("hello")
    )
    expect(actual).toEqualData(expected)
})

test("tensorUi with vector", () => {
    const body: Body = {
        kind: BodyKind.TENSOR,
        uuid: "body uuid",
        node: "node",
        value: [0, 1, 2],
        shape: [3],
        rank: 1,
    }
    const actual = tensorBody(theme, body)
    const expected = column([
        container({ padding: 5 }, text("3 rows")),
        container(
            { color: theme.background },
            column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                container({ padding: 5 }, text("0")),
                container({ padding: 5 }, text("1")),
                container({ padding: 5 }, text("2")),
            ])
        ),
    ])
    expect(actual).toEqualData(expected)
})

test("tensorUi with string vector", () => {
    const body: Body = {
        kind: BodyKind.TENSOR,
        uuid: "body uuid",
        node: "node",
        value: ["a", "b", "c"],
        shape: [3],
        rank: 1,
    }
    const actual = tensorBody(theme, body)
    const expected = column([
        container({ padding: 5 }, text("3 rows")),
        container(
            { color: theme.background },
            column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                container({ padding: 5 }, text("a")),
                container({ padding: 5 }, text("b")),
                container({ padding: 5 }, text("c")),
            ])
        ),
    ])
    expect(actual).toEqualData(expected)
})

test("tensorBody with matrix", () => {
    const body: Body = {
        kind: BodyKind.TENSOR,
        uuid: "body uuid",
        node: "node",
        value: [
            [0, 1, 2],
            [4, 5, 6],
        ],
        rank: 2,
        shape: [2, 3],
    }
    const actual = tensorBody(theme, body)
    const expected = column([
        container({ padding: 5 }, text("3 columns 2 rows")),
        container(
            { color: theme.background },
            row([
                container(
                    { padding: 5 },
                    column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                        container({ padding: 5 }, text("0")),
                        container({ padding: 5 }, text("4")),
                    ])
                ),
                container(
                    { padding: 5 },
                    column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                        container({ padding: 5 }, text("1")),
                        container({ padding: 5 }, text("5")),
                    ])
                ),
                container(
                    { padding: 5 },
                    column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                        container({ padding: 5 }, text("2")),
                        container({ padding: 5 }, text("6")),
                    ])
                ),
            ])
        ),
    ])

    expect(actual).toEqualData(expected)
})

test("tensorBody with 3d body not yet implemented", () => {
    const body: Body = {
        kind: BodyKind.TENSOR,
        uuid: "body uuid",
        node: "node",
        value: [[[5]]],
        shape: [1, 1, 1],
        rank: 3,
    }
    const actual = tensorBody(theme, body)
    const expected = text("no view for this rank yet")
    expect(actual).toEqualData(expected)
})

test("bodyUi with scatter plot", () => {
    const body: Body = {
        kind: BodyKind.SCATTER,
        uuid: "body uuid",
        node: "node",
        x: normalize([0, 1, 2], [10, 280]),
        y: normalize([3, 5, 7], [10, 280]),
    }
    const actual = scatterBody(theme, body)
    const expected = container(
        { width: 300, height: 300, color: theme.background },
        stack([
            container({
                x: 10,
                y: 280,
                width: 10,
                height: 10,
                color: theme.focusInput,
            }),
            container({
                x: 145,
                y: 145,
                width: 10,
                height: 10,
                color: theme.focusInput,
            }),
            container({
                x: 280,
                y: 10,
                width: 10,
                height: 10,
                color: theme.focusInput,
            }),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("nodeUi no body 1 outputs", () => {
    const node: Node = {
        kind: NodeKind.SOURCE,
        uuid: "uuid",
        name: "node",
        position: { x: 0, y: 0 },
        body: "body uuid",
        outputs: ["out"],
    }
    const body: Body = {
        kind: BodyKind.NO,
        uuid: "body uuid",
        node: "uuid",
    }
    const out: Output = {
        uuid: "out",
        name: "out",
        node: "node",
        edges: [],
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        bodys: { [body.uuid]: body },
        outputs: { [out.uuid]: out },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("nodeUi 1 input, no body and 1 outputs", () => {
    const node: Node = {
        kind: NodeKind.TRANSFORM,
        uuid: "node uuid",
        name: "node",
        position: { x: 0, y: 0 },
        inputs: ["input uuid"],
        body: "body uuid",
        outputs: ["out"],
        func: addFunc,
    }
    const input: Input = {
        uuid: "input uuid",
        node: "node",
        name: "first",
    }
    const body: Body = {
        kind: BodyKind.NO,
        uuid: "body uuid",
        node: "node",
    }
    const out: Output = {
        uuid: "out",
        name: "out",
        node: "node",
        edges: [],
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        inputs: { [input.uuid]: input },
        bodys: { [body.uuid]: body },
        outputs: { [out.uuid]: out },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(
                    theme,
                    node.inputs.map((i) => graph.inputs[i]),
                    focus,
                    onClickInput
                ),
                spacer(15),
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("nodeUi 1 output, no body and no inputs", () => {
    const node: Node = {
        kind: NodeKind.SOURCE,
        uuid: "node uuid",
        name: "node",
        position: { x: 0, y: 0 },
        body: "body uuid",
        outputs: ["output uuid"],
    }
    const output: Output = {
        uuid: "output uuid",
        node: "node",
        name: "first",
        edges: [],
    }
    const body: Body = {
        kind: BodyKind.NO,
        uuid: "body uuid",
        node: "node",
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        outputs: { [output.uuid]: output },
        bodys: { [body.uuid]: body },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("nodeUi no inputs 1 outputs but body defined", () => {
    const node: Node = {
        kind: NodeKind.SOURCE,
        uuid: "node uuid",
        name: "node",
        position: { x: 0, y: 0 },
        body: "body uuid",
        outputs: ["output uuid"],
    }
    const body: Body = {
        kind: BodyKind.NUMBER,
        uuid: "body uuid",
        node: "node",
        value: 0,
        text: "",
    }
    const output: Output = {
        uuid: "output uuid",
        node: "node uuid",
        name: "first",
        edges: [],
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        bodys: { [body.uuid]: body },
        outputs: { [output.uuid]: output },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                numberBody(theme, body, focus, onClickBody),
                spacer(15),
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("nodeUi 1 input and 1 output but no body", () => {
    const node: Node = {
        kind: NodeKind.TRANSFORM,
        uuid: "node uuid",
        name: "node",
        position: { x: 0, y: 0 },
        inputs: ["input uuid"],
        body: "body uuid",
        outputs: ["output uuid"],
        func: addFunc,
    }
    const input: Input = {
        uuid: "input uuid",
        node: "node",
        name: "first",
    }
    const output: Output = {
        uuid: "output uuid",
        node: "node",
        name: "first",
        edges: [],
    }
    const body: Body = {
        kind: BodyKind.NO,
        uuid: "body uuid",
        node: "node",
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        inputs: { [input.uuid]: input },
        outputs: { [output.uuid]: output },
        bodys: { [body.uuid]: body },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(
                    theme,
                    node.inputs.map((i) => graph.inputs[i]),
                    focus,
                    onClickInput
                ),
                spacer(15),
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("nodeUi 1 input body and output", () => {
    const node: Node = {
        kind: NodeKind.TRANSFORM,
        uuid: "node uuid",
        name: "node",
        position: { x: 0, y: 0 },
        inputs: ["input uuid"],
        body: "body uuid",
        outputs: ["output uuid"],
        func: addFunc,
    }
    const input: Input = {
        uuid: "input uuid",
        node: "node uuid",
        name: "first",
    }
    const body: Body = {
        kind: BodyKind.NUMBER,
        uuid: "body uuid",
        node: "node uuid",
        value: 0,
        text: "",
    }
    const output: Output = {
        uuid: "output uuid",
        node: "node",
        name: "first",
        edges: [],
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        inputs: { [input.uuid]: input },
        bodys: { [body.uuid]: body },
        outputs: { [output.uuid]: output },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(
                    theme,
                    node.inputs.map((i) => graph.inputs[i]),
                    focus,
                    onClickInput
                ),
                spacer(15),
                numberBody(theme, body, focus, onClickBody),
                spacer(15),
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("nodeUi 1 input output body", () => {
    const node: Node = {
        kind: NodeKind.TRANSFORM,
        uuid: "node uuid",
        name: "node",
        position: { x: 0, y: 0 },
        inputs: ["input uuid"],
        body: "body uuid",
        outputs: ["output uuid"],
        func: addFunc,
    }
    const input: Input = {
        uuid: "input uuid",
        node: "node uuid",
        name: "first",
    }
    const output: Output = {
        uuid: "output uuid",
        node: "node uuid",
        name: "first",
        edges: [],
    }
    const body: Body = {
        kind: BodyKind.NUMBER,
        uuid: "body uuid",
        node: "node uuid",
        value: 0,
        text: "",
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        inputs: { [input.uuid]: input },
        outputs: { [output.uuid]: output },
        bodys: { [body.uuid]: body },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(
                    theme,
                    node.inputs.map((i) => graph.inputs[i]),
                    focus,
                    onClickInput
                ),
                spacer(15),
                numberBody(theme, body, focus, onClickBody),
                spacer(15),
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("nodeUi 1 input body and 1 output", () => {
    const node: Node = {
        kind: NodeKind.TRANSFORM,
        uuid: "node uuid",
        name: "node",
        position: { x: 0, y: 0 },
        inputs: ["input uuid"],
        body: "body uuid",
        outputs: ["output uuid"],
        func: addFunc,
    }
    const input: Input = {
        uuid: "input uuid",
        node: "node uuid",
        name: "first",
    }
    const output: Output = {
        uuid: "output uuid",
        node: "node uuid",
        name: "first",
        edges: [],
    }
    const body: Body = {
        kind: BodyKind.NUMBER,
        uuid: "body uuid",
        node: "node uuid",
        value: 0,
        text: "",
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        inputs: { [input.uuid]: input },
        outputs: { [output.uuid]: output },
        bodys: { [body.uuid]: body },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(
                    theme,
                    node.inputs.map((i) => graph.inputs[i]),
                    focus,
                    onClickInput
                ),
                spacer(15),
                numberBody(theme, body, focus, onClickBody),
                spacer(15),
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("view with no nodes or edges", () => {
    const model: Model = {
        graph: {
            nodes: {},
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {},
        },
        nodeOrder: [],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.NONE },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        camera: identity(),
        operations: {},
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 0,
        },
        zoomCamera: { in: false, out: false, now: 0 },
        theme,
    }
    const dispatch = async () => {}
    const actual = view(model, dispatch)
    const expected = stack([
        container({
            color: model.theme.background,
            onClick: () => {},
            onDrag: () => {},
        }),
        scene({ camera: model.camera, children: [], connections: [] }),
        contextMenu({
            items: [
                {
                    name: "Reset Zoom",
                    shortcut: "z",
                    onClick: () => {},
                },
            ],
            backgroundColor: model.theme.node,
        }),
    ])
    expect(actual).toEqualData(expected)
})

test("view with no nodes or edges but finder shown", () => {
    const focus: FocusFinderInsert = {
        kind: FocusKind.FINDER_INSERT,
        finder: {
            search: "",
            options: [],
            selectedIndex: 0,
        },
        quickSelect: { kind: QuickSelectKind.NONE },
        uppercase: false,
    }
    const model: Model = {
        graph: {
            nodes: {},
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {},
        },
        nodeOrder: [],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus,
        camera: identity(),
        operations: {},
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 0,
        },
        zoomCamera: { in: false, out: false, now: 0 },
        theme,
    }
    const dispatch = async () => {}
    const actual = view(model, dispatch)
    const expected = stack([
        container({
            color: model.theme.background,
            onClick: () => {},
            onDrag: () => {},
        }),
        scene({ camera: model.camera, children: [], connections: [] }),
        finder.view({
            model: focus.finder,
            theme: model.theme.finder,
            onClick: () => {},
        }),
        alphabeticVirtualKeyboard.view({
            color: model.theme.node,
            uppercase: false,
            onClick: () => {},
        }),
    ])
    expect(actual).toEqualData(expected)
})

test("view with no nodes or edges but finder shown capitalized", () => {
    const focus: FocusFinderInsert = {
        kind: FocusKind.FINDER_INSERT,
        finder: {
            search: "",
            options: [],
            selectedIndex: 0,
        },
        quickSelect: { kind: QuickSelectKind.NONE },
        uppercase: true,
    }
    const model: Model = {
        graph: {
            nodes: {},
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {},
        },
        nodeOrder: [],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus,
        camera: identity(),
        operations: {},
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 0,
        },
        zoomCamera: { in: false, out: false, now: 0 },
        theme,
    }
    const dispatch = async () => {}
    const actual = view(model, dispatch)
    const expected = stack([
        container({
            color: model.theme.background,
            onClick: () => {},
            onDrag: () => {},
        }),
        scene({ camera: model.camera, children: [], connections: [] }),
        finder.view({
            model: focus.finder,
            theme: theme.finder,
            onClick: () => {},
        }),
        alphabeticVirtualKeyboard.view({
            color: model.theme.node,
            uppercase: true,
            onClick: () => {},
        }),
    ])
    expect(actual).toEqualData(expected)
})

test("view with positive number", () => {
    const model: Model = {
        graph: {
            nodes: {
                number: {
                    kind: NodeKind.SOURCE,
                    uuid: "number",
                    name: "number",
                    body: "body",
                    outputs: [],
                    position: { x: 0, y: 0 },
                },
            },
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {
                body: {
                    kind: BodyKind.NUMBER,
                    uuid: "body",
                    node: "number",
                    value: 10,
                    text: "10",
                },
            },
        },
        nodeOrder: ["number"],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.BODY_NUMBER,
            body: "body",
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        camera: identity(),
        operations: {},
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 0,
        },
        zoomCamera: { in: false, out: false, now: 0 },
        theme,
    }
    const dispatch = async () => {}
    const actual = view(model, dispatch)
    const expected = stack([
        container({
            color: model.theme.background,
            onClick: () => {},
            onDrag: () => {},
        }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(
                    model.theme,
                    "number",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
            ],
            connections: [],
        }),
        numericVirtualKeyboard.view({
            color: model.theme.node,
            positive: true,
            onClick: () => {},
        }),
    ])
    expect(actual).toEqualData(expected)
})

test("view with negative number", () => {
    const model: Model = {
        graph: {
            nodes: {
                number: {
                    kind: NodeKind.SOURCE,
                    uuid: "number",
                    name: "number",
                    body: "body",
                    outputs: [],
                    position: { x: 0, y: 0 },
                },
            },
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {
                body: {
                    kind: BodyKind.NUMBER,
                    uuid: "body",
                    node: "number",
                    value: -10,
                    text: "-10",
                },
            },
        },
        nodeOrder: ["number"],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.BODY_NUMBER,
            body: "body",
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        camera: identity(),
        operations: {},
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 0,
        },
        zoomCamera: { in: false, out: false, now: 0 },
        theme,
    }
    const dispatch = async () => {}
    const actual = view(model, dispatch)
    const expected = stack([
        container({
            color: model.theme.background,
            onClick: () => {},
            onDrag: () => {},
        }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(
                    model.theme,
                    "number",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
            ],
            connections: [],
        }),
        numericVirtualKeyboard.view({
            color: model.theme.node,
            positive: false,
            onClick: () => {},
        }),
    ])
    expect(actual).toEqualData(expected)
})

test("view with text", () => {
    const model: Model = {
        graph: {
            nodes: {
                text: {
                    kind: NodeKind.SOURCE,
                    uuid: "text",
                    name: "text",
                    body: "body",
                    outputs: [],
                    position: { x: 0, y: 0 },
                },
            },
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {
                body: {
                    kind: BodyKind.TEXT,
                    uuid: "body",
                    node: "text",
                    value: "hello",
                },
            },
        },
        nodeOrder: ["text"],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.BODY_TEXT,
            body: "body",
            quickSelect: { kind: QuickSelectKind.NONE },
            uppercase: false,
        },
        camera: identity(),
        operations: {},
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 0,
        },
        zoomCamera: { in: false, out: false, now: 0 },
        theme,
    }
    const dispatch = async () => {}
    const actual = view(model, dispatch)
    const expected = stack([
        container({
            color: model.theme.background,
            onClick: () => {},
            onDrag: () => {},
        }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(
                    model.theme,
                    "text",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
            ],
            connections: [],
        }),
        alphabeticVirtualKeyboard.view({
            color: model.theme.node,
            uppercase: false,
            onClick: () => {},
        }),
    ])
    expect(actual).toEqualData(expected)
})

test("view with three nodes and no edges", () => {
    const model: Model = {
        graph: {
            nodes: {
                first: {
                    kind: NodeKind.TRANSFORM,
                    uuid: "first",
                    name: "first",
                    inputs: [],
                    body: "first body uuid",
                    outputs: [],
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
                second: {
                    kind: NodeKind.TRANSFORM,
                    uuid: "second",
                    name: "second",
                    inputs: [],
                    body: "second body uuid",
                    outputs: [],
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
                third: {
                    kind: NodeKind.TRANSFORM,
                    uuid: "thrid",
                    name: "thrid",
                    inputs: [],
                    body: "third body uuid",
                    outputs: [],
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
            },
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {
                "first body uuid": {
                    kind: BodyKind.NO,
                    uuid: "first body uuid",
                    node: "first",
                },
                "second body uuid": {
                    kind: BodyKind.NO,
                    uuid: "second body uuid",
                    node: "second",
                },
                "third body uuid": {
                    kind: BodyKind.NO,
                    uuid: "third body uuid",
                    node: "third",
                },
            },
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
        camera: identity(),
        operations: {},
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 0,
        },
        zoomCamera: { in: false, out: false, now: 0 },
        theme,
    }
    const dispatch = async () => {}
    const actual = view(model, dispatch)
    const expected = stack([
        container({
            color: model.theme.background,
            onClick: () => {},
            onDrag: () => {},
        }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(
                    model.theme,
                    "first",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
                nodeUi(
                    model.theme,
                    "second",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
                nodeUi(
                    model.theme,
                    "third",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
            ],
            connections: [],
        }),
        contextMenu({
            items: [
                {
                    name: "Reset Zoom",
                    shortcut: "z",
                    onClick: () => {},
                },
            ],
            backgroundColor: model.theme.node,
        }),
    ])
    expect(actual).toEqualData(expected)
})

test("view with three nodes and no edges", () => {
    const model: Model = {
        graph: {
            nodes: {
                first: {
                    kind: NodeKind.TRANSFORM,
                    uuid: "first",
                    name: "first",
                    inputs: [],
                    body: "first body uuid",
                    outputs: [],
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
                second: {
                    kind: NodeKind.TRANSFORM,
                    uuid: "second",
                    name: "second",
                    inputs: [],
                    body: "second body uuid",
                    outputs: [],
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
                third: {
                    kind: NodeKind.TRANSFORM,
                    uuid: "thrid",
                    name: "thrid",
                    inputs: [],
                    body: "third body uuid",
                    outputs: [],
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
            },
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {
                "first body uuid": {
                    kind: BodyKind.NO,
                    uuid: "first body uuid",
                    node: "first",
                },
                "second body uuid": {
                    kind: BodyKind.NO,
                    uuid: "second body uuid",
                    node: "second",
                },
                "third body uuid": {
                    kind: BodyKind.NO,
                    uuid: "third body uuid",
                    node: "third",
                },
            },
        },
        nodeOrder: ["first", "second", "third"],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.NODE,
            node: "first",
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        camera: identity(),
        operations: {},
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 0,
        },
        zoomCamera: { in: false, out: false, now: 0 },
        theme,
    }
    const dispatch = async () => {}
    const actual = view(model, dispatch)
    const expected = stack([
        container({
            color: model.theme.background,
            onClick: () => {},
            onDrag: () => {},
        }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(
                    model.theme,
                    "first",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
                nodeUi(
                    model.theme,
                    "second",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
                nodeUi(
                    model.theme,
                    "third",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
            ],
            connections: [],
        }),
        contextMenu({
            items: [
                {
                    name: "Change Node",
                    shortcut: "c",
                    onClick: () => {},
                },
                {
                    name: "Delete Node",
                    shortcut: "d",
                    onClick: () => {},
                },
            ],
            backgroundColor: model.theme.node,
        }),
    ])
    expect(actual).toEqualData(expected)
})

test("view with three nodes and one edges", () => {
    const model: Model = {
        graph: {
            nodes: {
                first: {
                    kind: NodeKind.TRANSFORM,
                    uuid: "first",
                    name: "first",
                    inputs: [],
                    body: "first body uuid",
                    outputs: ["output uuid"],
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
                second: {
                    kind: NodeKind.TRANSFORM,
                    uuid: "second",
                    name: "second",
                    inputs: ["input uuid"],
                    body: "second body uuid",
                    outputs: [],
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
                third: {
                    kind: NodeKind.TRANSFORM,
                    uuid: "third",
                    name: "third",
                    inputs: [],
                    body: "third body uuid",
                    outputs: [],
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
            },
            edges: {
                "edge uuid": {
                    uuid: "edge uuid",
                    input: "input uuid",
                    output: "output uuid",
                },
            },
            inputs: {
                "input uuid": {
                    uuid: "input uuid",
                    node: "second",
                    name: "in",
                    edge: "edge uuid",
                },
            },
            outputs: {
                "output uuid": {
                    uuid: "output uuid",
                    node: "first",
                    name: "out",
                    edges: ["edge uuid"],
                },
            },
            bodys: {
                "first body uuid": {
                    kind: BodyKind.NO,
                    uuid: "first body uuid",
                    node: "first",
                },
                "second body uuid": {
                    kind: BodyKind.NO,
                    uuid: "second body uuid",
                    node: "second",
                },
                "third body uuid": {
                    kind: BodyKind.NO,
                    uuid: "third body uuid",
                    node: "third",
                },
            },
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
        camera: identity(),
        operations: {},
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 0,
        },
        zoomCamera: { in: false, out: false, now: 0 },
        theme,
    }
    const dispatch = async () => {}
    const actual = view(model, dispatch)
    const expected = stack([
        container({
            color: model.theme.background,
            onClick: () => {},
            onDrag: () => {},
        }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(
                    model.theme,
                    "first",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
                nodeUi(
                    model.theme,
                    "second",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
                nodeUi(
                    model.theme,
                    "third",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
            ],
            connections: [
                {
                    from: "output uuid",
                    to: "input uuid",
                    color: theme.connection,
                },
            ],
        }),
        contextMenu({
            items: [
                {
                    name: "Reset Zoom",
                    shortcut: "z",
                    onClick: () => {},
                },
            ],
            backgroundColor: model.theme.node,
        }),
    ])
    expect(actual).toEqualData(expected)
})

test("view with body selected", () => {
    const model: Model = {
        graph: {
            nodes: {
                number: {
                    kind: NodeKind.SOURCE,
                    uuid: "number",
                    name: "number",
                    body: "body",
                    outputs: ["out"],
                    position: { x: 0, y: 0 },
                },
            },
            edges: {},
            inputs: {},
            outputs: {
                out: {
                    uuid: "out",
                    name: "out",
                    edges: [],
                    node: "number",
                },
            },
            bodys: {
                body: {
                    kind: BodyKind.NUMBER,
                    uuid: "body",
                    node: "number",
                    value: 0,
                    text: "",
                },
            },
        },
        nodeOrder: ["number"],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: false },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.BODY_NUMBER,
            body: "body",
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        camera: identity(),
        operations: {},
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 0,
        },
        zoomCamera: { in: false, out: false, now: 0 },
        theme,
    }
    const dispatch = async () => {}
    const actual = view(model, dispatch)
    const expected = stack([
        container({
            color: model.theme.background,
            onClick: () => {},
            onDrag: () => {},
        }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(
                    model.theme,
                    "number",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
            ],
            connections: [],
        }),
        numericVirtualKeyboard.view({
            color: model.theme.node,
            positive: true,
            onClick: () => {},
        }),
    ])
    expect(actual).toEqualData(expected)
})

test("view with input selected", () => {
    const model: Model = {
        graph: {
            nodes: {
                add: {
                    kind: NodeKind.TRANSFORM,
                    uuid: "add",
                    name: "add",
                    inputs: ["x0", "y0"],
                    body: "add body uuid",
                    outputs: ["out0"],
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
                sub: {
                    kind: NodeKind.TRANSFORM,
                    uuid: "sub",
                    name: "sub",
                    inputs: ["x1", "y1"],
                    body: "sub body uuid",
                    outputs: ["out1"],
                    position: { x: 0, y: 0 },
                    func: subFunc,
                },
            },
            edges: {
                edge: {
                    uuid: "edge",
                    input: "x1",
                    output: "out0",
                },
            },
            inputs: {
                x0: {
                    uuid: "x0",
                    name: "x",
                    node: "add",
                },
                y0: {
                    uuid: "y0",
                    name: "y",
                    node: "add",
                },
                x1: {
                    uuid: "x1",
                    name: "x",
                    node: "sub",
                    edge: "edge",
                },
                y1: {
                    uuid: "y1",
                    name: "y",
                    node: "sub",
                },
            },
            outputs: {
                out0: {
                    uuid: "out0",
                    name: "out",
                    edges: ["edge"],
                    node: "add",
                },
                out1: {
                    uuid: "out1",
                    name: "out",
                    edges: [],
                    node: "sub",
                },
            },
            bodys: {
                "add body uuid": {
                    kind: BodyKind.NO,
                    uuid: "add body uuid",
                    node: "add",
                },
                "sub body uuid": {
                    kind: BodyKind.NO,
                    uuid: "sub body uuid",
                    node: "sub",
                },
            },
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
        camera: identity(),
        operations: {},
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 0,
        },
        zoomCamera: { in: false, out: false, now: 0 },
        theme,
    }
    const dispatch = async () => {}
    const actual = view(model, dispatch)
    const expected = stack([
        container({
            color: model.theme.background,
            onClick: () => {},
            onDrag: () => {},
        }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(
                    model.theme,
                    "add",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
                nodeUi(
                    model.theme,
                    "sub",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
            ],
            connections: [
                {
                    from: "out0",
                    to: "x1",
                    color: { red: 255, green: 255, blue: 255, alpha: 255 },
                },
            ],
        }),
        contextMenu({
            items: [
                {
                    name: "Delete Edge",
                    shortcut: "d",
                    onClick: () => {},
                },
            ],
            backgroundColor: theme.node,
        }),
    ])
    expect(actual).toEqualData(expected)
})

test("view with output selected", () => {
    const model: Model = {
        graph: {
            nodes: {
                add: {
                    kind: NodeKind.TRANSFORM,
                    uuid: "add",
                    name: "add",
                    inputs: ["x0", "y0"],
                    body: "add body uuid",
                    outputs: ["out0"],
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
                sub: {
                    kind: NodeKind.TRANSFORM,
                    uuid: "sub",
                    name: "sub",
                    inputs: ["x1", "y1"],
                    body: "sub body uuid",
                    outputs: ["out1"],
                    position: { x: 0, y: 0 },
                    func: subFunc,
                },
            },
            edges: {
                edge: {
                    uuid: "edge",
                    input: "x1",
                    output: "out0",
                },
            },
            inputs: {
                x0: {
                    uuid: "x0",
                    name: "x",
                    node: "add",
                },
                y0: {
                    uuid: "y0",
                    name: "y",
                    node: "add",
                },
                x1: {
                    uuid: "x1",
                    name: "x",
                    node: "sub",
                    edge: "edge",
                },
                y1: {
                    uuid: "y1",
                    name: "y",
                    node: "sub",
                },
            },
            outputs: {
                out0: {
                    uuid: "out0",
                    name: "out",
                    edges: ["edge"],
                    node: "add",
                },
                out1: {
                    uuid: "out1",
                    name: "out",
                    edges: [],
                    node: "sub",
                },
            },
            bodys: {
                "add body uuid": {
                    kind: BodyKind.NO,
                    uuid: "add body uuid",
                    node: "add",
                },
                "sub body uuid": {
                    kind: BodyKind.NO,
                    uuid: "sub body uuid",
                    node: "sub",
                },
            },
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
        camera: identity(),
        operations: {},
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 0,
        },
        zoomCamera: { in: false, out: false, now: 0 },
        theme,
    }
    const dispatch = async () => {}
    const actual = view(model, dispatch)
    const expected = stack([
        container({
            color: model.theme.background,
            onClick: () => {},
            onDrag: () => {},
        }),
        scene({
            camera: model.camera,
            children: [
                nodeUi(
                    model.theme,
                    "add",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
                nodeUi(
                    model.theme,
                    "sub",
                    model.graph,
                    model.focus,
                    () => {},
                    () => {},
                    () => {},
                    () => {},
                    () => {}
                ),
            ],
            connections: [
                {
                    from: "out0",
                    to: "x1",
                    color: { red: 255, green: 255, blue: 255, alpha: 255 },
                },
            ],
        }),
        contextMenu({
            items: [
                {
                    name: "Delete Edge",
                    shortcut: "d",
                    onClick: () => {},
                },
            ],
            backgroundColor: theme.node,
        }),
    ])
    expect(actual).toEqualData(expected)
})

test("view with node placement location shown", () => {
    const model: Model = {
        graph: {
            nodes: {},
            edges: {},
            inputs: {},
            outputs: {},
            bodys: {},
        },
        nodeOrder: [],
        pointers: [],
        nodePlacementLocation: { x: 250, y: 250, show: true },
        window: { width: 500, height: 500 },
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.NONE },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        camera: identity(),
        operations: {},
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 0,
        },
        zoomCamera: { in: false, out: false, now: 0 },
        theme,
    }
    const dispatch = async () => {}
    const actual = view(model, dispatch)
    const expected = stack([
        container({
            color: model.theme.background,
            onClick: () => {},
            onDrag: () => {},
        }),
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
                }),
            ],
            connections: [],
        }),
        contextMenu({
            items: [
                {
                    name: "Reset Zoom",
                    shortcut: "z",
                    onClick: () => {},
                },
            ],
            backgroundColor: model.theme.node,
        }),
    ])
    expect(actual).toEqualData(expected)
})

test("textBody not focused", () => {
    const body: Body = {
        kind: BodyKind.TEXT,
        uuid: "body uuid",
        node: "node",
        value: "hello",
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClick = () => {}
    const actual = textBody(theme, body, focus, onClick)
    const expected = container(
        {
            color: theme.background,
            padding: 5,
            onClick,
        },
        text(body.value.toString())
    )
    expect(actual).toEqualData(expected)
})

test("textBody focused", () => {
    const body: Body = {
        kind: BodyKind.TEXT,
        uuid: "body uuid",
        node: "node",
        value: "hello",
    }
    const focus: Focus = {
        kind: FocusKind.BODY_NUMBER,
        body: "body uuid",
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClick = () => {}
    const actual = textBody(theme, body, focus, onClick)
    const expected = container(
        {
            color: theme.focusInput,
            padding: 5,
            onClick,
        },
        text(body.value.toString())
    )
    expect(actual).toEqualData(expected)
})

test("textBody quick select", () => {
    const body: Body = {
        kind: BodyKind.TEXT,
        uuid: "body uuid",
        node: "node",
        value: "hello",
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: {
            kind: QuickSelectKind.BODY,
            hotkeys: { "body uuid": "a" },
        },
    }
    const onClick = () => {}
    const actual = textBody(theme, body, focus, onClick)
    const expected = container(
        {
            color: theme.background,
            padding: 5,
            onClick,
        },
        text("a")
    )
    expect(actual).toEqualData(expected)
})

test("tableBody", () => {
    const body: Body = {
        kind: BodyKind.TABLE,
        uuid: "body uuid",
        node: "node",
        value: {
            name: "table.csv",
            columns: {
                a: [1, 2, 3],
                b: [4, 5, undefined],
            },
        },
    }
    const actual = tableBody(theme, body)
    const expected = column([
        container({ padding: 5 }, text("2 columns 3 rows")),
        container(
            { color: theme.background },
            row([
                container(
                    { padding: 5 },
                    column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                        container({ padding: 5 }, text("a")),
                        container({ padding: 5 }, text("1")),
                        container({ padding: 5 }, text("2")),
                        container({ padding: 5 }, text("3")),
                    ])
                ),
                container(
                    { padding: 5 },
                    column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                        container({ padding: 5 }, text("b")),
                        container({ padding: 5 }, text("4")),
                        container({ padding: 5 }, text("5")),
                        container({ padding: 5 }, text("NULL")),
                    ])
                ),
            ])
        ),
    ])
    expect(actual).toEqualData(expected)
})

test("columnBody", () => {
    const body: Body = {
        kind: BodyKind.COLUMN,
        uuid: "body uuid",
        node: "node",
        name: "a",
        value: [1, 2, undefined],
    }
    const actual = columnBody(theme, body)
    const expected = column([
        container({ padding: 5 }, text("3 rows")),
        container(
            { color: theme.background },
            column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                container({ padding: 5 }, text("1")),
                container({ padding: 5 }, text("2")),
                container({ padding: 5 }, text("NULL")),
            ])
        ),
    ])
    expect(actual).toEqualData(expected)
})

test("nodeUi with text body", () => {
    const node: Node = {
        kind: NodeKind.SOURCE,
        uuid: "node uuid",
        name: "node",
        position: { x: 0, y: 0 },
        body: "body uuid",
        outputs: ["output uuid"],
    }
    const body: Body = {
        kind: BodyKind.TEXT,
        uuid: "body uuid",
        node: "node",
        value: "hello",
    }
    const output: Output = {
        uuid: "output uuid",
        node: "node uuid",
        name: "first",
        edges: [],
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        bodys: { [body.uuid]: body },
        outputs: { [output.uuid]: output },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                textBody(theme, body, focus, onClickBody),
                spacer(15),
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("nodeUi with table body", () => {
    const node: Node = {
        kind: NodeKind.SOURCE,
        uuid: "node uuid",
        name: "node",
        position: { x: 0, y: 0 },
        body: "body uuid",
        outputs: ["output uuid"],
    }
    const body: Body = {
        kind: BodyKind.TABLE,
        uuid: "body uuid",
        node: "node",
        value: {
            name: "table.csv",
            columns: {
                a: [1, 2, 3],
                b: [1, 2, undefined],
            },
        },
    }
    const output: Output = {
        uuid: "output uuid",
        node: "node uuid",
        name: "first",
        edges: [],
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        bodys: { [body.uuid]: body },
        outputs: { [output.uuid]: output },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                tableBody(theme, body),
                spacer(15),
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("nodeUi with column body", () => {
    const node: Node = {
        kind: NodeKind.SOURCE,
        uuid: "node uuid",
        name: "node",
        position: { x: 0, y: 0 },
        body: "body uuid",
        outputs: ["output uuid"],
    }
    const body: Body = {
        kind: BodyKind.COLUMN,
        uuid: "body uuid",
        node: "node",
        name: "a",
        value: [1, 2, 3],
    }
    const output: Output = {
        uuid: "output uuid",
        node: "node uuid",
        name: "first",
        edges: [],
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        bodys: { [body.uuid]: body },
        outputs: { [output.uuid]: output },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                columnBody(theme, body),
                spacer(15),
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("nodeUi with tensor body", () => {
    const node: Node = {
        kind: NodeKind.SOURCE,
        uuid: "node uuid",
        name: "node",
        position: { x: 0, y: 0 },
        body: "body uuid",
        outputs: ["output uuid"],
    }
    const body: Body = {
        kind: BodyKind.TENSOR,
        uuid: "body uuid",
        node: "node",
        value: [1, 2, 3],
        shape: [3],
        rank: 1,
    }
    const output: Output = {
        uuid: "output uuid",
        node: "node uuid",
        name: "first",
        edges: [],
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        bodys: { [body.uuid]: body },
        outputs: { [output.uuid]: output },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                tensorBody(theme, body),
                spacer(15),
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("nodeUi with scatter body", () => {
    const node: Node = {
        kind: NodeKind.SOURCE,
        uuid: "node uuid",
        name: "node",
        position: { x: 0, y: 0 },
        body: "body uuid",
        outputs: ["output uuid"],
    }
    const body: Body = {
        kind: BodyKind.SCATTER,
        uuid: "body uuid",
        node: "node",
        x: [1, 2, 3],
        y: [4, 8, 12],
    }
    const output: Output = {
        uuid: "output uuid",
        node: "node uuid",
        name: "first",
        edges: [],
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        bodys: { [body.uuid]: body },
        outputs: { [output.uuid]: output },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                scatterBody(theme, body),
                spacer(15),
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("nodeUi with error body", () => {
    const node: Node = {
        kind: NodeKind.SOURCE,
        uuid: "node uuid",
        name: "node",
        position: { x: 0, y: 0 },
        body: "body uuid",
        outputs: ["output uuid"],
    }
    const body: Body = {
        kind: BodyKind.ERROR,
        uuid: "body uuid",
        node: "node",
    }
    const output: Output = {
        uuid: "output uuid",
        node: "node uuid",
        name: "first",
        edges: [],
    }
    const graph: Graph = {
        ...emptyGraph(),
        nodes: { [node.uuid]: node },
        bodys: { [body.uuid]: body },
        outputs: { [output.uuid]: output },
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    }
    const onClickInput = () => {}
    const onClickBody = () => {}
    const onClickOutput = () => {}
    const onClickNode = () => {}
    const onDragNode = () => {}
    const actual = nodeUi(
        theme,
        node.uuid,
        graph,
        focus,
        onClickInput,
        onClickBody,
        onClickOutput,
        onClickNode,
        onDragNode
    )
    const expected = container(
        {
            color: theme.error,
            padding: 4,
            x: 0,
            y: 0,
            onClick: onClickNode,
            onDrag: onDragNode,
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus,
                    onClickOutput
                ),
            ]),
        ])
    )
    expect(actual).toEqualData(expected)
})

test("format cell", () => {
    expect(formatCell("hello")).toEqual("hello")
    expect(formatCell(10)).toEqual("10")
    expect(formatCell(3.12)).toEqual("3.12")
    expect(formatCell(3.124)).toEqual("3.12")
})
