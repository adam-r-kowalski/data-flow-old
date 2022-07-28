import { CrossAxisAlignment, MainAxisAlignment } from "../alignment"
import { AppEvent, EventKind } from "../../event"
import { Finder, Selected, SelectedKind, State, Theme, VirtualKeyboardKind } from "../../state"
import { text, stack, scene, row, container, column, Connection, UI } from '..'
import { Body, Graph, Input, Output, UUID } from "../../graph/model"
import { contextMenu, ContextMenuItem } from "./context_menu"


export const spacer = (size: number): UI<AppEvent> =>
    container({ width: size, height: size })


export const intersperse = <T>(array: T[], seperator: T): T[] => {
    const result = [array[0]]
    for (const element of array.slice(1)) {
        result.push(seperator, element)
    }
    return result
}

export const isSelected = (selected: Selected, uuid: UUID): boolean => {
    switch (selected.kind) {
        case SelectedKind.BODY: return selected.body === uuid
        case SelectedKind.INPUT: return selected.input === uuid
        case SelectedKind.NODE: return selected.node === uuid
        case SelectedKind.NONE: return false
        case SelectedKind.OUTPUT: return selected.output === uuid
    }
}

export const inputUi = (theme: Theme, { name, uuid }: Input, selected: Selected): UI<AppEvent> =>
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
                color: isSelected(selected, uuid) ? theme.selectedInput : theme.input,
            }),
            spacer(4),
            text(name)
        ])
    )


export const inputsUi = (theme: Theme, inputs: Input[], selected: Selected) =>
    column(
        intersperse(
            inputs.map(input => inputUi(theme, input, selected)),
            spacer(4)
        )
    )


export const outputUi = (theme: Theme, { name, uuid }: Output, selected: Selected): UI<AppEvent> =>
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
                color: isSelected(selected, uuid) ? theme.selectedInput : theme.input,
            }),
        ])
    )


export const outputsUi = (theme: Theme, outputs: Output[], selected: Selected) =>
    column(
        intersperse(
            outputs.map(output => outputUi(theme, output, selected)),
            spacer(4)
        )
    )


export const numberUi = (theme: Theme, body: Body, selected: Selected): UI<AppEvent> =>
    container({
        color: isSelected(selected, body.uuid) ? theme.selectedInput : theme.background,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_NUMBER,
            body: body.uuid
        }
    },
        text(body.value.toString()))


export const nodeUi = (theme: Theme, nodeUUID: UUID, graph: Graph, selected: Selected): UI<AppEvent> => {
    const node = graph.nodes[nodeUUID]
    const rowEntries: UI<AppEvent>[] = []
    if (node.inputs.length) {
        rowEntries.push(inputsUi(theme, node.inputs.map(i => graph.inputs[i]), selected))
    }
    if (node.inputs.length && node.outputs.length) {
        rowEntries.push(spacer(15))
    }
    if (node.body) {
        rowEntries.push(numberUi(theme, graph.bodys[node.body], selected), spacer(15))
    }
    if (node.outputs.length) {
        rowEntries.push(outputsUi(theme, node.outputs.map(o => graph.outputs[o]), selected))
    }
    return container(
        {
            color: isSelected(selected, node.uuid) ? theme.selectedNode : theme.node,
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


export const finder = ({ search, options }: Finder, theme: Theme): UI<AppEvent> =>
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


export const virtualKeyboard = (theme: Theme, kind: VirtualKeyboardKind) => {
    switch (kind) {
        case VirtualKeyboardKind.ALPHABETIC: return alphabeticVirtualKeyboard(theme)
        case VirtualKeyboardKind.NUMERIC: return numericVirtualKeyboard(theme)
    }
}

export const selectedMenuItem = (theme: Theme, graph: Graph, selected: Selected): ContextMenuItem<AppEvent> | null => {
    switch (selected.kind) {
        case SelectedKind.NODE:
            return {
                name: 'Delete Node',
                shortcut: 'd',
                onClick: {
                    kind: EventKind.DELETE_NODE,
                    node: selected.node
                }
            }
        case SelectedKind.INPUT:
            if (graph.inputs[selected.input].edge) {
                return {
                    name: 'Delete Edge',
                    shortcut: 'd',
                    onClick: {
                        kind: EventKind.DELETE_INPUT_EDGE,
                        input: selected.input
                    }
                }
            }
            return null
        case SelectedKind.OUTPUT:
            if (graph.outputs[selected.output].edges.length > 0) {
                return {
                    name: 'Delete Edge',
                    shortcut: 'd',
                    onClick: {
                        kind: EventKind.DELETE_OUTPUT_EDGES,
                        output: selected.output
                    }
                }
            }
            return null
        default: return null
    }
}

export const view = (state: State): UI<AppEvent> => {
    const nodes = state.nodeOrder
        .map(node =>
            nodeUi(
                state.theme,
                node,
                state.graph,
                state.selected
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
    if (state.finder.show) stacked.push(finder(state.finder, state.theme))
    if (state.virtualKeyboard.show) stacked.push(virtualKeyboard(state.theme, state.virtualKeyboard.kind))
    const menuItem = selectedMenuItem(state.theme, state.graph, state.selected)
    if (menuItem) stacked.push(contextMenu({ items: [menuItem], backgroundColor: state.theme.node }))
    return stack(stacked)
}