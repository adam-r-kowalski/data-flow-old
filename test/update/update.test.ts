import * as tf from "@tensorflow/tfjs"

import {
    addNodeToGraph,
    focusBody,
    openFinderInsert,
    update,
    updateBody,
    updateNumberText,
} from "../../src/update"
import { Model } from "../../src/model"
import { FocusKind } from "../../src/model/focus"
import { PointerActionKind } from "../../src/model/pointer_action"
import { Pointer } from "../../src/ui"
import { emptyModel } from "../../src/model/empty"
import { QuickSelectKind } from "../../src/model/quick_select"
import {
    defaultEffectModel,
    EffectModel,
    makeEffects,
    makeTracked,
    resetTracked,
} from "../mock_effects"
import { AppEvent, EventKind } from "../../src/event"
import { mockDocument } from "../../src/ui/mock"
import {
    BodyKind,
    NodeKind,
    NodeTransform,
    OperationKind,
    Operations,
    UUID,
} from "../../src/model/graph"
import { column, TensorFunc, tensorFunc } from "../../src/model/operations"
import { translate } from "../../src/linear_algebra/matrix3x3"
import {
    addEdge,
    changeNodePosition,
    OnTableUploaded,
} from "../../src/update/graph"
import { Table } from "../../src/model/table"

const addFunc = tensorFunc(tf.add)
const subFunc = tensorFunc(tf.sub)
const divFunc = tensorFunc(tf.div)
const sinFunc = tensorFunc(tf.sin)
const linspaceFunc = tensorFunc(tf.linspace as TensorFunc)

const model = emptyModel({ width: 500, height: 500 })

test("two pointers down on background starts zooming", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 },
    }
    const model1 = update(
        effects,
        model,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer0,
            count: 0,
        },
        dispatch
    )
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer1,
            count: 0,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model,
        pointers: [pointer0, pointer1],
        focus: {
            kind: FocusKind.NONE,
            pointerAction: {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 0, y: 0 },
                pointerDistance: 0,
            },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("double clicking background opens finder", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const model1 = update(
        effects,
        model,
        {
            kind: EventKind.CLICKED_BACKGROUND,
            count: 2,
            position: { x: 50, y: 50 },
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model,
        pointers: [],
        focus: {
            kind: FocusKind.FINDER_INSERT,
            finder: {
                search: "",
                options: [],
                selectedIndex: 0,
            },
            quickSelect: { kind: QuickSelectKind.NONE },
            uppercase: false,
        },
        nodePlacementLocation: { x: 50, y: 50, show: false },
    }
    expect(model1).toEqual(expectedModel)
})

test("clicking background then waiting too long cancels opens finder", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const model1 = update(
        effects,
        model,
        {
            kind: EventKind.CLICKED_BACKGROUND,
            count: 1,
            position: { x: 0, y: 0 },
        },
        dispatch
    )
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_BACKGROUND,
            count: 1,
            position: { x: 0, y: 0 },
        },
        dispatch
    )
    expect(model2).toEqual(model)
})

test("two pointers down then up puts you in pan mode", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 },
    }
    const model1 = update(
        effects,
        model,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer0,
            count: 0,
        },
        dispatch
    )
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer1,
            count: 0,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.POINTER_UP,
            pointer: pointer0,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        pointers: [pointer1],
    }
    expect(model3).toEqual(expectedModel)
})

test("pointer down when finder open tracks pointer", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const model0 = openFinderInsert(model)
    const pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const model1 = update(
        effects,
        model0,
        {
            kind: EventKind.POINTER_DOWN,
            pointer,
            count: 0,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model0,
        pointers: [pointer],
    }
    expect(model1).toEqual(expectedModel)
})

test("clicking node selects it and puts it on top of of the node order", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const onTableUploaded = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
        Sub: {
            kind: OperationKind.TRANSFORM,
            name: "Sub",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: subFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_NODE,
            node: node0,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model2,
        focus: {
            kind: FocusKind.NODE,
            node: node0,
            drag: true,
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        nodeOrder: [node1, node0],
    }
    expect(model3).toEqual(expectedModel)
})

test("pointer move before pointer down changes node placement location", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const model1 = update(
        effects,
        model,
        {
            kind: EventKind.POINTER_MOVE,
            pointer,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model,
        nodePlacementLocation: { x: 0, y: 0, show: false },
    }
    expect(model1).toEqual(expectedModel)
})

test("pointer move after pointer down pans camera", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const model1 = update(
        effects,
        model,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: {
                id: 0,
                position: { x: 0, y: 0 },
            },
            count: 0,
        },
        dispatch
    )
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_MOVE,
            pointer: {
                id: 0,
                position: { x: 50, y: 75 },
            },
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model,
        camera: translate(-50, -75),
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        pointers: [
            {
                id: 0,
                position: { x: 50, y: 75 },
            },
        ],
    }
    expect(model2).toEqual(expectedModel)
})

test("pointer move after clicking node pointer down drags node", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const onTableUploaded = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
        Sub: {
            kind: OperationKind.TRANSFORM,
            name: "Sub",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: subFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_NODE,
            node: node0,
        },
        dispatch
    )
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: {
                id: 0,
                position: { x: 0, y: 0 },
            },
            count: 0,
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.POINTER_MOVE,
            pointer: {
                id: 0,
                position: { x: 50, y: 75 },
            },
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model2,
        pointers: [
            {
                id: 0,
                position: { x: 50, y: 75 },
            },
        ],
        graph: changeNodePosition(model2.graph, node0, () => ({
            x: 50,
            y: 75,
        })),
        nodeOrder: [node1, node0],
        focus: {
            kind: FocusKind.NODE,
            node: node0,
            drag: true,
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model5).toEqual(expectedModel)
})

test("pointer move after clicking node, pointer down, then pointer up", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const onTableUploaded = () => {}
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_NODE,
            node: node0,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: {
                id: 0,
                position: { x: 0, y: 0 },
            },
            count: 0,
        },
        dispatch
    )
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.POINTER_UP,
            pointer: {
                id: 0,
                position: { x: 0, y: 0 },
            },
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.POINTER_MOVE,
            pointer: {
                id: 0,
                position: { x: 50, y: 75 },
            },
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model1,
        nodePlacementLocation: { x: 50, y: 75, show: false },
        focus: {
            kind: FocusKind.NODE,
            node: node0,
            drag: false,
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model5).toEqual(expectedModel)
})

test("mouse wheel zooms in camera relative to mouse position", () => {
    const dispatch = () => {}
    const effects = makeEffects(mockDocument())
    const model1 = update(
        effects,
        model,
        {
            kind: EventKind.WHEEL,
            deltaY: 10,
            position: { x: 50, y: 100 },
        },
        dispatch
    )
    const expectedModel = {
        ...model,
        camera: [
            1.0717734625362931, 0, -3.588673126814655, 0, 1.0717734625362931,
            -7.17734625362931, 0, 0, 1,
        ],
    }
    expect(model1).toEqual(expectedModel)
})

test("clicking input selects it", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const onTableUploaded = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const input = (model1.graph.nodes[node0] as NodeTransform).inputs[0]
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.INPUT,
            input,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("clicking new input selects it and deselects old input", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const onTableUploaded = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const [input0, input1] = (model1.graph.nodes[node0] as NodeTransform).inputs
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_INPUT,
            input: input0,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_INPUT,
            input: input1,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.INPUT,
            input: input1,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model3).toEqual(expectedModel)
})

test("clicking output after clicking input adds connection", () => {
    const effectModel: EffectModel = { uuid: 0, time: 0 }
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
        Sub: {
            kind: OperationKind.TRANSFORM,
            name: "Sub",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: subFunc,
        },
    }
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const input = (model2.graph.nodes[node0] as NodeTransform).inputs[0]
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const output = model3.graph.nodes[node1].outputs[0]
    const newEffectModel = { ...effectModel }
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model2,
        graph: addEdge({
            graph: model2.graph,
            input,
            output,
            generateUUID: makeEffects(document, newEffectModel).generateUUID,
        }).graph,
    }
    expect(model4).toEqual(expectedModel)
})

