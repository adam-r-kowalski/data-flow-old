import {
    identity,
    multiplyMatrices,
    multiplyMatrixVector,
    scale,
    translate,
} from "../linear_algebra/matrix3x3"
import { length } from "../linear_algebra/vector3"
import { Effects, UpdateResult } from "../run"
import { Model, NodePlacementLocation } from "../model"
import { Focus, FocusKind } from "../model/focus"
import { PointerAction, PointerActionKind } from "../model/pointer_action"
import {
    Body,
    BodyKind,
    Bodys,
    GenerateUUID,
    Graph,
    Inputs,
    Node,
    NodeKind,
    Nodes,
    NodeSource,
    NumberBody,
    Operation,
    OperationKind,
    Output,
    Outputs,
    Position,
    TextBody,
    UUID,
} from "../model/graph"
import {
    addNode,
    changeNumberText,
    changeNodePosition,
    removeInputEdge,
    removeNode,
    removeOutputEdges,
    evaluateNode,
} from "./graph"
import {
    maybeTriggerQuickSelect,
    quickSelectInput,
    quickSelectOutput,
    quickSelectNode,
    quickSelectBody,
} from "./quick_select"
import { QuickSelectKind } from "../model/quick_select"
import { clearFocus, selectInput, selectOutput } from "./focus"
import {
    maybeStartMoveCamera,
    maybeStopMoveCamera,
    panCamera,
    zoomCamera,
} from "./move_camera"
import { maybeStartMoveNode, maybeStopMoveNode, moveNode } from "./move_node"
import {
    AppEvent,
    ChangeNode,
    ClickedBody,
    ClickedInput,
    ClickedNode,
    ClickedOutput,
    DeleteInputEdge,
    DeleteNode,
    DeleteOutputEdges,
    EventKind,
    FinderChange,
    FinderInsert,
    KeyDown,
    KeyUp,
    PointerDown,
    PointerMove,
    PointerUp,
    UploadCsv,
    UploadTable,
    Wheel,
} from "../event"
import * as finder from "../finder"

const pointerDown = (model: Model, event: PointerDown): UpdateResult => {
    const pointers = [...model.pointers, event.pointer]
    if (model.focus.kind !== FocusKind.NONE) {
        return { model: { ...model, pointers } }
    } else if (pointers.length > 1) {
        const pointerAction: PointerAction =
            pointers.length === 2
                ? {
                      kind: PointerActionKind.ZOOM,
                      pointerCenter: { x: 0, y: 0 },
                      pointerDistance: 0,
                  }
                : { kind: PointerActionKind.NONE }
        return {
            model: {
                ...model,
                openFinderFirstClick: false,
                focus: {
                    kind: FocusKind.NONE,
                    pointerAction,
                    quickSelect: { kind: QuickSelectKind.NONE },
                },
                pointers,
            },
        }
    } else {
        return {
            model: {
                ...model,
                focus: {
                    kind: FocusKind.NONE,
                    pointerAction: { kind: PointerActionKind.PAN },
                    quickSelect: { kind: QuickSelectKind.NONE },
                },
                pointers,
            },
        }
    }
}

const pointerUp = (model: Model, event: PointerUp): UpdateResult => {
    const pointers = model.pointers.filter((p) => p.id !== event.pointer.id)
    switch (model.focus.kind) {
        case FocusKind.NONE:
            switch (pointers.length) {
                case 1:
                    return {
                        model: {
                            ...model,
                            pointers,
                            focus: {
                                kind: FocusKind.NONE,
                                pointerAction: { kind: PointerActionKind.PAN },
                                quickSelect: { kind: QuickSelectKind.NONE },
                            },
                        },
                    }
                case 0:
                    return {
                        model: {
                            ...model,
                            pointers,
                            focus: {
                                kind: FocusKind.NONE,
                                pointerAction: { kind: PointerActionKind.NONE },
                                quickSelect: { kind: QuickSelectKind.NONE },
                            },
                        },
                    }
                default:
                    return { model: { ...model, pointers } }
            }
        case FocusKind.NODE:
            if (pointers.length === 0) {
                const focus: Focus = { ...model.focus, drag: false }
                return { model: { ...model, pointers, focus } }
            } else {
                return { model: { ...model, pointers } }
            }
        default:
            return { model: { ...model, pointers } }
    }
}

