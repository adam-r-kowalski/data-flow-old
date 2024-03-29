import { CrossAxisAlignment } from "../ui/alignment"
import { Model } from "../model"
import { Theme } from "../model/theme"
import { Focus, FocusKind } from "../model/focus"
import {
    text,
    stack,
    scene,
    row,
    container,
    column,
    Connection,
    UI,
    Pointer,
    PointerDrag,
} from "../ui"
import {
    BodyKind,
    ColumnBody,
    Graph,
    Input,
    NodeKind,
    NumberBody,
    Output,
    ScatterBody,
    TableBody,
    TensorBody,
    TextBody,
    UUID,
} from "../model/graph"
import { contextMenu } from "./context_menu"
import { QuickSelectKind } from "../model/quick_select"
import { identity } from "../linear_algebra/matrix3x3"
import * as alphabeticVirtualKeyboard from "../alphabetic_virtual_keyboard"
import * as numericVirtualKeyboard from "../numeric_virtual_keyboard"
import * as finder from "../finder"
import * as background from "../background"
import { Dispatch } from "../run"
import { AppEvent, EventKind } from "../event"

export const spacer = (size: number): UI =>
    container({ width: size, height: size })

export const intersperse = <T>(array: T[], seperator: T): T[] => {
    const result = [array[0]]
    for (const element of array.slice(1)) {
        result.push(seperator, element)
    }
    return result
}

export const isFocused = (focus: Focus, uuid: UUID): boolean => {
    switch (focus.kind) {
        case FocusKind.BODY_NUMBER:
        case FocusKind.BODY_TEXT:
            return focus.body === uuid
        case FocusKind.INPUT:
            return focus.input === uuid
        case FocusKind.NODE:
            return focus.node === uuid
        case FocusKind.OUTPUT:
            return focus.output === uuid
        default:
            return false
    }
}

export const inputUi = (
    theme: Theme,
    { name, uuid }: Input,
    focus: Focus,
    onClick: (uuid: UUID) => void
): UI =>
    container(
        { onClick: () => onClick(uuid) },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container(
                {
                    id: uuid,
                    color: isFocused(focus, uuid)
                        ? theme.focusInput
                        : theme.input,
                    padding: { top: 2, right: 4, bottom: 2, left: 4 },
                },
                text(
                    { color: theme.background },
                    focus.quickSelect.kind === QuickSelectKind.INPUT
                        ? focus.quickSelect.hotkeys[uuid]
                        : " "
                )
            ),
            spacer(4),
            text(name),
        ])
    )

export const inputsUi = (
    theme: Theme,
    inputs: Input[],
    focus: Focus,
    onClick: (uuid: UUID) => void
): UI =>
    column(
        intersperse(
            inputs.map((input) => inputUi(theme, input, focus, onClick)),
            spacer(4)
        )
    )

export const outputUi = (
    theme: Theme,
    { name, uuid }: Output,
    focus: Focus,
    onClick: (uuid: UUID) => void
): UI => {
    const value =
        focus.quickSelect.kind === QuickSelectKind.OUTPUT
            ? focus.quickSelect.hotkeys[uuid]
            : " "
    return container(
        { onClick: () => onClick(uuid) },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text(name),
            spacer(4),
            container(
                {
                    id: uuid,
                    color: isFocused(focus, uuid)
                        ? theme.focusInput
                        : theme.input,
                    padding: { top: 2, right: 4, bottom: 2, left: 4 },
                },
                text({ color: theme.background }, value)
            ),
        ])
    )
}

export const outputsUi = (
    theme: Theme,
    outputs: Output[],
    focus: Focus,
    onClick: (uuid: UUID) => void
): UI =>
    column(
        intersperse(
            outputs.map((output) => outputUi(theme, output, focus, onClick)),
            spacer(4)
        )
    )

export const numberBody = (
    theme: Theme,
    body: NumberBody,
    focus: Focus,
    onClick: (uuid: UUID) => void
): UI => {
    const value =
        focus.quickSelect.kind === QuickSelectKind.BODY
            ? focus.quickSelect.hotkeys[body.uuid]
            : body.text
    return container(
        {
            color: isFocused(focus, body.uuid)
                ? theme.focusInput
                : theme.background,
            padding: 5,
            onClick: () => onClick(body.uuid),
        },
        text(value)
    )
}