test("clicking output selects it", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const output = model1.graph.nodes[node0].outputs[0]
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.OUTPUT,
            output,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("clicking new output selects it and deselects old output", () => {
    const effects = makeEffects(mockDocument())
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const [output0, output1] = model1.graph.nodes[node0].outputs
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: output0,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: output1,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.OUTPUT,
            output: output1,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model3).toEqual(expectedModel)
})

test("clicking input after clicking output adds connection", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
        Sub: {
            kind: OperationKind.TRANSFORM,
            name: "Sub",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: subFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const output = model2.graph.nodes[node1].outputs[0]
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const newEffectModel = { ...effectModel }
    const input = (model3.graph.nodes[node0] as NodeTransform).inputs[0]
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model2,
        graph: addEdge({
            graph: model2.graph,
            input,
            output,
            generateUUID: makeEffects(document, newEffectModel).generateUUID,
        }).graph,
    }
    expect(model4).toEqual(expectedModel)
})

test("double click opens finder", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
        Sub: {
            kind: OperationKind.TRANSFORM,
            name: "Sub",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: subFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const model1 = update(
        effects,
        model0,
        {
            kind: EventKind.CLICKED_BACKGROUND,
            count: 2,
            position: { x: 50, y: 50 },
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.FINDER_INSERT,
            finder: {
                search: "",
                options: ["Add", "Sub"],
                selectedIndex: 0,
            },
            quickSelect: { kind: QuickSelectKind.NONE },
            uppercase: false,
        },
        nodePlacementLocation: { x: 50, y: 50, show: false },
    }
    expect(model1).toEqual(expectedModel)
})

test("f key down when finder is not shown opens finder", () => {
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
        Sub: {
            kind: OperationKind.TRANSFORM,
            name: "Sub",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: subFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const model1 = update(
        makeEffects(mockDocument()),
        model0,
        {
            kind: EventKind.KEYDOWN,
            key: "f",
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.FINDER_INSERT,
            finder: {
                search: "",
                options: ["Add", "Sub"],
                selectedIndex: 0,
            },
            quickSelect: { kind: QuickSelectKind.NONE },
            uppercase: false,
        },
    }
    expect(model1).toEqual(expectedModel)
})

test("clicking a finder option adds node to graph", () => {
    const dispatch = () => {}
    const onTableUploaded = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
        Sub: {
            kind: OperationKind.TRANSFORM,
            name: "Sub",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: subFunc,
        },
    }
    const model0 = openFinderInsert({ ...model, operations })
    const document = mockDocument()
    const model1 = update(
        makeEffects(document),
        model0,
        {
            kind: EventKind.FINDER_INSERT,
            option: "Add",
        },
        dispatch
    )
    const { model: expectedModel } = addNodeToGraph({
        model: { ...model, operations },
        position: { x: 250, y: 250 },
        operation: operations["Add"],
        effects: makeEffects(document),
        onTableUploaded,
    })
    expect(model1).toEqual(expectedModel)
})

test("pressing number on keyboard appends to number node", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of "1234567890") {
        model2 = update(
            effects,
            model2,
            {
                kind: EventKind.KEYDOWN,
                key,
            },
            dispatch
        )
    }
    const body = makeEffects(document, {
        ...effectModel,
        uuid: effectModel.uuid - 1,
    }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY_NUMBER,
            body,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: 1234567890,
                    text: "1234567890",
                },
            },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing -3.14 on keyboard writes a float for the number", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of "-3.14") {
        model2 = update(
            effects,
            model2,
            {
                kind: EventKind.KEYDOWN,
                key,
            },
            dispatch
        )
    }
    const body = makeEffects(document, {
        ...effectModel,
        uuid: effectModel.uuid - 1,
    }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY_NUMBER,
            body,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: -3.14,
                    text: "-3.14",
                },
            },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing -3.1.4 on keyboard ignores the second decimal", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of "-3.1.4") {
        model2 = update(
            effects,
            model2,
            {
                kind: EventKind.KEYDOWN,
                key,
            },
            dispatch
        )
    }
    const body = makeEffects(document, {
        ...effectModel,
        uuid: effectModel.uuid - 1,
    }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY_NUMBER,
            body,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: -3.14,
                    text: "-3.14",
                },
            },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing backspace on keyboard deletes from number node", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of "1234567890") {
        model2 = update(
            effects,
            model2,
            {
                kind: EventKind.KEYDOWN,
                key,
            },
            dispatch
        )
    }
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "Backspace",
        },
        dispatch
    )
    const body = makeEffects(document, {
        ...effectModel,
        uuid: effectModel.uuid - 1,
    }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY_NUMBER,
            body,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: 123456789,
                    text: "123456789",
                },
            },
        },
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing backspace when number node value is 0 has no effect", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (let i = 0; i < 3; ++i) {
        model2 = update(
            effects,
            model1,
            {
                kind: EventKind.KEYDOWN,
                key: "Backspace",
            },
            dispatch
        )
    }
    const body = makeEffects(document, {
        ...effectModel,
        uuid: effectModel.uuid - 1,
    }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY_NUMBER,
            body,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: 0,
                    text: "0",
                },
            },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing enter on keyboard while editing number node exits virtual keyboard", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of "1234567890") {
        model2 = update(
            effects,
            model2,
            {
                kind: EventKind.KEYDOWN,
                key,
            },
            dispatch
        )
    }
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "Enter",
        },
        dispatch
    )
    const body = makeEffects(document, {
        ...effectModel,
        uuid: effectModel.uuid - 1,
    }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: 1234567890,
                    text: "1234567890",
                },
            },
        },
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing non number on keyboard while editing number node is ignored", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body)
    let model2 = model1
    for (const key of "qwertyuiopasdfghjklzxvbnm") {
        model2 = update(
            effects,
            model2,
            {
                kind: EventKind.KEYDOWN,
                key,
            },
            dispatch
        )
    }
    const body = makeEffects(document, {
        ...effectModel,
        uuid: effectModel.uuid - 1,
    }).generateUUID()
    const expectedModel: Model = {
        ...model1,
        operations,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: 0,
                    text: "0",
                },
            },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing - on keyboard while editing number node makes the number negative", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model1 = updateNumberText(
        model0,
        model0.graph.nodes[node].body,
        () => "10"
    )
    const model2 = focusBody(model1, model1.graph.nodes[node].body!)
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "-",
        },
        dispatch
    )
    const body = makeEffects(document, {
        ...effectModel,
        uuid: effectModel.uuid - 1,
    }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: -10,
                    text: "-10",
                },
            },
        },
        focus: {
            kind: FocusKind.BODY_NUMBER,
            body,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing + on keyboard while editing number node makes the number negative", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model1 = updateNumberText(
        model0,
        model0.graph.nodes[node].body,
        () => "-10"
    )
    const model2 = focusBody(model1, model1.graph.nodes[node].body!)
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "+",
        },
        dispatch
    )
    const body = makeEffects(document, {
        ...effectModel,
        uuid: effectModel.uuid - 1,
    }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: 10,
                    text: "10",
                },
            },
        },
        focus: {
            kind: FocusKind.BODY_NUMBER,
            body,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing c on keyboard while editing number node makes the number 0", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.KEYDOWN,
            key: "c",
        },
        dispatch
    )
    const body = makeEffects(document, {
        ...effectModel,
        uuid: effectModel.uuid - 1,
    }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: 0,
                    text: "0",
                },
            },
        },
        focus: {
            kind: FocusKind.BODY_NUMBER,
            body,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("clicking a number node opens the numeric keyboard", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model0.graph.nodes[node].body!
    const model1 = update(
        effects,
        model0,
        {
            kind: EventKind.CLICKED_BODY,
            body,
        },
        dispatch
    )
    const expectedModel = focusBody(model0, body)
    expect(model1).toEqual(expectedModel)
})