export const changeNth = <T>(xs: Readonly<T[]>, i: number, x: T): T[] => [
    ...xs.slice(0, i),
    x,
    ...xs.slice(i + 1),
]

const pointerMove = (model: Model, event: PointerMove): UpdateResult => {
    const result = (() => {
        const index = model.pointers.findIndex((p) => p.id === event.pointer.id)
        const pointer = model.pointers[index]
        const pointers =
            index === -1
                ? model.pointers
                : changeNth(model.pointers, index, event.pointer)
        const nodePlacementLocation: NodePlacementLocation = {
            x: event.pointer.position.x,
            y: event.pointer.position.y,
            show: false,
        }
        switch (model.focus.kind) {
            case FocusKind.NONE:
                const previousPointerAction = model.focus.pointerAction
                switch (previousPointerAction.kind) {
                    case PointerActionKind.NONE:
                        const render = model.nodePlacementLocation.show
                            ? true
                            : undefined
                        return {
                            model: {
                                ...model,
                                nodePlacementLocation,
                                pointers,
                            },
                            render,
                        }
                    case PointerActionKind.PAN:
                        const dx = event.pointer.position.x - pointer.position.x
                        const dy = event.pointer.position.y - pointer.position.y
                        const camera = multiplyMatrices(
                            model.camera,
                            translate(-dx, -dy)
                        )
                        return {
                            model: { ...model, pointers, camera },
                            render: true,
                        }
                    case PointerActionKind.ZOOM:
                        const [p0, p1] = [pointers[0], pointers[1]]
                        const { x: x1, y: y1 } = p0.position
                        const { x: x2, y: y2 } = p1.position
                        const x = (p0.position.x + p1.position.x) / 2
                        const y = (p0.position.y + p1.position.y) / 2
                        const pointerAction: PointerAction = {
                            kind: PointerActionKind.ZOOM,
                            pointerDistance: Math.sqrt(
                                Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
                            ),
                            pointerCenter: { x, y },
                        }
                        const focus: Focus = {
                            kind: FocusKind.NONE,
                            pointerAction,
                            quickSelect: { kind: QuickSelectKind.NONE },
                        }
                        if (previousPointerAction.pointerDistance > 0) {
                            const move = translate(x, y)
                            const zoom = Math.pow(
                                2,
                                (previousPointerAction.pointerDistance -
                                    pointerAction.pointerDistance) *
                                    0.01
                            )
                            const moveBack = translate(-x, -y)
                            const dx = x - previousPointerAction.pointerCenter.x
                            const dy = y - previousPointerAction.pointerCenter.y
                            const camera = multiplyMatrices(
                                model.camera,
                                move,
                                scale(zoom, zoom),
                                moveBack,
                                translate(-dx, -dy)
                            )
                            return {
                                model: { ...model, focus, pointers, camera },
                                render: true,
                            }
                        } else {
                            return { model: { ...model, focus, pointers } }
                        }
                }
            case FocusKind.NODE:
                if (model.focus.drag) {
                    const dx = event.pointer.position.x - pointer.position.x
                    const dy = event.pointer.position.y - pointer.position.y
                    const scaling = length(
                        multiplyMatrixVector(model.camera, [0, 1, 0])
                    )
                    const graph = changeNodePosition(
                        model.graph,
                        model.focus.node,
                        (p) => ({
                            x: p.x + dx * scaling,
                            y: p.y + dy * scaling,
                        })
                    )
                    return {
                        model: { ...model, pointers, graph },
                        render: true,
                    }
                } else {
                    return {
                        model: { ...model, pointers, nodePlacementLocation },
                    }
                }
            case FocusKind.BODY_NUMBER:
            case FocusKind.BODY_TEXT:
            case FocusKind.INPUT:
            case FocusKind.OUTPUT:
                return { model: { ...model, pointers, nodePlacementLocation } }
            case FocusKind.FINDER_INSERT:
            case FocusKind.FINDER_CHANGE:
                return { model: { ...model, pointers } }
        }
    })()
    return { ...result, cursor: true }
}

const clickedNode = (model: Model, event: ClickedNode): UpdateResult => {
    const nodeOrder = model.nodeOrder.filter((uuid) => uuid !== event.node)
    nodeOrder.push(event.node)
    return {
        model: {
            ...model,
            focus: {
                kind: FocusKind.NODE,
                node: event.node,
                drag: true,
                quickSelect: { kind: QuickSelectKind.NONE },
                move: {
                    left: false,
                    up: false,
                    down: false,
                    right: false,
                    now: 0,
                },
            },
            nodeOrder,
        },
        render: true,
    }
}