export const textBody = (
    theme: Theme,
    body: TextBody,
    focus: Focus,
    onClick: (uuid: UUID) => void
): UI => {
    const value =
        focus.quickSelect.kind === QuickSelectKind.BODY
            ? focus.quickSelect.hotkeys[body.uuid]
            : body.value
    return container(
        {
            color: isFocused(focus, body.uuid)
                ? theme.focusInput
                : theme.background,
            padding: 5,
            onClick: () => onClick(body.uuid),
        },
        text(value)
    )
}

export const tableBody = (theme: Theme, body: TableBody): UI => {
    const keys = Object.keys(body.value.columns)
    const columns = keys.length
    const rows = body.value.columns[keys[0]].length
    return column([
        container({ padding: 5 }, text(`${columns} columns ${rows} rows`)),
        container(
            { color: theme.background },
            row(
                Object.entries(body.value.columns).map(([name, data]) =>
                    container(
                        { padding: 5 },
                        column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                            container({ padding: 5 }, text(name)),
                            ...data
                                .slice(0, 10)
                                .map((value) =>
                                    container(
                                        { padding: 5 },
                                        text(
                                            value === undefined
                                                ? "NULL"
                                                : value.toString()
                                        )
                                    )
                                ),
                        ])
                    )
                )
            )
        ),
    ])
}

export const columnBody = (theme: Theme, body: ColumnBody): UI => {
    const rows = body.value.length
    return column([
        container({ padding: 5 }, text(`${rows} rows`)),
        container(
            { color: theme.background },
            column(
                { crossAxisAlignment: CrossAxisAlignment.END },
                body.value
                    .slice(0, 10)
                    .map((value) =>
                        container(
                            { padding: 5 },
                            text(
                                value === undefined ? "NULL" : value.toString()
                            )
                        )
                    )
            )
        ),
    ])
}

export const formatCell = (value: number | string): string => {
    switch (typeof value) {
        case "string":
            return value
        case "number":
            return Number.isInteger(value) ? value.toString() : value.toFixed(2)
    }
}

export const tensorBody = (theme: Theme, body: TensorBody): UI => {
    switch (body.rank) {
        case 0: {
            const value = formatCell(body.value as number | string)
            return container(
                {
                    color: theme.background,
                    padding: 5,
                },
                text(value)
            )
        }
        case 1: {
            const data = body.value as number[]
            const rows = data.length
            return column([
                container({ padding: 5 }, text(`${rows} rows`)),
                container(
                    { color: theme.background },
                    column(
                        { crossAxisAlignment: CrossAxisAlignment.END },
                        data
                            .slice(0, 10)
                            .map((value) =>
                                container(
                                    { padding: 5 },
                                    text(formatCell(value))
                                )
                            )
                    )
                ),
            ])
        }
        case 2: {
            const data = body.value as number[][]
            const rows = data.length
            const columns = data[0].length
            return column([
                container(
                    { padding: 5 },
                    text(`${columns} columns ${rows} rows`)
                ),
                container(
                    { color: theme.background },
                    row(
                        data[0].map((_, i) =>
                            container(
                                { padding: 5 },
                                column(
                                    {
                                        crossAxisAlignment:
                                            CrossAxisAlignment.END,
                                    },
                                    data
                                        .slice(0, 10)
                                        .map((row) =>
                                            container(
                                                { padding: 5 },
                                                text(formatCell(row[i]))
                                            )
                                        )
                                )
                            )
                        )
                    )
                ),
            ])
        }
        default: {
            return text("no view for this rank yet")
        }
    }
}

export const scatterBody = (theme: Theme, body: ScatterBody): UI => {
    return container(
        { width: 300, height: 300, color: theme.background },
        stack(
            body.x.map((x, i) =>
                container({
                    x: x,
                    y: 290 - body.y[i],
                    width: 10,
                    height: 10,
                    color: theme.focusInput,
                })
            )
        )
    )
}

