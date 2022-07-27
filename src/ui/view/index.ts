import { CrossAxisAlignment, MainAxisAlignment } from "../alignment"
import { AppEvent, EventKind } from "../../event"
import { Finder, SelectedKind, State, Theme, VirtualKeyboardKind } from "../../state"
import { text, stack, scene, row, container, column, Connection, UI } from '..'
import { Body, Bodys, Input, Inputs, Node, Output, Outputs, UUID } from "../../graph/model"
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


export const inputUi = (theme: Theme, { name, uuid }: Input, selectedInput?: UUID): UI<AppEvent> =>
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
                color: selectedInput === uuid ? theme.selectedInput : theme.input,
            }),
            spacer(4),
            text(name)
        ])
    )


export const inputsUi = (theme: Theme, inputs: Input[], selectedInput?: UUID) =>
    column(
        intersperse(
            inputs.map(input => inputUi(theme, input, selectedInput)),
            spacer(4)
        )
    )


export const outputUi = (theme: Theme, { name, uuid }: Output, selectedOutput?: UUID): UI<AppEvent> =>
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
                color: selectedOutput === uuid ? theme.selectedInput : theme.input,
            }),
        ])
    )


export const outputsUi = (theme: Theme, outputs: Output[], selectedOutput?: UUID) =>
    column(
        intersperse(
            outputs.map(output => outputUi(theme, output, selectedOutput)),
            spacer(4)
        )
    )


export const numberUi = (theme: Theme, body: Body, node: UUID, selectedBody?: UUID): UI<AppEvent> =>
    container({
        color: body.uuid === selectedBody ? theme.selectedInput : theme.background,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_NUMBER,
            node
        }
    },
        text(body.value.toString()))


export const nodeUi = (theme: Theme, node: Node, inputs: Inputs, outputs: Outputs, bodys: Bodys, selectedInput?: UUID, selectedOutput?: UUID, selectedBody?: UUID): UI<AppEvent> => {
    const rowEntries: UI<AppEvent>[] = []
    if (node.inputs.length) {
        rowEntries.push(inputsUi(theme, node.inputs.map(i => inputs[i]), selectedInput))
    }
    if (node.inputs.length && node.outputs.length) {
        rowEntries.push(spacer(15))
    }
    if (node.body) {
        rowEntries.push(numberUi(theme, bodys[node.body], node.uuid, selectedBody), spacer(15))
    }
    if (node.outputs.length) {
        rowEntries.push(outputsUi(theme, node.outputs.map(o => outputs[o]), selectedOutput))
    }
    return container(
        {
            color: theme.node,
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

export const view = (state: State): UI<AppEvent> => {
    const selectedInput = state.selected.kind === SelectedKind.INPUT ? state.selected.input : undefined
    const selectedOutput = state.selected.kind === SelectedKind.OUTPUT ? state.selected.output : undefined
    const selectedBody = state.selected.kind === SelectedKind.BODY ? state.selected.body : undefined
    const nodes = state.nodeOrder
        .map(node =>
            nodeUi(
                state.theme,
                state.graph.nodes[node],
                state.graph.inputs,
                state.graph.outputs,
                state.graph.bodys,
                selectedInput,
                selectedOutput,
                selectedBody))
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
    switch (state.selected.kind) {
        case SelectedKind.NODE:
            stacked.push(contextMenu({
                items: [{
                    name: 'Delete Node',
                    shortcut: 'd',
                    onClick: {
                        kind: EventKind.DELETE_NODE,
                        node: state.selected.node
                    }
                }],
                backgroundColor: state.theme.node
            }))
            break
        default: break
    }
    return stack(stacked)
}