const wheel = (model: Model, event: Wheel): UpdateResult => {
    const move = translate(event.position.x, event.position.y)
    const zoom = Math.pow(2, event.deltaY * 0.01)
    const moveBack = translate(-event.position.x, -event.position.y)
    const camera = multiplyMatrices(
        model.camera,
        move,
        scale(zoom, zoom),
        moveBack
    )
    return {
        model: { ...model, camera },
        render: true,
    }
}

const clickedInput = (
    model: Model,
    event: ClickedInput,
    generateUUID: GenerateUUID
): UpdateResult => selectInput(model, event.input, generateUUID)

const clickedOutput = (
    model: Model,
    event: ClickedOutput,
    generateUUID: GenerateUUID
): UpdateResult => selectOutput(model, event.output, generateUUID)

const openFinderTimeout = (model: Model): UpdateResult => ({
    model: {
        ...model,
        openFinderFirstClick: false,
    },
})

export const openFinderInsert = (model: Model): Model => ({
    ...model,
    focus: {
        kind: FocusKind.FINDER_INSERT,
        finder: {
            search: "",
            options: Object.keys(model.operations),
            selectedIndex: 0,
        },
        quickSelect: { kind: QuickSelectKind.NONE },
        uppercase: false,
    },
    openFinderFirstClick: false,
})

export const openFinderChange = (model: Model, node: UUID): Model => ({
    ...model,
    focus: {
        kind: FocusKind.FINDER_CHANGE,
        finder: {
            search: "",
            options: Object.keys(model.operations),
            selectedIndex: 0,
        },
        quickSelect: { kind: QuickSelectKind.NONE },
        node,
        uppercase: false,
    },
    openFinderFirstClick: false,
})

export const updateNumberText = (
    model: Model,
    body: UUID,
    transform: (text: string) => string
): UpdateResult => {
    return {
        model: {
            ...model,
            graph: changeNumberText(model.graph, body, transform),
        },
        render: true,
    }
}

interface AddNodeInputs {
    model: Model
    operation: Operation
    position: Position
    effects: Effects
}

interface AddNodeOutputs {
    model: Model
    node: UUID
    event?: Promise<UploadCsv>
}

export const addNodeToGraph = ({
    model,
    operation,
    position,
    effects,
}: AddNodeInputs): AddNodeOutputs => {
    const { graph, node, event } = addNode({
        graph: model.graph,
        operation,
        position,
        effects,
    })
    return {
        model: {
            ...model,
            graph,
            nodeOrder: [...model.nodeOrder, node],
        },
        node,
        event,
    }
}

export const removeNodeFromGraph = (model: Model, node: UUID): Model => {
    const model1 = clearFocus({
        ...model,
        graph: removeNode(model.graph, node),
        nodeOrder: model.nodeOrder.filter((n) => n !== node),
    })
    const outputs = model.graph.nodes[node].outputs
    return outputs.reduce((model2, output) => {
        const edges = model.graph.outputs[output].edges
        return edges.reduce((model3, edge) => {
            const input = model.graph.edges[edge].input
            const nodeUUID = model.graph.inputs[input].node
            const graph = evaluateNode(model3.graph, nodeUUID)
            return {
                ...model3,
                graph,
            }
        }, model2)
    }, model1)
}

export const updateBody = (
    model: Model,
    body: UUID,
    transform: (body: Body) => Body
): UpdateResult => {
    const currentBody = model.graph.bodys[body]
    const nextBody = transform(currentBody)
    const graph: Graph = {
        ...model.graph,
        bodys: {
            ...model.graph.bodys,
            [body]: nextBody,
        },
    }
    const node = graph.bodys[body].node
    return {
        model: {
            ...model,
            graph: evaluateNode(graph, node),
        },
        render: true,
    }
}

