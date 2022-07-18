import { AppEvent, EventKind } from "../../../src/event"
import { Input, Output, Theme } from "../../../src/state"
import { column, container, row, text } from "../../../src/ui"
import { CrossAxisAlignment } from "../../../src/ui/alignment"
import { inputsUi, inputUi, intersperse, outputsUi, outputUi, spacer } from "../../../src/ui/view"

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
