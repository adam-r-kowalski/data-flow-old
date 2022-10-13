import {
    identity,
    multiplyMatrices,
    multiplyMatrixVector,
    scale,
    translate,
} from "../linear_algebra/matrix3x3"
import { length } from "../linear_algebra/vector3"
import { Model, NodePlacementLocation } from "../model"
import { Focus, FocusKind } from "../model/focus"
import { PointerAction, PointerActionKind } from "../model/pointer_action"
import {
    Body,
    BodyKind,
    Bodys,
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
    OnTableUploaded,
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
    ClickedBackground,
    ClickedBody,
    ClickedInput,
    ClickedNode,
    ClickedOutput,
    DeleteInputEdge,
    DeleteNode,
    DeleteOutputEdges,
    DraggedBackground,
    DraggedNode,
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
    WheelPan,
    WheelZoom,
} from "../event"
import * as finder from "../finder"
import { Effects, GenerateUUID } from "../effects"
import { Dispatch } from "../run"
import { Table } from "../model/table"
import { loadDemoModel } from "../model/demo"

const pointerDown = (model: Model, event: PointerDown): Model => {
    const pointers = [...model.pointers, event.pointer]
    if (model.focus.kind !== FocusKind.NONE) {
        return { ...model, pointers }
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
            ...model,
            focus: {
                kind: FocusKind.NONE,
                pointerAction,
                quickSelect: { kind: QuickSelectKind.NONE },
            },
            pointers,
        }
    } else {
        return { ...model, pointers }
    }
}

const pointerUp = (model: Model, event: PointerUp): Model => {
    const pointers = model.pointers.filter((p) => p.id !== event.pointer.id)
    switch (model.focus.kind) {
        case FocusKind.NONE:
            switch (pointers.length) {
                case 1:
                case 0:
                    return {
                        ...model,
                        pointers,
                        focus: {
                            kind: FocusKind.NONE,
                            pointerAction: { kind: PointerActionKind.NONE },
                            quickSelect: { kind: QuickSelectKind.NONE },
                        },
                    }
                default:
                    return { ...model, pointers }
            }
        default:
            return { ...model, pointers }
    }
}

export const changeNth = <T>(xs: Readonly<T[]>, i: number, x: T): T[] => [
    ...xs.slice(0, i),
    x,
    ...xs.slice(i + 1),
]

const pointerMove = (
    model: Model,
    event: PointerMove,
    showCursor: () => void
): Model => {
    showCursor()
    const index = model.pointers.findIndex((p) => p.id === event.pointer.id)
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
                    return {
                        ...model,
                        nodePlacementLocation,
                        pointers,
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
                        return { ...model, focus, pointers, camera }
                    } else {
                        return { ...model, focus, pointers }
                    }
            }
        case FocusKind.NODE:
        case FocusKind.BODY_NUMBER:
        case FocusKind.BODY_TEXT:
        case FocusKind.INPUT:
        case FocusKind.OUTPUT:
            return { ...model, pointers, nodePlacementLocation }
        case FocusKind.FINDER_INSERT:
        case FocusKind.FINDER_CHANGE:
            return { ...model, pointers }
    }
}

const clickedNode = (model: Model, event: ClickedNode): Model => {
    const nodeOrder = model.nodeOrder.filter((uuid) => uuid !== event.node)
    nodeOrder.push(event.node)
    return {
        ...model,
        focus: {
            kind: FocusKind.NODE,
            node: event.node,
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
    }
}

const draggedNode = (model: Model, { node, x, y }: DraggedNode): Model => {
    const scaling = length(multiplyMatrixVector(model.camera, [0, 1, 0]))
    const graph = changeNodePosition(model.graph, node, (p) => ({
        x: p.x + x * scaling,
        y: p.y + y * scaling,
    }))
    return { ...model, graph }
}

const wheelZoom = (model: Model, event: WheelZoom): Model => {
    const move = translate(event.position.x, event.position.y)
    const zoom = Math.pow(2, event.delta * 0.01)
    const moveBack = translate(-event.position.x, -event.position.y)
    const camera = multiplyMatrices(
        model.camera,
        move,
        scale(zoom, zoom),
        moveBack
    )
    return { ...model, camera }
}

const wheelPan = (model: Model, event: WheelPan): Model => {
    const camera = multiplyMatrices(
        model.camera,
        translate(event.deltaX, event.deltaY)
    )
    return { ...model, camera }
}

const clickedInput = (
    model: Model,
    event: ClickedInput,
    generateUUID: GenerateUUID
): Model => selectInput(model, event.input, generateUUID)

const clickedOutput = (
    model: Model,
    event: ClickedOutput,
    generateUUID: GenerateUUID
): Model => selectOutput(model, event.output, generateUUID)

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
})