export const nodeUi = (
    theme: Theme,
    nodeUUID: UUID,
    graph: Graph,
    focus: Focus,
    onClickInput: (uuid: UUID) => void,
    onClickBody: (uuid: UUID) => void,
    onClickOutput: (uuid: UUID) => void,
    onClickNode: (uuid: UUID) => void,
    onDragNode: (uuid: UUID, drag: PointerDrag) => void
) => {
    const node = graph.nodes[nodeUUID]
    const rowEntries: UI[] = []
    if (node.kind === NodeKind.TRANSFORM) {
        rowEntries.push(
            inputsUi(
                theme,
                node.inputs.map((i) => graph.inputs[i]),
                focus,
                onClickInput
            )
        )
        rowEntries.push(spacer(15))
    }
    const body = graph.bodys[node.body]
    switch (body.kind) {
        case BodyKind.NUMBER:
            rowEntries.push(
                numberBody(theme, body, focus, onClickBody),
                spacer(15)
            )
            break
        case BodyKind.TEXT:
            rowEntries.push(
                textBody(theme, body, focus, onClickBody),
                spacer(15)
            )
            break
        case BodyKind.TABLE:
            rowEntries.push(tableBody(theme, body), spacer(15))
            break
        case BodyKind.COLUMN:
            rowEntries.push(columnBody(theme, body), spacer(15))
            break
        case BodyKind.TENSOR:
            rowEntries.push(tensorBody(theme, body), spacer(15))
            break
        case BodyKind.SCATTER:
            rowEntries.push(scatterBody(theme, body), spacer(15))
            break
        default:
            break
    }
    rowEntries.push(
        outputsUi(
            theme,
            node.outputs.map((o) => graph.outputs[o]),
            focus,
            onClickOutput
        )
    )
    const name =
        focus.quickSelect.kind === QuickSelectKind.NODE
            ? focus.quickSelect.hotkeys[node.uuid]
            : node.name
    const color = (() => {
        if (isFocused(focus, node.uuid)) return theme.focusNode
        else if (body.kind === BodyKind.ERROR) return theme.error
        else return theme.node
    })()
    return container(
        {
            color,
            padding: 4,
            x: node.position.x,
            y: node.position.y,
            onClick: () => onClickNode(node.uuid),
            onDrag: (event) => onDragNode(node.uuid, event),
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text(name),
            spacer(4),
            row(rowEntries),
        ])
    )
}

const identityCamera = identity()

