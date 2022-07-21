import { CrossAxisAlignment, MainAxisAlignment } from "../alignment"
import { AppEvent, EventKind } from "../../event"
import { Body, Finder, Input, Node, Output, State, Theme, UUID, VirtualKeyboardKind } from "../../state"
import { text, stack, scene, row, container, column, Connection, UI } from '..'


export const spacer = (size: number): UI<AppEvent> =>
    container({ width: size, height: size })


export const intersperse = <T>(array: T[], seperator: T): T[] => {
    const result = [array[0]]
    for (const element of array.slice(1)) {
        result.push(seperator, element)
    }
    return result
}


export const inputUi = (theme: Theme, { name, selected }: Input, nodeUUID: UUID, inputIndex: number): UI<AppEvent> =>
    container({
        onClick: {
            kind: EventKind.CLICKED_INPUT,
            inputPath: { nodeUUID, inputIndex }
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container({
                id: `input ${nodeUUID} ${inputIndex}`,
                width: 14,
                height: 14,
                color: selected ? theme.selectedInput : theme.input,
            }),
            spacer(4),
            text(name)
        ])
    )


export const inputsUi = (theme: Theme, inputs: Input[], nodeUUID: UUID) =>
    column(
        intersperse(
            inputs.map((input, inputIndex) => inputUi(theme, input, nodeUUID, inputIndex)),
            spacer(4)
        )
    )


export const outputUi = (theme: Theme, { name, selected }: Output, nodeUUID: UUID, outputIndex: number): UI<AppEvent> =>
    container({
        onClick: {
            kind: EventKind.CLICKED_OUTPUT,
            outputPath: { nodeUUID, outputIndex }
        }
    },
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text(name),
            spacer(4),
            container({
                id: `output ${nodeUUID} ${outputIndex}`,
                width: 14,
                height: 14,
                color: selected ? theme.selectedInput : theme.input,
            }),
        ])
    )


export const outputsUi = (theme: Theme, outputs: Output[], nodeUUID: UUID) =>
    column(
        intersperse(
            outputs.map((output, outputIndex) => outputUi(theme, output, nodeUUID, outputIndex)),
            spacer(4)
        )
    )


export const numberUi = (theme: Theme, body: Body, nodeUUID: UUID): UI<AppEvent> =>
    container({
        color: body.editing ? theme.selectedInput : theme.background,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_NUMBER,
            nodeUUID
        }
    },
        text(body.value.toString()))


export const nodeUi = (theme: Theme, { name, x, y, inputs, body, outputs, uuid }: Node): UI<AppEvent> => {
    const rowEntries: UI<AppEvent>[] = []
    if (inputs.length) rowEntries.push(inputsUi(theme, inputs, uuid))
    if (inputs.length && outputs.length) rowEntries.push(spacer(15))
    if (body !== undefined) rowEntries.push(numberUi(theme, body, uuid), spacer(15))
    if (outputs.length) rowEntries.push(outputsUi(theme, outputs, uuid))
    return container(
        {
            color: theme.node,
            padding: 4,
            x, y,
            onClick: {
                kind: EventKind.CLICKED_NODE,
                nodeUUID: uuid
            }
        },
        column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text(name),
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
    const nodes = state.graph.nodeOrder.map(nodeUUID => nodeUi(state.theme, state.graph.nodes[nodeUUID]))
    const connections: Connection[] = state.graph.edges.map(({ input, output }) => ({
        from: `output ${output.nodeUUID} ${output.outputIndex}`,
        to: `input ${input.nodeUUID} ${input.inputIndex}`,
        color: state.theme.connection
    }))
    const stacked: UI<AppEvent>[] = [
        container({ color: state.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
        scene({ camera: state.camera, children: nodes, connections }),
    ]
    if (state.finder.show) stacked.push(finder(state.finder, state.theme))
    if (state.virtualKeyboard.show) stacked.push(virtualKeyboard(state.theme, state.virtualKeyboard.kind))
    return stack(stacked)
}