export const updateNumberText = (
    model: Model,
    body: UUID,
    transform: (text: string) => string
): Model => {
    return {
        ...model,
        graph: changeNumberText(model.graph, body, transform),
    }
}

interface AddNodeInputs {
    model: Model
    operation: Operation
    position: Position
    effects: Effects
    onTableUploaded: OnTableUploaded
}

interface AddNodeOutputs {
    model: Model
    node: UUID
}

export const addNodeToGraph = ({
    model,
    operation,
    position,
    effects,
    onTableUploaded,
}: AddNodeInputs): AddNodeOutputs => {
    const { graph, node } = addNode({
        graph: model.graph,
        operation,
        position,
        effects,
        onTableUploaded,
    })
    return {
        model: {
            ...model,
            graph,
            nodeOrder: [...model.nodeOrder, node],
        },
        node,
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
): Model => {
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
        ...model,
        graph: evaluateNode(graph, node),
    }
}

interface KeyDownProps {
    model: Model
    event: KeyDown
    effects: Effects
    onFinderInsert: (option: string) => void
    onFinderChange: (option: string, node: UUID) => void
    onFinderClose: () => void
    moveNode: () => void
    onPanCamera: () => void
    onZoomCamera: () => void
}

const keyDown = (props: KeyDownProps): Model => {
    const {
        model,
        event,
        effects,
        onFinderInsert,
        onFinderChange,
        onFinderClose,
        moveNode,
        onPanCamera,
        onZoomCamera,
    } = props
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
                    return {
                        ...model,
                        focus: {
                            ...focus,
                            finder: finder.update({
                                model: focus.finder,
                                event,
                                onSelect: onFinderInsert,
                                onClose: onFinderClose,
                            }),
                        },
                    }
                }
                case FocusKind.FINDER_CHANGE: {
                    return {
                        ...model,
                        focus: {
                            ...focus,
                            finder: finder.update({
                                model: focus.finder,
                                event,
                                onSelect: (option) =>
                                    onFinderChange(option, focus.node),
                                onClose: onFinderClose,
                            }),
                        },
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
                            return clearFocus(model)
                        default:
                            return maybeTriggerQuickSelect(model, focus, key)
                    }
                }
                case FocusKind.BODY_TEXT: {
                    const body = model.graph.bodys[focus.body]
                    switch (key) {
                        case "Enter":
                        case "Escape":
                        case "<c-Control>":
                            return clearFocus(model)
                        case "Shift":
                            return model
                        case "sft":
                            return {
                                ...model,
                                focus: {
                                    ...focus,
                                    uppercase: !focus.uppercase,
                                },
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
                            return openFinderInsert(model)
                        case "c":
                            return openFinderChange(model, focus.node)
                        case "d":
                        case "Backspace":
                        case "Delete":
                            return removeNodeFromGraph(model, focus.node)
                        case "Escape":
                            return clearFocus(model)
                        default:
                            const nextModel = maybeTriggerQuickSelect(
                                model,
                                focus,
                                key
                            )
                            return model !== nextModel
                                ? nextModel
                                : maybeStartMoveNode(
                                      nextModel,
                                      focus,
                                      key,
                                      currentTime,
                                      moveNode
                                  )
                    }
                case FocusKind.INPUT:
                    switch (key) {
                        case "f":
                            return openFinderInsert(model)
                        case "d":
                        case "Backspace":
                        case "Delete":
                            return clearFocus({
                                ...model,
                                graph: removeInputEdge(
                                    model.graph,
                                    focus.input
                                ),
                            })
                        case "Escape":
                            return clearFocus(model)
                        default:
                            return maybeTriggerQuickSelect(model, focus, key)
                    }
                case FocusKind.OUTPUT:
                    switch (key) {
                        case "f":
                            return openFinderInsert(model)
                        case "d":
                        case "Backspace":
                        case "Delete":
                            return clearFocus({
                                ...model,
                                graph: removeOutputEdges(
                                    model.graph,
                                    focus.output
                                ),
                            })
                        case "Escape":
                            return clearFocus(model)
                        default:
                            return maybeTriggerQuickSelect(model, focus, key)
                    }
                case FocusKind.NONE:
                    switch (key) {
                        case "f":
                            return openFinderInsert(model)
                        case "z":
                            return {
                                ...model,
                                camera: identity(),
                            }
                        default:
                            const nextModel = maybeTriggerQuickSelect(
                                model,
                                focus,
                                key
                            )
                            return nextModel !== model
                                ? nextModel
                                : maybeStartMoveCamera(
                                      nextModel,
                                      event,
                                      currentTime,
                                      onPanCamera,
                                      onZoomCamera
                                  )
                    }
            }
    }
}

