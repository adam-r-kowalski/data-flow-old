import { AppEvent, EventKind } from "../../../src/event"
import { Input, Output, Theme, Body, Node } from "../../../src/state"
import { column, container, row, text } from "../../../src/ui"
import { CrossAxisAlignment } from "../../../src/ui/alignment"
import { inputsUi, inputUi, intersperse, nodeUi, numberUi, outputsUi, outputUi, spacer } from "../../../src/ui/view"

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
    const nodeIndex = 0
    const inputIndex = 1
    const actual = inputUi(theme, input, nodeIndex, inputIndex)
    const expected = container<AppEvent>({
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
    const nodeIndex = 0
    const inputIndex = 1
    const actual = inputUi(theme, input, nodeIndex, inputIndex)
    const expected = container<AppEvent>({
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
    const nodeIndex = 0
    const actual = inputsUi(theme, inputs, nodeIndex)
    const expected = column([
        inputUi(theme, inputs[0], nodeIndex, 0),
        spacer(4),
        inputUi(theme, inputs[1], nodeIndex, 1),
        spacer(4),
        inputUi(theme, inputs[2], nodeIndex, 2),
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
    const nodeIndex = 0
    const outputIndex = 1
    const actual = outputUi(theme, output, nodeIndex, outputIndex)
    const expected = container<AppEvent>({
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
    const nodeIndex = 0
    const outputIndex = 1
    const actual = outputUi(theme, output, nodeIndex, outputIndex)
    const expected = container<AppEvent>({
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
    const nodeIndex = 0
    const actual = outputsUi(theme, outputs, nodeIndex)
    const expected = column([
        outputUi(theme, outputs[0], nodeIndex, 0),
        spacer(4),
        outputUi(theme, outputs[1], nodeIndex, 1),
        spacer(4),
        outputUi(theme, outputs[2], nodeIndex, 2),
    ])
    expect(actual).toEqual(expected)
})

test("numberUi not editing", () => {
    const body: Body = {
        value: 0,
        editing: false
    }
    const nodeIndex = 0
    const actual = numberUi(theme, body, nodeIndex)
    const expected = container({
        color: theme.background,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_NUMBER,
            nodeIndex
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
    const nodeIndex = 0
    const actual = numberUi(theme, body, nodeIndex)
    const expected = container({
        color: theme.selectedInput,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_NUMBER,
            nodeIndex
        }
    },
        text(body.value.toString()))
    expect(actual).toEqual(expected)
})

test("nodeUi no inputs body or outputs", () => {
    const node: Node = {
        name: "node",
        x: 0,
        y: 0,
        inputs: [],
        outputs: [],
    }
    const index = 0
    const actual = nodeUi(theme, node, index)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                index: index
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
    const index = 0
    const actual = nodeUi(theme, node, index)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                index: index
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([inputsUi(theme, node.inputs, index)])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi 1 output, no body and no inputs", () => {
    const node: Node = {
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
    const index = 0
    const actual = nodeUi(theme, node, index)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                index: index
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([outputsUi(theme, node.outputs, index)])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi no inputs or outputs but body defined", () => {
    const node: Node = {
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
    const index = 0
    const actual = nodeUi(theme, node, index)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                index: index
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([numberUi(theme, node.body!, index), spacer(15)])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi 1 input and 1 output but no body", () => {
    const node: Node = {
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
    const index = 0
    const actual = nodeUi(theme, node, index)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                index: index
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(theme, node.inputs, index),
                spacer(15),
                outputsUi(theme, node.outputs, index)
            ])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi 1 input body but no outputs", () => {
    const node: Node = {
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
    const index = 0
    const actual = nodeUi(theme, node, index)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                index: index
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(theme, node.inputs, index),
                numberUi(theme, node.body!, index),
                spacer(15),
            ])
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi 1 output body but no inputs", () => {
    const node: Node = {
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
    const index = 0
    const actual = nodeUi(theme, node, index)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                index: index
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                numberUi(theme, node.body!, index),
                spacer(15),
                outputsUi(theme, node.outputs, index),
            ])
        ])
    )
    expect(actual).toEqual(expected)
})


test("nodeUi 1 input body and 1 output", () => {
    const node: Node = {
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
    const index = 0
    const actual = nodeUi(theme, node, index)
    const expected = container<AppEvent>(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                index: index
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("node"),
            spacer(4),
            row([
                inputsUi(theme, node.outputs, index),
                spacer(15),
                numberUi(theme, node.body!, index),
                spacer(15),
                outputsUi(theme, node.outputs, index),
            ])
        ])
    )
    expect(actual).toEqual(expected)
})