test("clicking a number node when another number node is selected switches selections", () => {
    const effects = makeEffects(mockDocument())
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const { model: model0, node: node0 } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model1, node: node1 } = addNodeToGraph({
        model: model0,
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body0 = model1.graph.nodes[node0].body!
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_BODY,
            body: body0,
        },
        dispatch
    )
    const body1 = model2.graph.nodes[node1].body!
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_BODY,
            body: body1,
        },
        dispatch
    )
    const expectedModel = focusBody(model1, body1)
    expect(model3).toEqual(expectedModel)
})

test("clicking background when a number node is selected deselects it", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model0.graph.nodes[node].body!
    const model1 = update(
        effects,
        model0,
        {
            kind: EventKind.CLICKED_BODY,
            body,
        },
        dispatch
    )
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_BACKGROUND,
            count: 1,
            position: { x: 0, y: 0 },
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing Escape when a number node is selected deselects it", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model0.graph.nodes[node].body!
    const model1 = update(
        effects,
        model0,
        {
            kind: EventKind.CLICKED_BODY,
            body,
        },
        dispatch
    )
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.KEYDOWN,
            key: "Escape",
        },
        dispatch
    )
    expect(model2).toEqual(model0)
})

test("clicking input when a number node is selected deselects it and selects input", () => {
    const effects = makeEffects(mockDocument())
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const { model: model0, node: number } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model1, node: add } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model1.graph.nodes[number].body!
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_BODY,
            body,
        },
        dispatch
    )
    const input = (model2.graph.nodes[add] as NodeTransform).inputs[0]
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.INPUT,
            input,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model3).toEqual(expectedModel)
})

test("clicking output when a number node is selected deselects it and selects output", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model0.graph.nodes[node].body!
    const model1 = update(
        effects,
        model0,
        {
            kind: EventKind.CLICKED_BODY,
            body,
        },
        dispatch
    )
    const output = model0.graph.nodes[node].outputs[0]
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.OUTPUT,
            output,
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("clicking node when a number node is selected deselects it and selects node", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Number: {
            kind: OperationKind.NUMBER,
            name: "Number",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model0.graph.nodes[node].body!
    const model1 = update(
        effects,
        model0,
        {
            kind: EventKind.CLICKED_BODY,
            body,
        },
        dispatch
    )
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_NODE,
            node,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.NODE,
            node,
            drag: true,
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("zooming", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 10, y: 10 },
    }
    const pointer2: Pointer = {
        id: 1,
        position: { x: 20, y: 20 },
    }
    const pointer3: Pointer = {
        id: 1,
        position: { x: 30, y: 30 },
    }
    const model1 = update(
        effects,
        model,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer0,
            count: 0,
        },
        dispatch
    )
    const expectedModel0: Model = {
        ...model,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        pointers: [pointer0],
    }
    expect(model1).toEqual(expectedModel0)
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer1,
            count: 0,
        },
        dispatch
    )
    const expectedModel1: Model = {
        ...model,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 0, y: 0 },
                pointerDistance: 0,
            },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        pointers: [pointer0, pointer1],
    }
    expect(model2).toEqual(expectedModel1)
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.POINTER_MOVE,
            pointer: pointer2,
        },
        dispatch
    )
    const expectedModel2: Model = {
        ...model,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 10, y: 10 },
                pointerDistance: Math.sqrt(Math.pow(20, 2) + Math.pow(20, 2)),
            },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        pointers: [pointer0, pointer2],
    }
    expect(model3).toEqual(expectedModel2)
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.POINTER_MOVE,
            pointer: pointer3,
        },
        dispatch
    )
    const expectedModel3: Model = {
        ...model,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 15, y: 15 },
                pointerDistance: Math.sqrt(Math.pow(30, 2) + Math.pow(30, 2)),
            },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        pointers: [pointer0, pointer3],
        camera: [
            0.906625499506728, 0, -3.13250999013456, 0, 0.906625499506728,
            -3.13250999013456, 0, 0, 1,
        ],
    }
    expect(model4).toEqual(expectedModel3)
})

test("pressing d on keyboard with node selected deletes it", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_NODE,
            node,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "d",
        },
        dispatch
    )
    expect(model3).toEqual(model0)
})

test("clicking background when a node is selected deselects it", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_NODE,
            node,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_BACKGROUND,
            count: 1,
            position: { x: 0, y: 0 },
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        pointers: [],
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing escape when a node is selected deselects it", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_NODE,
            node,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "Escape",
        },
        dispatch
    )
    expect(model3).toEqual(model1)
})

test("clicking background when a input is selected deselects it", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const input = (model1.graph.nodes[node] as NodeTransform).inputs[0]
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_BACKGROUND,
            count: 1,
            position: { x: 0, y: 0 },
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing escape when a input is selected deselects it", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const input = (model1.graph.nodes[node] as NodeTransform).inputs[0]
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "Escape",
        },
        dispatch
    )
    expect(model3).toEqual(model1)
})

test("clicking background when a output is selected deselects it", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const output = model1.graph.nodes[node].outputs[0]
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_BACKGROUND,
            count: 1,
            position: { x: 0, y: 0 },
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing escape when a output is selected deselects it", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const output = model1.graph.nodes[node].outputs[0]
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "Escape",
        },
        dispatch
    )
    expect(model3).toEqual(model1)
})

test("delete node", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.DELETE_NODE,
            node,
        },
        dispatch
    )
    expect(model2).toEqual(model0)
})

test("delete input edge", () => {
    const effects = makeEffects(mockDocument())
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
        Sub: {
            kind: OperationKind.TRANSFORM,
            name: "Sub",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: subFunc,
        },
    }
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const input = (model2.graph.nodes[node0] as NodeTransform).inputs[0]
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const output = model3.graph.nodes[node1].outputs[0]
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.DELETE_INPUT_EDGE,
            input,
        },
        dispatch
    )
    expect(model5).toEqual(model2)
})

test("pressing d on keyboard with input selected delete edge attached", () => {
    const effects = makeEffects(mockDocument())
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
        Sub: {
            kind: OperationKind.TRANSFORM,
            name: "Sub",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: subFunc,
        },
    }
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const input = (model2.graph.nodes[node0] as NodeTransform).inputs[0]
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const output = model3.graph.nodes[node1].outputs[0]
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.KEYDOWN,
            key: "d",
        },
        dispatch
    )
    expect(model6).toEqual(model2)
})

test("delete output edges", () => {
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const effects = makeEffects(mockDocument())
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
        Sub: {
            kind: OperationKind.TRANSFORM,
            name: "Sub",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: subFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const [input0, input1] = (model2.graph.nodes[node0] as NodeTransform).inputs
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_INPUT,
            input: input0,
        },
        dispatch
    )
    const output = model3.graph.nodes[node1].outputs[0]
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.CLICKED_INPUT,
            input: input1,
        },
        dispatch
    )
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const model7 = update(
        effects,
        model6,
        {
            kind: EventKind.DELETE_OUTPUT_EDGES,
            output,
        },
        dispatch
    )
    expect(model7).toEqual(model2)
})

test("pressing d on keyboard with output selected delete edges attached", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
        Sub: {
            kind: OperationKind.TRANSFORM,
            name: "Sub",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: subFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const [input0, input1] = (model2.graph.nodes[node0] as NodeTransform).inputs
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_INPUT,
            input: input0,
        },
        dispatch
    )
    const output = model3.graph.nodes[node1].outputs[0]
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.CLICKED_INPUT,
            input: input1,
        },
        dispatch
    )
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const model7 = update(
        effects,
        model6,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const model8 = update(
        effects,
        model7,
        {
            kind: EventKind.KEYDOWN,
            key: "d",
        },
        dispatch
    )
    expect(model8).toEqual(model2)
})