const keyUp = (model: Model, event: KeyUp): Model => {
    switch (model.focus.kind) {
        case FocusKind.NONE:
            return maybeStopMoveCamera(model, event)
        case FocusKind.NODE:
            return maybeStopMoveNode(model, model.focus, event.key)
        default:
            return model
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

const clickedBody = (model: Model, { body }: ClickedBody): Model =>
    focusBody(clearFocus(model), body)

const clickedBackground = (
    model: Model,
    { count, position: { x, y } }: ClickedBackground
): Model => {
    if (model.focus.kind !== FocusKind.NONE) {
        return clearFocus(model)
    } else if (count === 2) {
        return openFinderInsert({
            ...model,
            nodePlacementLocation: { x, y, show: false },
        })
    } else {
        return model
    }
}

const draggedBackground = (model: Model, event: DraggedBackground): Model => {
    const camera = multiplyMatrices(model.camera, translate(-event.x, -event.y))
    return { ...model, camera }
}

const changeNode = (model: Model, { node }: ChangeNode): Model =>
    openFinderChange(model, node)

const deleteNode = (model: Model, { node }: DeleteNode): Model =>
    removeNodeFromGraph(model, node)

const deleteInputEdge = (model: Model, { input }: DeleteInputEdge): Model =>
    clearFocus({
        ...model,
        graph: removeInputEdge(model.graph, input),
    })

const deleteOutputEdges = (
    model: Model,
    { output }: DeleteOutputEdges
): Model =>
    clearFocus({
        ...model,
        graph: removeOutputEdges(model.graph, output),
    })

const resetCamera = (model: Model): Model => ({
    ...model,
    camera: identity(),
})

export const uploadTable = (
    model: Model,
    event: UploadTable,
    generateUUID: GenerateUUID
): Model => {
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
        ...model,
        graph: {
            ...model.graph,
            nodes: { ...model.graph.nodes, [node.uuid]: node },
            bodys: { ...model.graph.bodys, [body.uuid]: body },
            outputs: { ...model.graph.outputs, [output.uuid]: output },
        },
        nodeOrder: [...model.nodeOrder, node.uuid],
    }
}

export const uploadCsv = (model: Model, event: UploadCsv): Model => {
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
        ...model,
        graph: {
            ...model.graph,
            nodes: { ...model.graph.nodes, [node.uuid]: node },
            bodys: { ...model.graph.bodys, [body.uuid]: body },
        },
    }
}

export const finderInsert = (
    model: Model,
    event: FinderInsert,
    effects: Effects,
    onTableUploaded: (table: Table, node: UUID) => void
): Model => {
    const operation = model.operations[event.option]
    const [x, y, _] = multiplyMatrixVector(model.camera, [
        model.nodePlacementLocation.x,
        model.nodePlacementLocation.y,
        1,
    ])
    return clearFocus(
        addNodeToGraph({
            model,
            operation,
            position: { x, y },
            effects,
            onTableUploaded,
        }).model
    )
}

export const finderChange = (
    model: Model,
    event: FinderChange,
    generateUUID: GenerateUUID
): Model => {
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
                    return clearFocus({ ...model, graph: graph2 })
                case NodeKind.SOURCE:
                    return clearFocus(model)
            }
        default:
            return clearFocus(model)
    }
}

