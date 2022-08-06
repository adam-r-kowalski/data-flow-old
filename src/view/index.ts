import { CrossAxisAlignment, MainAxisAlignment } from "../ui/alignment"
import { AppEvent, EventKind } from "../update"
import { Model } from "../model"
import { Theme } from '../model/theme'
import { Focus, FocusFinder, FocusKind } from "../model/focus"
import { text, stack, scene, row, container, column, Connection, UI } from '../ui'
import { Body, Graph, Input, Output, UUID } from "../model/graph"
import { contextMenu } from "./context_menu"
import { QuickSelectKind } from "../model/quick_select"
import { identity } from "../linear_algebra/matrix3x3"


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
                color: isFocused(focus, uuid) ? theme.focusInput : theme.input,
                padding: { top: 2, right: 4, bottom: 2, left: 4 }
            }, text({ color: theme.background }, focus.quickSelect.kind === QuickSelectKind.INPUT ? focus.quickSelect.hotkeys[uuid] : ' ')),
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
                color: isFocused(focus, uuid) ? theme.focusInput : theme.input,
                padding: { top: 2, right: 4, bottom: 2, left: 4 }
            }, text({ color: theme.background }, focus.quickSelect.kind === QuickSelectKind.OUTPUT ? focus.quickSelect.hotkeys[uuid] : ' ')),
        ])
    )


export const outputsUi = (theme: Theme, outputs: Output[], focus: Focus) =>
    column(
        intersperse(
            outputs.map(output => outputUi(theme, output, focus)),
            spacer(4)
        )
    )


export const numberUi = (theme: Theme, body: Body, focus: Focus): UI<AppEvent> => {
    const value = focus.quickSelect.kind === QuickSelectKind.BODY ?
        focus.quickSelect.hotkeys[body.uuid] :
        body.value.toString()
    return container({
        color: isFocused(focus, body.uuid) ? theme.focusInput : theme.background,
        padding: 5,
        onClick: {
            kind: EventKind.CLICKED_BODY,
            body: body.uuid
        }
    },
        text(value))
}


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
    const name = focus.quickSelect.kind === QuickSelectKind.NODE ?
        focus.quickSelect.hotkeys[node.uuid] :
        node.name
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
            text(name),
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

const identityCamera = identity()

export const view = (model: Model): UI<AppEvent> => {
    const nodes = model.nodeOrder
        .map(node =>
            nodeUi(
                model.theme,
                node,
                model.graph,
                model.focus
            )
        )
    const connections: Connection[] = Object.values(model.graph.edges).map(({ input, output }) => ({
        from: output,
        to: input,
        color: model.theme.connection
    }))
    const stacked: UI<AppEvent>[] = [
        container({ color: model.theme.background, onClick: { kind: EventKind.CLICKED_BACKGROUND } }),
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
                    })
                ],
                connections: []
            })
        )
    }
    switch (model.focus.kind) {
        case FocusKind.FINDER:
            stacked.push(
                finder(model.focus, model.theme),
                alphabeticVirtualKeyboard(model.theme)
            )
            break
        case FocusKind.BODY:
            stacked.push(numericVirtualKeyboard(model.theme))
            break
        case FocusKind.NODE:
            stacked.push(contextMenu({
                items: [{
                    name: 'Delete Node',
                    shortcut: 'd',
                    onClick: {
                        kind: EventKind.DELETE_NODE,
                        node: model.focus.node
                    }
                }],
                backgroundColor: model.theme.node
            }))
            break
        case FocusKind.INPUT:
            if (model.graph.inputs[model.focus.input].edge) {
                stacked.push(contextMenu({
                    items: [{
                        name: 'Delete Edge',
                        shortcut: 'd',
                        onClick: {
                            kind: EventKind.DELETE_INPUT_EDGE,
                            input: model.focus.input
                        }
                    }],
                    backgroundColor: model.theme.node
                }))
            }
            break
        case FocusKind.OUTPUT:
            if (model.graph.outputs[model.focus.output].edges.length > 0) {
                stacked.push(contextMenu({
                    items: [
                        {
                            name: 'Delete Edge',
                            shortcut: 'd',
                            onClick: {
                                kind: EventKind.DELETE_OUTPUT_EDGES,
                                output: model.focus.output
                            }
                        }
                    ],
                    backgroundColor: model.theme.node
                }))
            }
            break
    }
    return stack(stacked)
}