test("connecting output of same node where input is selected is not allowed", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const input = (model1.graph.nodes[node0] as NodeTransform).inputs[0]
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const output = model2.graph.nodes[node0].outputs[0]
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    expect(model3).toEqual(model2)
})

test("connecting input of same node where output is selected is not allowed", () => {
    const effects = makeEffects(mockDocument())
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
    }
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const output = model1.graph.nodes[node0].outputs[0]
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output,
        },
        dispatch
    )
    const input = (model1.graph.nodes[node0] as NodeTransform).inputs[0]
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    expect(model3).toEqual(model2)
})

test("connecting output to input if input already has edge replaces it", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
        Sub: {
            kind: OperationKind.TRANSFORM,
            name: "Sub",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: subFunc,
        },
        Div: {
            kind: OperationKind.TRANSFORM,
            name: "Div",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: divFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model3, node: node2 } = addNodeToGraph({
        model: model2,
        operation: operations["Div"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const input = (model3.graph.nodes[node0] as NodeTransform).inputs[0]
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const output0 = model4.graph.nodes[node1].outputs[0]
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: output0,
        },
        dispatch
    )
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const output1 = model6.graph.nodes[node2].outputs[0]
    const model7 = update(
        effects,
        model6,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: output1,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model3,
        graph: addEdge({
            graph: model3.graph,
            input,
            output: output1,
            generateUUID: makeEffects(document, {
                ...effectModel,
                uuid: effectModel.uuid - 1,
            }).generateUUID,
        }).graph,
    }
    expect(model7).toEqual(expectedModel)
})

test("connecting input to output if input already has edge replaces it", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Add: {
            kind: OperationKind.TRANSFORM,
            name: "Add",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: addFunc,
        },
        Sub: {
            kind: OperationKind.TRANSFORM,
            name: "Sub",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: subFunc,
        },
        Div: {
            kind: OperationKind.TRANSFORM,
            name: "Div",
            inputs: ["x", "y"],
            outputs: ["out"],
            func: divFunc,
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model3, node: node2 } = addNodeToGraph({
        model: model2,
        operation: operations["Div"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const input = (model3.graph.nodes[node0] as NodeTransform).inputs[0]
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const output0 = model4.graph.nodes[node1].outputs[0]
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: output0,
        },
        dispatch
    )
    const output1 = model5.graph.nodes[node2].outputs[0]
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: output1,
        },
        dispatch
    )
    const model7 = update(
        effects,
        model6,
        {
            kind: EventKind.CLICKED_INPUT,
            input,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model3,
        graph: addEdge({
            graph: model3.graph,
            input,
            output: output1,
            generateUUID: makeEffects(document, {
                ...effectModel,
                uuid: effectModel.uuid - 1,
            }).generateUUID,
        }).graph,
    }
    expect(model7).toEqual(expectedModel)
})

test("three pointers down then one up doesn't change state", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 },
    }
    const pointer2: Pointer = {
        id: 2,
        position: { x: 0, y: 0 },
    }
    const model1 = update(
        effects,
        model,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer0,
            count: 0,
        },
        dispatch
    )
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer1,
            count: 0,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer2,
            count: 0,
        },
        dispatch
    )
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.POINTER_UP,
            pointer: pointer2,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model,
        pointers: [pointer0, pointer1],
    }
    expect(model4).toEqual(expectedModel)
})

test("three pointers down on node then one up keeps state dragging", () => {
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const effects = makeEffects(mockDocument())
    const model0: Model = {
        ...model,
        operations: {
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
        },
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Add"],
        position: { x: 250, y: 250 },
        effects,
        onTableUploaded,
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 },
    }
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer0,
            count: 0,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_NODE,
            node,
        },
        dispatch
    )
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer1,
            count: 0,
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.CLICKED_NODE,
            node,
        },
        dispatch
    )
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.POINTER_UP,
            pointer: pointer1,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NODE,
            node,
            drag: true,
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        pointers: [pointer0],
    }
    expect(model6).toEqual(expectedModel)
})

test("pointer move when input selected updates node placement location", () => {
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const effects = makeEffects(mockDocument())
    const model0: Model = {
        ...model,
        operations: {
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
        },
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer0,
            count: 0,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model2.graph.nodes[node] as NodeTransform).inputs[0],
        },
        dispatch
    )
    const pointer1: Pointer = {
        id: 0,
        position: { x: 50, y: 50 },
    }
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.POINTER_MOVE,
            pointer: pointer1,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model3,
        nodePlacementLocation: { x: 50, y: 50, show: false },
        pointers: [pointer1],
    }
    expect(model4).toEqual(expectedModel)
})

test("pointer move when output selected updates node placement location", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const model0: Model = {
        ...model,
        operations: {
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
        },
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer0,
            count: 0,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model2.graph.nodes[node].outputs[0],
        },
        dispatch
    )
    const pointer1: Pointer = {
        id: 0,
        position: { x: 50, y: 50 },
    }
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.POINTER_MOVE,
            pointer: pointer1,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model3,
        nodePlacementLocation: { x: 50, y: 50, show: false },
        pointers: [pointer1],
    }
    expect(model4).toEqual(expectedModel)
})

test("pointer move when body selected updates node placement location", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const model0: Model = {
        ...model,
        operations: {
            Number: {
                kind: OperationKind.NUMBER,
                name: "Number",
                outputs: ["out"],
            },
        },
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer0,
            count: 0,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_BODY,
            body: model2.graph.nodes[node].body!,
        },
        dispatch
    )
    const pointer1: Pointer = {
        id: 0,
        position: { x: 50, y: 50 },
    }
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.POINTER_MOVE,
            pointer: pointer1,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model3,
        nodePlacementLocation: { x: 50, y: 50, show: false },
        pointers: [pointer1],
    }
    expect(model4).toEqual(expectedModel)
})

test("pressing f with node selected opens finder", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const model0: Model = {
        ...model,
        operations: {
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
        },
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer0,
            count: 0,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_NODE,
            node,
        },
        dispatch
    )
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.POINTER_UP,
            pointer: pointer0,
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.KEYDOWN,
            key: "f",
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model4,
        focus: {
            kind: FocusKind.FINDER_INSERT,
            finder: {
                search: "",
                options: ["Add"],
                selectedIndex: 0,
            },
            quickSelect: { kind: QuickSelectKind.NONE },
            uppercase: false,
        },
    }
    expect(model5).toEqual(expectedModel)
})

test("pressing f with input selected opens finder", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const model0: Model = {
        ...model,
        operations: {
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
        },
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer0,
            count: 0,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model2.graph.nodes[node] as NodeTransform).inputs[0],
        },
        dispatch
    )
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.POINTER_UP,
            pointer: pointer0,
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.KEYDOWN,
            key: "f",
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model4,
        focus: {
            kind: FocusKind.FINDER_INSERT,
            finder: {
                search: "",
                options: ["Add"],
                selectedIndex: 0,
            },
            quickSelect: { kind: QuickSelectKind.NONE },
            uppercase: false,
        },
    }
    expect(model5).toEqual(expectedModel)
})

test("pressing f with output selected opens finder", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const model0: Model = {
        ...model,
        operations: {
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
        },
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer0,
            count: 0,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model2.graph.nodes[node].outputs[0],
        },
        dispatch
    )
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.POINTER_UP,
            pointer: pointer0,
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.KEYDOWN,
            key: "f",
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model4,
        focus: {
            kind: FocusKind.FINDER_INSERT,
            finder: {
                search: "",
                options: ["Add"],
                selectedIndex: 0,
            },
            quickSelect: { kind: QuickSelectKind.NONE },
            uppercase: false,
        },
    }
    expect(model5).toEqual(expectedModel)
})