export const view = (model: Model, dispatch: Dispatch<AppEvent>): UI => {
    const onClickInput = (input: UUID) =>
        dispatch({
            kind: EventKind.CLICKED_INPUT,
            input,
        })
    const onClickBody = (body: UUID) =>
        dispatch({
            kind: EventKind.CLICKED_BODY,
            body,
        })
    const onClickOutput = (output: UUID) =>
        dispatch({
            kind: EventKind.CLICKED_OUTPUT,
            output,
        })
    const onClickNode = (node: UUID) =>
        dispatch({
            kind: EventKind.CLICKED_NODE,
            node,
        })
    const onDragNode = (node: UUID, { x, y }: PointerDrag) =>
        dispatch({
            kind: EventKind.DRAGGED_NODE,
            node,
            x,
            y,
        })
    const onClickBackground = ({ count, position }: Pointer) =>
        dispatch({ kind: EventKind.CLICKED_BACKGROUND, count, position })
    const onDragBackground = ({ x, y }: PointerDrag) =>
        dispatch({ kind: EventKind.DRAGGED_BACKGROUND, x, y })
    const onFinderInsert = (option: string) =>
        dispatch({ kind: EventKind.FINDER_INSERT, option })
    const onFinderChange = (option: string, node: UUID) =>
        dispatch({ kind: EventKind.FINDER_CHANGE, option, node })
    const onKeyDown = (key: string) =>
        dispatch({ kind: EventKind.KEYDOWN, key })
    const onChangeNode = (node: UUID) =>
        dispatch({ kind: EventKind.CHANGE_NODE, node })
    const onDeleteNode = (node: UUID) =>
        dispatch({ kind: EventKind.CHANGE_NODE, node })
    const onDeleteInputEdge = (input: UUID) =>
        dispatch({ kind: EventKind.DELETE_INPUT_EDGE, input })
    const onDeleteOutputEdges = (output: UUID) =>
        dispatch({ kind: EventKind.DELETE_OUTPUT_EDGES, output })
    const onResetCamera = () => dispatch({ kind: EventKind.RESET_CAMERA })
    const nodes = model.nodeOrder.map((node) =>
        nodeUi(
            model.theme,
            node,
            model.graph,
            model.focus,
            onClickInput,
            onClickBody,
            onClickOutput,
            onClickNode,
            onDragNode
        )
    )
    const connections: Connection[] = Object.values(model.graph.edges).map(
        ({ input, output }) => ({
            from: output,
            to: input,
            color: model.theme.connection,
        })
    )
    const stacked: UI[] = [
        background.view({
            color: model.theme.background,
            onClick: onClickBackground,
            onDrag: onDragBackground,
        }),
        scene({ camera: model.camera, children: nodes, connections }),
    ]
    if (model.nodePlacementLocation.show) {
        stacked.push(
            scene({
                camera: identityCamera,
                children: [
                    container({
                        color: model.theme.nodePlacementLocation,
                        width: 10,
                        height: 10,
                        x: model.nodePlacementLocation.x,
                        y: model.nodePlacementLocation.y,
                    }),
                ],
                connections: [],
            })
        )
    }
    const focus = model.focus
    switch (focus.kind) {
        case FocusKind.FINDER_INSERT: {
            stacked.push(
                finder.view({
                    model: focus.finder,
                    theme: model.theme.finder,
                    onClick: onFinderInsert,
                }),
                alphabeticVirtualKeyboard.view({
                    color: model.theme.node,
                    uppercase: focus.uppercase,
                    onClick: onKeyDown,
                })
            )
            break
        }
        case FocusKind.FINDER_CHANGE: {
            stacked.push(
                finder.view({
                    model: focus.finder,
                    theme: model.theme.finder,
                    onClick: (option) => onFinderChange(option, focus.node),
                }),
                alphabeticVirtualKeyboard.view({
                    color: model.theme.node,
                    uppercase: focus.uppercase,
                    onClick: onKeyDown,
                })
            )
            break
        }
        case FocusKind.BODY_NUMBER: {
            const body = model.graph.bodys[focus.body] as NumberBody
            stacked.push(
                numericVirtualKeyboard.view({
                    color: model.theme.node,
                    positive: body.value >= 0,
                    onClick: onKeyDown,
                })
            )
            break
        }
        case FocusKind.BODY_TEXT: {
            stacked.push(
                alphabeticVirtualKeyboard.view({
                    color: model.theme.node,
                    uppercase: focus.uppercase,
                    onClick: onKeyDown,
                })
            )
            break
        }
        case FocusKind.NODE:
            stacked.push(
                contextMenu({
                    items: [
                        {
                            name: "Change Node",
                            shortcut: "c",
                            onClick: () => onChangeNode(focus.node),
                        },
                        {
                            name: "Delete Node",
                            shortcut: "d",
                            onClick: () => onDeleteNode(focus.node),
                        },
                    ],
                    backgroundColor: model.theme.node,
                })
            )
            break
        case FocusKind.INPUT:
            if (model.graph.inputs[focus.input].edge) {
                stacked.push(
                    contextMenu({
                        items: [
                            {
                                name: "Delete Edge",
                                shortcut: "d",
                                onClick: () => onDeleteInputEdge(focus.input),
                            },
                        ],
                        backgroundColor: model.theme.node,
                    })
                )
            }
            break
        case FocusKind.OUTPUT:
            if (model.graph.outputs[focus.output].edges.length > 0) {
                stacked.push(
                    contextMenu({
                        items: [
                            {
                                name: "Delete Edge",
                                shortcut: "d",
                                onClick: () =>
                                    onDeleteOutputEdges(focus.output),
                            },
                        ],
                        backgroundColor: model.theme.node,
                    })
                )
            }
            break
        case FocusKind.NONE:
            stacked.push(
                contextMenu({
                    items: [
                        {
                            name: "Reset Zoom",
                            shortcut: "z",
                            onClick: onResetCamera,
                        },
                    ],
                    backgroundColor: model.theme.node,
                })
            )
    }
    return stack(stacked)
}
