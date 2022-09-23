import { EventKind } from "../../src/event"
import { Focus, FocusKind } from "../../src/model/focus"
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
import { PointerActionKind } from "../../src/model/pointer_action"
import { QuickSelectKind } from "../../src/model/quick_select"
import { Theme } from "../../src/model/theme"
import { column, container, row, text } from "../../src/ui"
import { CrossAxisAlignment } from "../../src/ui/alignment"
import {
    inputUi,
    nodeUi,
    numberBody,
    outputsUi,
    outputUi,
    spacer,
} from "../../src/view"

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

test("inputUi with quick select", () => {
    const input: Input = {
        uuid: "uuid",
        node: "node",
        name: "name",
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: {
            kind: QuickSelectKind.INPUT,
            hotkeys: {
                uuid: "a",
            },
        },
    }
    const actual = inputUi(theme, input, focus)
    const expected = container(
        {
            onClick: {
                kind: EventKind.CLICKED_INPUT,
                input: "uuid",
            },
        },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container(
                {
                    id: "uuid",
                    padding: { top: 2, right: 4, bottom: 2, left: 4 },
                    color: theme.input,
                },
                text({ color: theme.background }, "a")
            ),
            spacer(4),
            text("name"),
        ])
    )
    expect(actual).toEqual(expected)
})

test("outputUI with quick select", () => {
    const output: Output = {
        uuid: "uuid",
        node: "node",
        name: "name",
        edges: [],
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: {
            kind: QuickSelectKind.OUTPUT,
            hotkeys: {
                uuid: "a",
            },
        },
    }
    const actual = outputUi(theme, output, focus)
    const expected = container(
        {
            onClick: {
                kind: EventKind.CLICKED_OUTPUT,
                output: "uuid",
            },
        },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("name"),
            spacer(4),
            container(
                {
                    id: "uuid",
                    padding: { top: 2, right: 4, bottom: 2, left: 4 },
                    color: theme.input,
                },
                text({ color: theme.background }, "a")
            ),
        ])
    )
    expect(actual).toEqual(expected)
})

test("nodeUi with quick select", () => {
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
        node: "uuid",
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
        quickSelect: {
            kind: QuickSelectKind.NODE,
            hotkeys: {
                uuid: "a",
            },
        },
    }
    const actual = nodeUi(theme, node.uuid, graph, focus)
    const expected = container(
        {
            color: theme.node,
            padding: 4,
            x: 0,
            y: 0,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                node: "uuid",
            },
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("a"),
            spacer(4),
            row([
                outputsUi(
                    theme,
                    node.outputs.map((o) => graph.outputs[o]),
                    focus
                ),
            ]),
        ])
    )
    expect(actual).toEqual(expected)
})

test("bodyUi quick select", () => {
    const body: Body = {
        kind: BodyKind.NUMBER,
        uuid: "body uuid",
        node: "node",
        value: 0,
        text: "",
    }
    const focus: Focus = {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: {
            kind: QuickSelectKind.BODY,
            hotkeys: { "body uuid": "a" },
        },
    }
    const actual = numberBody(theme, body, focus)
    const expected = container(
        {
            color: theme.background,
            padding: 5,
            onClick: {
                kind: EventKind.CLICKED_BODY,
                body: "body uuid",
            },
        },
        text("a")
    )
    expect(actual).toEqual(expected)
})