test("key up with input selected does nothing", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const model0: Model = {
        ...model,
        operations: {
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
        },
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer0,
            count: 0,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model2.graph.nodes[node] as NodeTransform).inputs[0],
        },
        dispatch
    )
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.POINTER_UP,
            pointer: pointer0,
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.KEYDOWN,
            key: "z",
        },
        dispatch
    )
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.KEYUP,
            key: "z",
        },
        dispatch
    )
    expect(model6).toEqual(model4)
})

test("clicking background with finder open closes it", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const model1 = update(
        effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "f",
        },
        dispatch
    )
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_BACKGROUND,
            count: 1,
            position: { x: 0, y: 0 },
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model,
    }
    expect(model2).toEqual(expectedModel)
})

test("pointer move after moving with keyboard stops showing node placement location", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const model1 = update(
        effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "h",
        },
        dispatch
    )
    expect(model1).toEqual({
        ...model,
        nodePlacementLocation: { x: 250, y: 250, show: true },
        panCamera: { left: true, up: false, down: false, right: false, now: 0 },
    })
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.POINTER_MOVE,
            pointer,
        },
        dispatch
    )
    expect(model2).toEqual({
        ...model1,
        nodePlacementLocation: { x: 0, y: 0, show: false },
    })
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.POINTER_MOVE,
            pointer,
        },
        dispatch
    )
    expect(model3).toEqual(model2)
})

test("update body", () => {
    const onTableUploaded = () => {}
    const effects = makeEffects(mockDocument())
    const model0: Model = {
        ...model,
        operations: {
            Number: {
                kind: OperationKind.NUMBER,
                name: "Number",
                outputs: ["out"],
            },
        },
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model1.graph.nodes[node].body
    const model2 = updateBody(model1, body, (number) => ({
        ...number,
        kind: BodyKind.NUMBER,
        value: 10,
        text: "10",
    }))
    const expectedModel: Model = {
        ...model1,
        graph: {
            ...model1.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: 10,
                    text: "10",
                },
            },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing any alphanumeric key while editing text node appends key to value", () => {
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const document = mockDocument()
    const effectModel = defaultEffectModel()
    const effects = makeEffects(document, effectModel)
    const operations: Operations = {
        Text: {
            kind: OperationKind.TEXT,
            name: "Text",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Text"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of "qwertyuiopasdfghjklzxcvbnm1234567890") {
        model3 = update(
            effects,
            model3,
            {
                kind: EventKind.KEYDOWN,
                key: key,
            },
            dispatch
        )
    }
    const expectedModel: Model = {
        ...model0,
        operations,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.TEXT,
                    uuid: body,
                    node,
                    value: "qwertyuiopasdfghjklzxcvbnm1234567890",
                },
            },
        },
        focus: {
            kind: FocusKind.BODY_TEXT,
            body,
            quickSelect: { kind: QuickSelectKind.NONE },
            uppercase: false,
        },
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing backspace while editing text node removes letter from value", () => {
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const operations: Operations = {
        Text: {
            kind: OperationKind.TEXT,
            name: "Text",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Text"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of "qwerty") {
        model3 = update(
            effects,
            model3,
            {
                kind: EventKind.KEYDOWN,
                key: key,
            },
            dispatch
        )
    }
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.KEYDOWN,
            key: "Backspace",
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model0,
        operations,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.TEXT,
                    uuid: body,
                    node,
                    value: "qwert",
                },
            },
        },
        focus: {
            kind: FocusKind.BODY_TEXT,
            body,
            quickSelect: { kind: QuickSelectKind.NONE },
            uppercase: false,
        },
    }
    expect(model4).toEqual(expectedModel)
})

test("pressing enter while editing text node clears the focus", () => {
    const document = mockDocument()
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const effectModel = defaultEffectModel()
    const effects = makeEffects(document, effectModel)
    const operations: Operations = {
        Text: {
            kind: OperationKind.TEXT,
            name: "Text",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Text"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of "qwerty") {
        model3 = update(
            effects,
            model3,
            {
                kind: EventKind.KEYDOWN,
                key: key,
            },
            dispatch
        )
    }
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.KEYDOWN,
            key: "Enter",
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model0,
        operations,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.TEXT,
                    uuid: body,
                    node,
                    value: "qwerty",
                },
            },
        },
    }
    expect(model4).toEqual(expectedModel)
})

test("pressing escape while editing text node clears the focus", () => {
    const effectModel = defaultEffectModel()
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const operations: Operations = {
        Text: {
            kind: OperationKind.TEXT,
            name: "Text",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Text"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of "qwerty") {
        model3 = update(
            effects,
            model3,
            {
                kind: EventKind.KEYDOWN,
                key: key,
            },
            dispatch
        )
    }
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.KEYDOWN,
            key: "Escape",
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model0,
        operations,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.TEXT,
                    uuid: body,
                    node,
                    value: "qwerty",
                },
            },
        },
    }
    expect(model4).toEqual(expectedModel)
})

test("pressing shift while editing text node does nothing", () => {
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const operations: Operations = {
        Text: {
            kind: OperationKind.TEXT,
            name: "Text",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Text"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of "qwerty") {
        model3 = update(
            effects,
            model3,
            {
                kind: EventKind.KEYDOWN,
                key: key,
            },
            dispatch
        )
    }
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.KEYDOWN,
            key: "Shift",
        },
        dispatch
    )
    expect(model4).toEqual(model3)
})

test("upload table", () => {
    const dispatch = () => {}
    const table: Table = {
        name: "table.csv",
        columns: {
            a: [1, 2, 3],
            b: [4, 5, 6],
        },
    }
    const model1 = update(
        makeEffects(mockDocument()),
        model,
        {
            kind: EventKind.UPLOAD_TABLE,
            table,
            position: { x: 0, y: 0 },
        },
        dispatch
    )
    const generateUUID = makeEffects(mockDocument()).generateUUID
    const node = generateUUID()
    const output = generateUUID()
    const body = generateUUID()
    const expectedModel: Model = {
        ...model,
        graph: {
            nodes: {
                [node]: {
                    kind: NodeKind.SOURCE,
                    uuid: node,
                    name: "table.csv",
                    outputs: [output],
                    body,
                    position: { x: 0, y: 0 },
                },
            },
            inputs: {},
            bodys: {
                [body]: {
                    kind: BodyKind.TABLE,
                    uuid: body,
                    node,
                    value: table,
                },
            },
            outputs: {
                [output]: {
                    uuid: output,
                    node,
                    name: "table",
                    edges: [],
                },
            },
            edges: {},
        },
        nodeOrder: [node],
    }
    expect(model1).toEqual(expectedModel)
})

test("pressing c with node selected opens finder in change mode", () => {
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const effects = makeEffects(mockDocument())
    const model0: Model = {
        ...model,
        operations: {
            Number: {
                kind: OperationKind.NUMBER,
                name: "Number",
                outputs: ["out"],
            },
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
            Sub: {
                kind: OperationKind.TRANSFORM,
                name: "Sub",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: subFunc,
            },
        },
    }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model3.graph.nodes[x].outputs[0],
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
        },
        dispatch
    )
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model5.graph.nodes[y].outputs[0],
        },
        dispatch
    )
    const model7 = update(
        effects,
        model6,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
        },
        dispatch
    )
    const model8 = update(
        effects,
        model7,
        {
            kind: EventKind.CLICKED_NODE,
            node: add,
        },
        dispatch
    )
    const model9 = update(
        effects,
        model8,
        {
            kind: EventKind.KEYDOWN,
            key: "c",
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model7,
        focus: {
            kind: FocusKind.FINDER_CHANGE,
            finder: {
                search: "",
                options: ["Number", "Add", "Sub"],
                selectedIndex: 0,
            },
            node: add,
            quickSelect: { kind: QuickSelectKind.NONE },
            uppercase: false,
        },
    }
    expect(model9).toEqual(expectedModel)
})