export const finderClose = (model: Model): Model => clearFocus(model)

export const update = (
    effects: Effects,
    model: Model,
    event: AppEvent,
    dispatch: Dispatch<AppEvent>
): Model => {
    const onPanCamera = () => {
        effects.showCursor(false)
        dispatch({ kind: EventKind.PAN_CAMERA })
    }
    const onZoomCamera = () => {
        effects.showCursor(false)
        dispatch({ kind: EventKind.ZOOM_CAMERA })
    }
    const panAfter = (ms: number) => {
        effects.setTimeout(() => dispatch({ kind: EventKind.PAN_CAMERA }), ms)
    }
    const zoomAfter = (ms: number) => {
        effects.setTimeout(() => dispatch({ kind: EventKind.ZOOM_CAMERA }), ms)
    }
    const moveNodeAfter = (ms: number) => {
        effects.setTimeout(() => dispatch({ kind: EventKind.MOVE_NODE }), ms)
    }
    const onTableUploaded = (table: Table, node: UUID) => {
        dispatch({ kind: EventKind.UPLOAD_CSV, table, node })
    }
    switch (event.kind) {
        case EventKind.POINTER_MOVE:
            return pointerMove(model, event, () => effects.showCursor(true))
        case EventKind.POINTER_DOWN:
            return pointerDown(model, event)
        case EventKind.POINTER_UP:
            return pointerUp(model, event)
        case EventKind.CLICKED_NODE:
            return clickedNode(model, event)
        case EventKind.DRAGGED_NODE:
            return draggedNode(model, event)
        case EventKind.WHEEL_ZOOM:
            return wheelZoom(model, event)
        case EventKind.WHEEL_PAN:
            return wheelPan(model, event)
        case EventKind.CLICKED_INPUT:
            return clickedInput(model, event, effects.generateUUID)
        case EventKind.CLICKED_OUTPUT:
            return clickedOutput(model, event, effects.generateUUID)
        case EventKind.KEYDOWN:
            return keyDown({
                model,
                event,
                effects,
                onFinderInsert: (option) =>
                    dispatch({ kind: EventKind.FINDER_INSERT, option }),
                onFinderChange: (option, node) =>
                    dispatch({ kind: EventKind.FINDER_CHANGE, option, node }),
                onFinderClose: () => dispatch({ kind: EventKind.FINDER_CLOSE }),
                moveNode: () => dispatch({ kind: EventKind.MOVE_NODE }),
                onPanCamera,
                onZoomCamera,
            })
        case EventKind.KEYUP:
            return keyUp(model, event)
        case EventKind.CLICKED_BODY:
            return clickedBody(model, event)
        case EventKind.CLICKED_BACKGROUND:
            return clickedBackground(model, event)
        case EventKind.DRAGGED_BACKGROUND:
            return draggedBackground(model, event)
        case EventKind.CHANGE_NODE:
            return changeNode(model, event)
        case EventKind.DELETE_NODE:
            return deleteNode(model, event)
        case EventKind.DELETE_INPUT_EDGE:
            return deleteInputEdge(model, event)
        case EventKind.DELETE_OUTPUT_EDGES:
            return deleteOutputEdges(model, event)
        case EventKind.PAN_CAMERA:
            return panCamera(model, effects.currentTime, panAfter)
        case EventKind.ZOOM_CAMERA:
            return zoomCamera(model, effects.currentTime, zoomAfter)
        case EventKind.RESET_CAMERA:
            return resetCamera(model)
        case EventKind.MOVE_NODE:
            return moveNode(model, effects.currentTime, moveNodeAfter)
        case EventKind.UPLOAD_TABLE:
            return uploadTable(model, event, effects.generateUUID)
        case EventKind.UPLOAD_CSV:
            return uploadCsv(model, event)
        case EventKind.FINDER_INSERT:
            return finderInsert(model, event, effects, onTableUploaded)
        case EventKind.FINDER_CHANGE:
            return finderChange(model, event, effects.generateUUID)
        case EventKind.FINDER_CLOSE:
            return finderClose(model)
        case EventKind.LOAD_DEMO_MODEL:
            return loadDemoModel(model, effects, onTableUploaded)
    }
}