const keyDown = (
    model: Model,
    event: KeyDown,
    effects: Effects
): UpdateResult => {
    const { generateUUID, currentTime } = effects
    const { key } = event
    switch (model.focus.quickSelect.kind) {
        case QuickSelectKind.INPUT:
            return quickSelectInput(
                model,
                model.focus.quickSelect,
                key,
                generateUUID
            )
        case QuickSelectKind.OUTPUT:
            return quickSelectOutput(
                model,
                model.focus.quickSelect,
                key,
                generateUUID
            )
        case QuickSelectKind.NODE:
            return quickSelectNode(model, model.focus.quickSelect, key)
        case QuickSelectKind.BODY:
            return quickSelectBody(model, model.focus.quickSelect, key)
        case QuickSelectKind.NONE:
            const focus = model.focus
            switch (focus.kind) {
                case FocusKind.FINDER_INSERT: {
                    const result = finder.update({
                        model: focus.finder,
                        event,
                        onSelect: (option) => ({
                            kind: EventKind.FINDER_INSERT,
                            option,
                        }),
                    })
                    const dispatch = result.event ? [result.event] : undefined
                    return {
                        model: {
                            ...model,
                            focus: {
                                ...focus,
                                finder: result.model,
                            },
                        },
                        dispatch,
                    }
                }
                case FocusKind.FINDER_CHANGE: {
                    const result = finder.update({
                        model: focus.finder,
                        event,
                        onSelect: (option) => ({
                            kind: EventKind.FINDER_CHANGE,
                            option,
                            node: focus.node,
                        }),
                    })
                    const dispatch = result.event ? [result.event] : undefined
                    return {
                        model: {
                            ...model,
                            focus: {
                                ...focus,
                                finder: result.model,
                            },
                        },
                        dispatch,
                    }
                }

                case FocusKind.BODY_NUMBER: {
                    switch (key) {
                        case "Backspace":
                            return updateNumberText(
                                model,
                                focus.body,
                                (text) => {
                                    const nextText = text.slice(0, -1)
                                    return nextText === "" ? "0" : nextText
                                }
                            )
                        case "1":
                        case "2":
                        case "3":
                        case "4":
                        case "5":
                        case "6":
                        case "7":
                        case "8":
                        case "9":
                        case "0":
                            return updateNumberText(
                                model,
                                focus.body,
                                (text) => {
                                    if (text === "0") {
                                        return key
                                    } else if (text === "-0") {
                                        return `-${key}`
                                    } else {
                                        return text + key
                                    }
                                }
                            )
                        case ".":
                            return updateNumberText(model, focus.body, (text) =>
                                text.includes(".") ? text : text + key
                            )
                        case "-":
                        case "+":
                            return updateNumberText(
                                model,
                                focus.body,
                                (text) => {
                                    if (text.length && text[0] === "-") {
                                        return text.slice(1)
                                    } else {
                                        return "-" + text
                                    }
                                }
                            )
                        case "c":
                            return updateNumberText(
                                model,
                                focus.body,
                                () => "0"
                            )
                        case "Enter":
                        case "Escape":
                            return {
                                model: clearFocus(model),
                                render: true,
                            }
                        default:
                            return maybeTriggerQuickSelect(model, focus, key)
                    }
                }
                case FocusKind.BODY_TEXT: {
                    const body = model.graph.bodys[focus.body]
                    switch (key) {
                        case "Enter":
                        case "Escape":
                            return {
                                model: clearFocus(model),
                                render: true,
                            }
                        case "Shift":
                            return { model }
                        case "sft":
                            return {
                                model: {
                                    ...model,
                                    focus: {
                                        ...focus,
                                        uppercase: !focus.uppercase,
                                    },
                                },
                                render: true,
                            }
                        case "Backspace":
                            return updateBody(model, body.uuid, (body) => {
                                const textBody = body as TextBody
                                return {
                                    ...textBody,
                                    value: textBody.value.slice(0, -1),
                                }
                            })
                        default:
                            return updateBody(model, body.uuid, (body) => {
                                const textBody = body as TextBody
                                return {
                                    ...textBody,
                                    value: textBody.value + key,
                                }
                            })
                    }
                }
                case FocusKind.NODE:
                    switch (key) {
                        case "f":
                            return {
                                model: openFinderInsert(model),
                                render: true,
                            }
                        case "c":
                            return {
                                model: openFinderChange(model, focus.node),
                                render: true,
                            }
                        case "d":
                        case "Backspace":
                        case "Delete":
                            return {
                                model: removeNodeFromGraph(model, focus.node),
                                render: true,
                            }
                        case "Escape":
                            return { model: clearFocus(model), render: true }
                        default:
                            const result = maybeTriggerQuickSelect(
                                model,
                                focus,
                                key
                            )
                            if (result.render) {
                                return result
                            } else {
                                return maybeStartMoveNode(
                                    result.model,
                                    focus,
                                    key,
                                    currentTime
                                )
                            }
                    }
                case FocusKind.INPUT:
                    switch (key) {
                        case "f":
                            return {
                                model: openFinderInsert(model),
                                render: true,
                            }
                        case "d":
                        case "Backspace":
                        case "Delete":
                            return {
                                model: clearFocus({
                                    ...model,
                                    graph: removeInputEdge(
                                        model.graph,
                                        focus.input
                                    ),
                                }),
                                render: true,
                            }
                        case "Escape":
                            return { model: clearFocus(model), render: true }
                        default:
                            return maybeTriggerQuickSelect(model, focus, key)
                    }
                case FocusKind.OUTPUT:
                    switch (key) {
                        case "f":
                            return {
                                model: openFinderInsert(model),
                                render: true,
                            }
                        case "d":
                        case "Backspace":
                        case "Delete":
                            return {
                                model: clearFocus({
                                    ...model,
                                    graph: removeOutputEdges(
                                        model.graph,
                                        focus.output
                                    ),
                                }),
                                render: true,
                            }
                        case "Escape":
                            return { model: clearFocus(model), render: true }
                        default:
                            return maybeTriggerQuickSelect(model, focus, key)
                    }
                case FocusKind.NONE:
                    switch (key) {
                        case "f":
                            return {
                                model: openFinderInsert(model),
                                render: true,
                            }
                        case "z":
                            return {
                                model: {
                                    ...model,
                                    camera: identity(),
                                },
                                render: true,
                            }
                        default:
                            const result = maybeTriggerQuickSelect(
                                model,
                                focus,
                                key
                            )
                            if (result.render) {
                                return result
                            } else {
                                return maybeStartMoveCamera(
                                    result.model,
                                    event,
                                    currentTime
                                )
                            }
                    }
            }
    }
}