test("pressing change node context menu with node selected opens finder in change mode", () => {
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const effects = makeEffects(mockDocument())
    const model0: Model = {
        ...model,
        operations: {
            Number: {
                kind: OperationKind.NUMBER,
                name: "Number",
                outputs: ["out"],
            },
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
            Sub: {
                kind: OperationKind.TRANSFORM,
                name: "Sub",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: subFunc,
            },
        },
    }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model3.graph.nodes[x].outputs[0],
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
        },
        dispatch
    )
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model5.graph.nodes[y].outputs[0],
        },
        dispatch
    )
    const model7 = update(
        effects,
        model6,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
        },
        dispatch
    )
    const model8 = update(
        effects,
        model7,
        {
            kind: EventKind.CLICKED_NODE,
            node: add,
        },
        dispatch
    )
    const model9 = update(
        effects,
        model8,
        {
            kind: EventKind.CHANGE_NODE,
            node: add,
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model7,
        focus: {
            kind: FocusKind.FINDER_CHANGE,
            finder: {
                search: "",
                options: ["Number", "Add", "Sub"],
                selectedIndex: 0,
            },
            node: add,
            quickSelect: { kind: QuickSelectKind.NONE },
            uppercase: false,
        },
    }
    expect(model9).toEqual(expectedModel)
})

test("pressing enter with finder in change mode replaces node but preserves inputs and outputs", () => {
    let tracked = makeTracked()
    const onTableUploaded = () => {}
    const model0: Model = {
        ...model,
        operations: {
            Number: {
                kind: OperationKind.NUMBER,
                name: "Number",
                outputs: ["out"],
            },
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
            Sub: {
                kind: OperationKind.TRANSFORM,
                name: "Sub",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: subFunc,
            },
        },
    }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const model4 = update(
        tracked.effects,
        model3,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model3.graph.nodes[x].outputs[0],
        },
        tracked.dispatch
    )
    const model5 = update(
        tracked.effects,
        model4,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
        },
        tracked.dispatch
    )
    const model6 = update(
        tracked.effects,
        model5,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model5.graph.nodes[y].outputs[0],
        },
        tracked.dispatch
    )
    const model7 = update(
        tracked.effects,
        model6,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
        },
        tracked.dispatch
    )
    const model8 = update(
        tracked.effects,
        model7,
        {
            kind: EventKind.CLICKED_NODE,
            node: add,
        },
        tracked.dispatch
    )
    const model9 = update(
        tracked.effects,
        model8,
        {
            kind: EventKind.KEYDOWN,
            key: "c",
        },
        tracked.dispatch
    )
    let model10 = model9
    for (const key of "Sub") {
        model10 = update(
            tracked.effects,
            model10,
            {
                kind: EventKind.KEYDOWN,
                key: key,
            },
            tracked.dispatch
        )
    }
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model11 = update(
        tracked.effects,
        model10,
        {
            kind: EventKind.KEYDOWN,
            key: "Enter",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([
        { kind: EventKind.FINDER_CHANGE, option: "Sub", node: add },
    ])
    expect(tracked.times).toEqual([])
    const model12 = update(
        tracked.effects,
        model11,
        tracked.events[0],
        tracked.dispatch
    )
    const node = model7.graph.nodes[add] as NodeTransform
    const expectedModel: Model = {
        ...model7,
        graph: {
            ...model7.graph,
            nodes: {
                ...model7.graph.nodes,
                [node.uuid]: {
                    ...node,
                    name: "Sub",
                    func: subFunc,
                },
            },
        },
    }
    expect(model12).toEqual(expectedModel)
})

test("cllicking finder option with finder in change mode replaces node but preserves inputs and outputs", () => {
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const effects = makeEffects(mockDocument())
    const model0: Model = {
        ...model,
        operations: {
            Number: {
                kind: OperationKind.NUMBER,
                name: "Number",
                outputs: ["out"],
            },
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
            Sub: {
                kind: OperationKind.TRANSFORM,
                name: "Sub",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: subFunc,
            },
        },
    }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model3.graph.nodes[x].outputs[0],
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
        },
        dispatch
    )
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model5.graph.nodes[y].outputs[0],
        },
        dispatch
    )
    const model7 = update(
        effects,
        model6,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
        },
        dispatch
    )
    const model8 = update(
        effects,
        model7,
        {
            kind: EventKind.CLICKED_NODE,
            node: add,
        },
        dispatch
    )
    const model9 = update(
        effects,
        model8,
        {
            kind: EventKind.KEYDOWN,
            key: "c",
        },
        dispatch
    )
    const model10 = update(
        effects,
        model9,
        {
            kind: EventKind.FINDER_CHANGE,
            option: "Sub",
            node: add,
        },
        dispatch
    )
    const node = model7.graph.nodes[add] as NodeTransform
    const expectedModel: Model = {
        ...model7,
        graph: {
            ...model7.graph,
            nodes: {
                ...model7.graph.nodes,
                [node.uuid]: {
                    ...node,
                    name: "Sub",
                    func: subFunc,
                },
            },
        },
    }
    expect(model10).toEqual(expectedModel)
})

test("change node with different input and output names", () => {
    let tracked = makeTracked()
    const onTableUploaded = () => {}
    const model0: Model = {
        ...model,
        operations: {
            Number: {
                kind: OperationKind.NUMBER,
                name: "Number",
                outputs: ["out"],
            },
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
            Column: {
                kind: OperationKind.TRANSFORM,
                name: "Column",
                inputs: ["table", "column"],
                outputs: ["data"],
                func: column,
            },
        },
    }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const model4 = update(
        tracked.effects,
        model3,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model3.graph.nodes[x].outputs[0],
        },
        tracked.dispatch
    )
    const model5 = update(
        tracked.effects,
        model4,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
        },
        tracked.dispatch
    )
    const model6 = update(
        tracked.effects,
        model5,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model5.graph.nodes[y].outputs[0],
        },
        tracked.dispatch
    )
    const model7 = update(
        tracked.effects,
        model6,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
        },
        tracked.dispatch
    )
    const model8 = update(
        tracked.effects,
        model7,
        {
            kind: EventKind.CLICKED_NODE,
            node: add,
        },
        tracked.dispatch
    )
    const model9 = update(
        tracked.effects,
        model8,
        {
            kind: EventKind.KEYDOWN,
            key: "c",
        },
        tracked.dispatch
    )
    let model10 = model9
    for (const key of "Column") {
        model10 = update(
            tracked.effects,
            model10,
            {
                kind: EventKind.KEYDOWN,
                key: key,
            },
            tracked.dispatch
        )
    }
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model11 = update(
        tracked.effects,
        model10,
        {
            kind: EventKind.KEYDOWN,
            key: "Enter",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([
        { kind: EventKind.FINDER_CHANGE, option: "Column", node: add },
    ])
    expect(tracked.times).toEqual([])
    const event = tracked.events[0]
    tracked = resetTracked(tracked)
    const model12 = update(tracked.effects, model11, event, tracked.dispatch)
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const node = model7.graph.nodes[add] as NodeTransform
    const edges = Object.keys(model7.graph.edges)
    const expectedModel: Model = {
        ...model7,
        graph: {
            ...model7.graph,
            nodes: {
                ...model7.graph.nodes,
                [node.uuid]: {
                    ...node,
                    name: "Column",
                    func: column,
                },
            },
            inputs: {
                [node.inputs[0]]: {
                    uuid: node.inputs[0],
                    node: node.uuid,
                    name: "table",
                    edge: edges[0],
                },
                [node.inputs[1]]: {
                    uuid: node.inputs[1],
                    node: node.uuid,
                    name: "column",
                    edge: edges[1],
                },
            },
            outputs: {
                ...model7.graph.outputs,
                [node.outputs[0]]: {
                    uuid: node.outputs[0],
                    node: node.uuid,
                    name: "data",
                    edges: [],
                },
            },
            bodys: {
                ...model7.graph.bodys,
                [node.body]: {
                    kind: BodyKind.ERROR,
                    uuid: node.body,
                    node: node.uuid,
                },
            },
        },
    }
    expect(model12).toEqual(expectedModel)
})

