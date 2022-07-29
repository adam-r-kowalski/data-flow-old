import { CrossAxisAlignment, MainAxisAlignment } from "../alignment"
import { AppEvent, EventKind } from "../../event"
import { Focus, FocusFinder, FocusKind, State, Theme } from "../../state"
import { text, stack, scene, row, container, column, Connection, UI } from '..'
import { Body, Graph, Input, Output, UUID } from "../../graph/model"
import { contextMenu } from "./context_menu"


export const spacer = (size: number): UI<AppEvent> =>
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
        case FocusKind.BODY: return focus.body === uuid
        case FocusKind.INPUT: return focus.input === uuid
        case FocusKind.NODE: return focus.node === uuid
        case FocusKind.OUTPUT: return focus.output === uuid
        default: return false
    }
}

export const inputUi = (theme: Theme, { name, uuid }: Input, focus: Focus): UI<AppEvent> =>
    container({
        onClick: {
            kind: EventKind.CLICKED_INPUT,
            input: uuid
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container({
                id: uuid,
                width: 14,
                height: 14,
                color: isFocused(focus, uuid) ? theme.focusInput : theme.input,
            }),
            spacer(4),
            text(name)
        ])
    )


export const inputsUi = (theme: Theme, inputs: Input[], focus: Focus) =>
    column(
        intersperse(
            inputs.map(input => inputUi(theme, input, focus)),
            spacer(4)
        )
    )


export const outputUi = (theme: Theme, { name, uuid }: Output, focus: Focus): UI<AppEvent> =>
    container({
        onClick: {
            kind: EventKind.CLICKED_OUTPUT,
            output: uuid
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text(name),
            spacer(4),
            container({
                id: uuid,
                width: 14,
                height: 14,
                color: isFocused(focus, uuid) ? theme.focusInput : theme.input,
            }),
        ])
    )


export const outputsUi = (theme: Theme, outputs: Output[], focus: Focus) =>
    column(
        intersperse(
            outputs.map(output => outputUi(theme, output, focus)),
            spacer(4)
        )
    )


export const numberUi = (theme: Theme, body: Body, focus: Focus): UI<AppEvent> =>
    container({
        color: isFocused(focus, body.uuid) ? theme.focusInput : theme.background,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_NUMBER,
            body: body.uuid
        }
    },
        text(body.value.toString()))


export const nodeUi = (theme: Theme, nodeUUID: UUID, graph: Graph, focus: Focus): UI<AppEvent> => {
    const node = graph.nodes[nodeUUID]
    const rowEntries: UI<AppEvent>[] = []
    if (node.inputs.length) {
        rowEntries.push(inputsUi(theme, node.inputs.map(i => graph.inputs[i]), focus))
    }
    if (node.inputs.length && node.outputs.length) {
        rowEntries.push(spacer(15))
    }
    if (node.body) {
        rowEntries.push(numberUi(theme, graph.bodys[node.body], focus), spacer(15))
    }
    if (node.outputs.length) {
        rowEntries.push(outputsUi(theme, node.outputs.map(o => graph.outputs[o]), focus))
    }
    return container(
        {
            color: isFocused(focus, node.uuid) ? theme.focusNode : theme.node,
            padding: 4,
            x: node.position.x,
            y: node.position.y,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                node: node.uuid
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text(node.name),
            spacer(4),
            row(rowEntries)
        ])
    )
}


export const finder = ({ search, options }: FocusFinder, theme: Theme): UI<AppEvent> =>
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


export const virtualKey = (key: string): UI<AppEvent> =>
    container({
        padding: 10,
        onClick: {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        }
    }, text({ size: 24 }, key))


export const virtualKeys = (keys: string[]) =>
    row(keys.map(c => virtualKey(c)))


export const alphabeticVirtualKeyboard = (theme: Theme) =>
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


export const numericVirtualKeyboard = (theme: Theme) =>
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


export const view = (state: State): UI<AppEvent> => {
    const nodes = state.nodeOrder
        .map(node =>
            nodeUi(
                state.theme,
                node,
                state.graph,
                state.focus
            )
        )
    const connections: Connection[] = Object.values(state.graph.edges).map(({ input, output }) => ({
        from: output,
        to: input,
        color: state.theme.connection
    }))
    const stacked: UI<AppEvent>[] = [
        container({ color: state.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({ camera: state.camera, children: nodes, connections }),
    ]
    switch (state.focus.kind) {
        case FocusKind.FINDER:
            stacked.push(
                finder(state.focus, state.theme),
                alphabeticVirtualKeyboard(state.theme)
            )
            break
        case FocusKind.BODY:
            stacked.push(numericVirtualKeyboard(state.theme))
            break
        case FocusKind.NODE:
            stacked.push(contextMenu({
                items: [{
                    name: 'Delete Node',
                    shortcut: 'd',
                    onClick: {
                        kind: EventKind.DELETE_NODE,
                        node: state.focus.node
                    }
                }],
                backgroundColor: state.theme.node
            }))
            break
        case FocusKind.INPUT:
            if (state.graph.inputs[state.focus.input].edge) {
                stacked.push(contextMenu({
                    items: [{
                        name: 'Delete Edge',
                        shortcut: 'd',
                        onClick: {
                            kind: EventKind.DELETE_INPUT_EDGE,
                            input: state.focus.input
                        }
                    }],
                    backgroundColor: state.theme.node
                }))
            }
            break
        case FocusKind.OUTPUT:
            if (state.graph.outputs[state.focus.output].edges.length > 0) {
                stacked.push(contextMenu({
                    items: [
                        {
                            name: 'Delete Edge',
                            shortcut: 'd',
                            onClick: {
                                kind: EventKind.DELETE_OUTPUT_EDGES,
                                output: state.focus.output
                            }
                        }
                    ],
                    backgroundColor: state.theme.node
                }))
            }
            break
    }
    return stack(stacked)
}