const keyUp = (model: Model, event: KeyUp): UpdateResult => {
    switch (model.focus.kind) {
        case FocusKind.NONE:
            return maybeStopMoveCamera(model, event)
        case FocusKind.NODE:
            return maybeStopMoveNode(model, model.focus, event.key)
        default:
            return { model }
    }
}

export const focusBody = (model: Model, bodyUUID: UUID): Model => {
    const body = model.graph.bodys[bodyUUID] as NumberBody | TextBody
    switch (body.kind) {
        case BodyKind.NUMBER:
            return {
                ...model,
                focus: {
                    kind: FocusKind.BODY_NUMBER,
                    body: bodyUUID,
                    quickSelect: { kind: QuickSelectKind.NONE },
                },
            }
        case BodyKind.TEXT:
            return {
                ...model,
                focus: {
                    kind: FocusKind.BODY_TEXT,
                    body: bodyUUID,
                    quickSelect: { kind: QuickSelectKind.NONE },
                    uppercase: false,
                },
            }
    }
}

const clickedBody = (model: Model, { body }: ClickedBody): UpdateResult => ({
    model: focusBody(clearFocus(model), body),
    render: true,
})

const clickedBackground = (model: Model): UpdateResult => {
    if (
        [FocusKind.FINDER_INSERT, FocusKind.FINDER_CHANGE].includes(
            model.focus.kind
        )
    ) {
        return {
            model: clearFocus(model),
            render: true,
        }
    } else if (model.openFinderFirstClick) {
        const { x, y } = model.pointers[0].position
        return {
            model: openFinderInsert({
                ...model,
                nodePlacementLocation: { x, y, show: false },
            }),
            render: true,
        }
    } else {
        const focus: Focus =
            model.focus.kind === FocusKind.NONE
                ? model.focus
                : {
                      kind: FocusKind.NONE,
                      pointerAction: { kind: PointerActionKind.PAN },
                      quickSelect: { kind: QuickSelectKind.NONE },
                  }
        return {
            model: {
                ...model,
                openFinderFirstClick: model.pointers.length == 1,
                focus,
            },
            schedule: [
                {
                    after: { milliseconds: 300 },
                    event: { kind: EventKind.OPEN_FINDER_TIMEOUT },
                },
            ],
            render: true,
        }
    }
}

const changeNode = (model: Model, { node }: ChangeNode): UpdateResult => ({
    model: openFinderChange(model, node),
    render: true,
})

const deleteNode = (model: Model, { node }: DeleteNode): UpdateResult => ({
    model: removeNodeFromGraph(model, node),
    render: true,
})