test("change node with more inputs then existing node", () => {
    let tracked = makeTracked()
    const onTableUploaded = () => {}
    const model0: Model = {
        ...model,
        operations: {
            Number: {
                kind: OperationKind.NUMBER,
                name: "Number",
                outputs: ["out"],
            },
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
            Linspace: {
                kind: OperationKind.TRANSFORM,
                name: "Linspace",
                inputs: ["start", "stop", "num"],
                outputs: ["out"],
                func: linspaceFunc,
            },
        },
    }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const model4 = update(
        tracked.effects,
        model3,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model3.graph.nodes[x].outputs[0],
        },
        tracked.dispatch
    )
    const model5 = update(
        tracked.effects,
        model4,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
        },
        tracked.dispatch
    )
    const model6 = update(
        tracked.effects,
        model5,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model5.graph.nodes[y].outputs[0],
        },
        tracked.dispatch
    )
    const model7 = update(
        tracked.effects,
        model6,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
        },
        tracked.dispatch
    )
    const model8 = update(
        tracked.effects,
        model7,
        {
            kind: EventKind.CLICKED_NODE,
            node: add,
        },
        tracked.dispatch
    )
    const model9 = update(
        tracked.effects,
        model8,
        {
            kind: EventKind.KEYDOWN,
            key: "c",
        },
        tracked.dispatch
    )
    let model10 = model9
    for (const key of "Linspace") {
        model10 = update(
            tracked.effects,
            model10,
            {
                kind: EventKind.KEYDOWN,
                key: key,
            },
            tracked.dispatch
        )
    }
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model11 = update(
        tracked.effects,
        model10,
        {
            kind: EventKind.KEYDOWN,
            key: "Enter",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([
        { kind: EventKind.FINDER_CHANGE, option: "Linspace", node: add },
    ])
    expect(tracked.times).toEqual([])
    const event = tracked.events[0]
    tracked = resetTracked(tracked)
    const model12 = update(tracked.effects, model11, event, tracked.dispatch)
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const node = model7.graph.nodes[add] as NodeTransform
    const edges = Object.keys(model7.graph.edges)
    const expectedModel: Model = {
        ...model7,
        graph: {
            ...model7.graph,
            nodes: {
                ...model7.graph.nodes,
                [node.uuid]: {
                    ...node,
                    inputs: [...node.inputs, "13"],
                    name: "Linspace",
                    func: linspaceFunc,
                },
            },
            inputs: {
                [node.inputs[0]]: {
                    uuid: node.inputs[0],
                    node: node.uuid,
                    name: "start",
                    edge: edges[0],
                },
                [node.inputs[1]]: {
                    uuid: node.inputs[1],
                    node: node.uuid,
                    name: "stop",
                    edge: edges[1],
                },
                "13": {
                    uuid: "13",
                    node: node.uuid,
                    name: "num",
                },
            },
            bodys: {
                ...model7.graph.bodys,
                [node.body]: {
                    kind: BodyKind.NO,
                    uuid: node.body,
                    node: node.uuid,
                },
            },
        },
    }
    expect(model12).toEqual(expectedModel)
})

test("change node with fewer inputs then existing node", () => {
    let tracked = makeTracked()
    const onTableUploaded = () => {}
    const model0: Model = {
        ...model,
        operations: {
            Number: {
                kind: OperationKind.NUMBER,
                name: "Number",
                outputs: ["out"],
            },
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
            Sin: {
                kind: OperationKind.TRANSFORM,
                name: "Sin",
                inputs: ["x"],
                outputs: ["out"],
                func: sinFunc,
            },
        },
    }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const model4 = update(
        tracked.effects,
        model3,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model3.graph.nodes[x].outputs[0],
        },
        tracked.dispatch
    )
    const model5 = update(
        tracked.effects,
        model4,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
        },
        tracked.dispatch
    )
    const model6 = update(
        tracked.effects,
        model5,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model5.graph.nodes[y].outputs[0],
        },
        tracked.dispatch
    )
    const model7 = update(
        tracked.effects,
        model6,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
        },
        tracked.dispatch
    )
    const model8 = update(
        tracked.effects,
        model7,
        {
            kind: EventKind.CLICKED_NODE,
            node: add,
        },
        tracked.dispatch
    )
    const model9 = update(
        tracked.effects,
        model8,
        {
            kind: EventKind.KEYDOWN,
            key: "c",
        },
        tracked.dispatch
    )
    let model10 = model9
    for (const key of "Sin") {
        model10 = update(
            tracked.effects,
            model10,
            {
                kind: EventKind.KEYDOWN,
                key: key,
            },
            tracked.dispatch
        )
    }
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model11 = update(
        tracked.effects,
        model10,
        {
            kind: EventKind.KEYDOWN,
            key: "Enter",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([
        { kind: EventKind.FINDER_CHANGE, option: "Sin", node: add },
    ])
    expect(tracked.times).toEqual([])
    const event = tracked.events[0]
    tracked = resetTracked(tracked)
    const model12 = update(tracked.effects, model11, event, tracked.dispatch)
    const node = model7.graph.nodes[add] as NodeTransform
    const edges = Object.keys(model7.graph.edges)
    const expectedModel: Model = {
        ...model7,
        graph: {
            ...model7.graph,
            nodes: {
                ...model7.graph.nodes,
                [node.uuid]: {
                    ...node,
                    inputs: [node.inputs[0]],
                    name: "Sin",
                    func: sinFunc,
                },
            },
            inputs: {
                [node.inputs[0]]: {
                    uuid: node.inputs[0],
                    node: node.uuid,
                    name: "x",
                    edge: edges[0],
                },
            },
            bodys: {
                ...model7.graph.bodys,
                [node.body]: {
                    kind: BodyKind.TENSOR,
                    uuid: node.body,
                    node: node.uuid,
                    value: 0,
                    rank: 0,
                    shape: [],
                },
            },
            edges: {
                [edges[0]]: {
                    uuid: edges[0],
                    input: node.inputs[0],
                    output: model7.graph.nodes[x].outputs[0],
                },
            },
        },
    }
    expect(model12).toEqual(expectedModel)
})

test("change from source node to a source node does nothing", () => {
    let tracked = makeTracked()
    const onTableUploaded = () => {}
    const model0: Model = {
        ...model,
        operations: {
            Number: {
                kind: OperationKind.NUMBER,
                name: "Number",
                outputs: ["out"],
            },
        },
    }
    const { model: model1, node: number } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.CLICKED_NODE,
            node: number,
        },
        tracked.dispatch
    )
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "c",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model4 = update(
        tracked.effects,
        model3,
        {
            kind: EventKind.KEYDOWN,
            key: "Enter",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([
        { kind: EventKind.FINDER_CHANGE, option: "Number", node: number },
    ])
    expect(tracked.times).toEqual([])
    const event = tracked.events[0]
    tracked = resetTracked(tracked)
    const model5 = update(tracked.effects, model4, event, tracked.dispatch)
    expect(model5).toEqual(model1)
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
})

test("change from source node to a transform node does nothing", () => {
    let tracked = makeTracked()
    const onTableUploaded = () => {}
    const model0: Model = {
        ...model,
        operations: {
            Number: {
                kind: OperationKind.NUMBER,
                name: "Number",
                outputs: ["out"],
            },
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
        },
    }
    const { model: model1, node: number } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.CLICKED_NODE,
            node: number,
        },
        tracked.dispatch
    )
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "c",
        },
        tracked.dispatch
    )
    let model4 = model3
    for (const key of "Add") {
        model4 = update(
            tracked.effects,
            model4,
            {
                kind: EventKind.KEYDOWN,
                key: key,
            },
            tracked.dispatch
        )
    }
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model5 = update(
        tracked.effects,
        model4,
        {
            kind: EventKind.KEYDOWN,
            key: "Enter",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([
        {
            kind: EventKind.FINDER_CHANGE,
            option: "Add",
            node: number,
        },
    ])
    expect(tracked.times).toEqual([])
    const event = tracked.events[0]
    tracked = resetTracked(tracked)
    const model6 = update(tracked.effects, model5, event, tracked.dispatch)
    expect(model6).toEqual(model1)
})

test("deleting a node forces evaluation of outputs", () => {
    const effects = makeEffects(mockDocument())
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const model0: Model = {
        ...model,
        operations: {
            Number: {
                kind: OperationKind.NUMBER,
                name: "Number",
                outputs: ["out"],
            },
            Add: {
                kind: OperationKind.TRANSFORM,
                name: "Add",
                inputs: ["x", "y"],
                outputs: ["out"],
                func: addFunc,
            },
        },
    }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model3.graph.nodes[x].outputs[0],
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
        },
        dispatch
    )
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model5.graph.nodes[y].outputs[0],
        },
        dispatch
    )
    const model7 = update(
        effects,
        model6,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
        },
        dispatch
    )
    const model8 = update(
        effects,
        model7,
        {
            kind: EventKind.CLICKED_NODE,
            node: x,
        },
        dispatch
    )
    const model9 = update(
        effects,
        model8,
        {
            kind: EventKind.KEYDOWN,
            key: "d",
        },
        dispatch
    )
    const edge = model7.graph.outputs[model7.graph.nodes[y].outputs[0]].edges[0]
    const expectedModel: Model = {
        ...model7,
        graph: {
            nodes: {
                [add]: model7.graph.nodes[add],
                [y]: model7.graph.nodes[y],
            },
            edges: {
                [edge]: {
                    uuid: edge,
                    input: (model7.graph.nodes[add] as NodeTransform).inputs[1],
                    output: model7.graph.nodes[y].outputs[0],
                },
            },
            inputs: {
                [(model7.graph.nodes[add] as NodeTransform).inputs[0]]: {
                    uuid: (model7.graph.nodes[add] as NodeTransform).inputs[0],
                    node: add,
                    name: "x",
                },
                [(model7.graph.nodes[add] as NodeTransform).inputs[1]]: {
                    uuid: (model7.graph.nodes[add] as NodeTransform).inputs[1],
                    node: add,
                    name: "y",
                    edge,
                },
            },
            bodys: {
                [model7.graph.nodes[add].body]: {
                    kind: BodyKind.NO,
                    uuid: model7.graph.nodes[add].body,
                    node: add,
                },
                [model7.graph.nodes[y].body]: {
                    kind: BodyKind.NUMBER,
                    uuid: model7.graph.nodes[y].body,
                    node: y,
                    value: 0,
                    text: "0",
                },
            },
            outputs: {
                [model7.graph.nodes[add].outputs[0]]: {
                    uuid: model7.graph.nodes[add].outputs[0],
                    node: add,
                    name: "out",
                    edges: [],
                },
                [model7.graph.nodes[y].outputs[0]]: {
                    uuid: model7.graph.nodes[y].outputs[0],
                    node: y,
                    name: "out",
                    edges: [edge],
                },
            },
        },
        nodeOrder: [y, add],
    }
    expect(model9).toEqual(expectedModel)
})

test("prevent cycles from forming", () => {
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const effects = makeEffects(mockDocument())
    const model0: Model = {
        ...model,
        operations: {
            Sin: {
                kind: OperationKind.TRANSFORM,
                name: "Sin",
                inputs: ["x"],
                outputs: ["out"],
                func: sinFunc,
            },
        },
    }
    const { model: model1, node: a } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Sin"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const { model: model2, node: b } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Sin"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model2.graph.nodes[a].outputs[0],
        },
        dispatch
    )
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model2.graph.nodes[b] as NodeTransform).inputs[0],
        },
        dispatch
    )
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model2.graph.nodes[b].outputs[0],
        },
        dispatch
    )
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model2.graph.nodes[a] as NodeTransform).inputs[0],
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model5,
        focus: {
            kind: FocusKind.NONE,
            quickSelect: { kind: QuickSelectKind.NONE },
            pointerAction: { kind: PointerActionKind.NONE },
        },
    }
    expect(model6).toEqual(expectedModel)
})

interface PromisedTable {
    table: Table
    node: UUID
}

interface DeferedTable {
    promise: Promise<PromisedTable>
    onTableUploaded: OnTableUploaded
}

const deferedTable = (): DeferedTable => {
    let resolve: (promised: PromisedTable) => void
    const promise = new Promise<PromisedTable>((r) => (resolve = r))
    const onTableUploaded = (table: Table, node: UUID) => {
        resolve({ table, node })
    }
    return { promise, onTableUploaded }
}

test("upload csv using node prompts user for a table", async () => {
    const effects = makeEffects(mockDocument())
    const model0: Model = {
        ...model,
        operations: {
            "upload csv": {
                kind: OperationKind.UPLOAD_CSV,
                name: "upload csv",
                outputs: ["out"],
            },
        },
    }
    const { promise, onTableUploaded } = deferedTable()
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations["upload csv"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model1.graph.nodes[node].body
    const output = model1.graph.nodes[node].outputs[0]
    const expectedModel: Model = {
        ...model0,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NO,
                    uuid: body,
                    node,
                },
            },
            nodes: {
                [node]: {
                    kind: NodeKind.SOURCE,
                    uuid: node,
                    name: "upload csv",
                    body,
                    outputs: [output],
                    position: { x: 0, y: 0 },
                },
            },
            outputs: {
                [output]: {
                    uuid: output,
                    node,
                    name: "out",
                    edges: [],
                },
            },
        },
        nodeOrder: [node],
    }
    expect(model1).toEqual(expectedModel)
    expect(await promise).toEqual({
        table: {
            name: "table.csv",
            columns: {
                a: [1, 2, 3],
                b: [4, 5, 6],
            },
        },
        node,
    })
})

test("upload csv event replaces node body with a table", async () => {
    const effects = makeEffects(mockDocument())
    const model0: Model = {
        ...model,
        operations: {
            "upload csv": {
                kind: OperationKind.UPLOAD_CSV,
                name: "upload csv",
                outputs: ["out"],
            },
        },
    }
    const dispatch = () => {}
    const { promise, onTableUploaded } = deferedTable()
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations["upload csv"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model1.graph.nodes[node].body
    const output = model1.graph.nodes[node].outputs[0]
    const { table } = await promise
    const event: AppEvent = {
        kind: EventKind.UPLOAD_CSV,
        table,
        node,
    }
    const model2 = update(effects, model1, event, dispatch)
    const expectedModel: Model = {
        ...model1,
        graph: {
            ...model1.graph,
            nodes: {
                [node]: {
                    kind: NodeKind.SOURCE,
                    uuid: node,
                    name: "table.csv",
                    body,
                    outputs: [output],
                    position: { x: 0, y: 0 },
                },
            },
            bodys: {
                [body]: {
                    kind: BodyKind.TABLE,
                    uuid: body,
                    node,
                    value: {
                        name: "table.csv",
                        columns: {
                            a: [1, 2, 3],
                            b: [4, 5, 6],
                        },
                    },
                },
            },
        },
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing sft on virtual keyboard toggles upppercase", () => {
    const effectModel = defaultEffectModel()
    const document = mockDocument()
    const effects = makeEffects(document, effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
    const operations: Operations = {
        Text: {
            kind: OperationKind.TEXT,
            name: "Text",
            outputs: ["out"],
        },
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Text"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const body = model0.graph.nodes[node].body
    const model1 = focusBody(model0, body)
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.KEYDOWN,
            key: "sft",
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.BODY_TEXT,
            body,
            quickSelect: { kind: QuickSelectKind.NONE },
            uppercase: true,
        },
    }
    expect(model2).toEqual(expectedModel)
})