const deleteInputEdge = (
    model: Model,
    { input }: DeleteInputEdge
): UpdateResult => ({
    model: clearFocus({
        ...model,
        graph: removeInputEdge(model.graph, input),
    }),
    render: true,
})

const deleteOutputEdges = (
    model: Model,
    { output }: DeleteOutputEdges
): UpdateResult => ({
    model: clearFocus({
        ...model,
        graph: removeOutputEdges(model.graph, output),
    }),
    render: true,
})

const resetCamera = (model: Model): UpdateResult => ({
    model: {
        ...model,
        camera: identity(),
    },
    render: true,
})

export const uploadTable = (
    model: Model,
    event: UploadTable,
    generateUUID: GenerateUUID
): UpdateResult => {
    const nodeUUID = generateUUID()
    const output: Output = {
        uuid: generateUUID(),
        node: nodeUUID,
        name: "table",
        edges: [],
    }
    const body: Body = {
        kind: BodyKind.TABLE,
        uuid: generateUUID(),
        node: nodeUUID,
        value: event.table,
    }
    const [x, y] = multiplyMatrixVector(model.camera, [
        event.position.x,
        event.position.y,
        1,
    ])
    const node: NodeSource = {
        kind: NodeKind.SOURCE,
        uuid: nodeUUID,
        name: event.table.name,
        outputs: [output.uuid],
        body: body.uuid,
        position: { x, y },
    }
    return {
        model: {
            ...model,
            graph: {
                ...model.graph,
                nodes: { ...model.graph.nodes, [node.uuid]: node },
                bodys: { ...model.graph.bodys, [body.uuid]: body },
                outputs: { ...model.graph.outputs, [output.uuid]: output },
            },
            nodeOrder: [...model.nodeOrder, node.uuid],
        },
        render: true,
    }
}

export const uploadCsv = (model: Model, event: UploadCsv): UpdateResult => {
    const node: Node = {
        ...model.graph.nodes[event.node],
        name: event.table.name,
    }
    const body: Body = {
        kind: BodyKind.TABLE,
        uuid: node.body,
        node: node.uuid,
        value: event.table,
    }
    return {
        model: {
            ...model,
            graph: {
                ...model.graph,
                nodes: { ...model.graph.nodes, [node.uuid]: node },
                bodys: { ...model.graph.bodys, [body.uuid]: body },
            },
        },
        render: true,
    }
}

export const finderInsert = (
    model: Model,
    event: FinderInsert,
    effects: Effects
): UpdateResult => {
    const operation = model.operations[event.option]
    const [x, y, _] = multiplyMatrixVector(model.camera, [
        model.nodePlacementLocation.x,
        model.nodePlacementLocation.y,
        1,
    ])
    const { model: nextModel, event: promise } = addNodeToGraph({
        model,
        operation,
        position: { x, y },
        effects,
    })
    return {
        model: clearFocus(nextModel),
        render: true,
        promise,
    }
}

export const finderChange = (
    model: Model,
    event: FinderChange,
    generateUUID: GenerateUUID
): UpdateResult => {
    const operation = model.operations[event.option]
    switch (operation.kind) {
        case OperationKind.TRANSFORM:
            const node = model.graph.nodes[event.node]
            switch (node.kind) {
                case NodeKind.TRANSFORM:
                    const newInputs: UUID[] = []
                    const removedInputs: UUID[] = []
                    const inputs: Inputs = (() => {
                        const inputs = { ...model.graph.inputs }
                        if (node.inputs.length === operation.inputs.length) {
                            operation.inputs.forEach((name, i) => {
                                const input = model.graph.inputs[node.inputs[i]]
                                inputs[input.uuid] = {
                                    ...input,
                                    name,
                                }
                                newInputs.push(input.uuid)
                            })
                        } else if (
                            node.inputs.length < operation.inputs.length
                        ) {
                            node.inputs.forEach((_, i) => {
                                const input = model.graph.inputs[node.inputs[i]]
                                inputs[input.uuid] = {
                                    ...input,
                                    name: operation.inputs[i],
                                }
                                newInputs.push(input.uuid)
                            })
                            const rest = operation.inputs.slice(
                                node.inputs.length
                            )
                            rest.forEach((name) => {
                                const uuid = generateUUID()
                                inputs[uuid] = {
                                    uuid,
                                    node: node.uuid,
                                    name,
                                }
                                newInputs.push(uuid)
                            })
                        } else {
                            operation.inputs.forEach((name, i) => {
                                const input = model.graph.inputs[node.inputs[i]]
                                inputs[input.uuid] = {
                                    ...input,
                                    name,
                                }
                                newInputs.push(input.uuid)
                            })
                            const rest = node.inputs.slice(
                                operation.inputs.length
                            )
                            rest.forEach((name) => {
                                delete inputs[name]
                                removedInputs.push(name)
                            })
                        }
                        return inputs
                    })()
                    const outputs: Outputs = (() => {
                        const outputs = { ...model.graph.outputs }
                        if (node.outputs.length === operation.outputs.length) {
                            operation.outputs.forEach((name, i) => {
                                const output =
                                    model.graph.outputs[node.outputs[i]]
                                outputs[output.uuid] = {
                                    ...output,
                                    name,
                                }
                            })
                        }
                        return outputs
                    })()
                    const bodys: Bodys = {
                        ...model.graph.bodys,
                        [node.body]: {
                            kind: BodyKind.NO,
                            uuid: node.body,
                            node: node.uuid,
                        },
                    }
                    const nodes: Nodes = {
                        ...model.graph.nodes,
                        [node.uuid]: {
                            ...node,
                            name: operation.name,
                            func: operation.func,
                            inputs: newInputs,
                        },
                    }
                    let graph = model.graph
                    for (const input of removedInputs) {
                        graph = removeInputEdge(graph, input)
                    }
                    const graph1: Graph = {
                        ...graph,
                        nodes,
                        bodys,
                        inputs,
                        outputs,
                    }
                    const graph2 = evaluateNode(graph1, event.node)
                    return {
                        model: clearFocus({ ...model, graph: graph2 }),
                        render: true,
                    }
                case NodeKind.SOURCE:
                    return {
                        model: clearFocus(model),
                        render: true,
                    }
            }
        default:
            return {
                model: clearFocus(model),
                render: true,
            }
    }
}

export const finderClose = (model: Model): UpdateResult => ({
    model: clearFocus(model),
    render: true,
})

export const update = (
    effects: Effects,
    model: Model,
    event: AppEvent
): UpdateResult => {
    switch (event.kind) {
        case EventKind.POINTER_MOVE:
            return pointerMove(model, event)
        case EventKind.POINTER_DOWN:
            return pointerDown(model, event)
        case EventKind.POINTER_UP:
            return pointerUp(model, event)
        case EventKind.CLICKED_NODE:
            return clickedNode(model, event)
        case EventKind.WHEEL:
            return wheel(model, event)
        case EventKind.CLICKED_INPUT:
            return clickedInput(model, event, effects.generateUUID)
        case EventKind.CLICKED_OUTPUT:
            return clickedOutput(model, event, effects.generateUUID)
        case EventKind.OPEN_FINDER_TIMEOUT:
            return openFinderTimeout(model)
        case EventKind.KEYDOWN:
            return keyDown(model, event, effects)
        case EventKind.KEYUP:
            return keyUp(model, event)
        case EventKind.CLICKED_BODY:
            return clickedBody(model, event)
        case EventKind.CLICKED_BACKGROUND:
            return clickedBackground(model)
        case EventKind.CHANGE_NODE:
            return changeNode(model, event)
        case EventKind.DELETE_NODE:
            return deleteNode(model, event)
        case EventKind.DELETE_INPUT_EDGE:
            return deleteInputEdge(model, event)
        case EventKind.DELETE_OUTPUT_EDGES:
            return deleteOutputEdges(model, event)
        case EventKind.PAN_CAMERA:
            return panCamera(model, effects.currentTime)
        case EventKind.ZOOM_CAMERA:
            return zoomCamera(model, effects.currentTime)
        case EventKind.RESET_CAMERA:
            return resetCamera(model)
        case EventKind.MOVE_NODE:
            return moveNode(model, effects.currentTime)
        case EventKind.UPLOAD_TABLE:
            return uploadTable(model, event, effects.generateUUID)
        case EventKind.UPLOAD_CSV:
            return uploadCsv(model, event)
        case EventKind.FINDER_INSERT:
            return finderInsert(model, event, effects)
        case EventKind.FINDER_CHANGE:
            return finderChange(model, event, effects.generateUUID)
        case EventKind.FINDER_CLOSE:
            return finderClose(model)
    }
}
