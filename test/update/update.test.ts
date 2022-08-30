import * as tf from '@tensorflow/tfjs-core'

import { addNodeToGraph, EventKind, openFinderInsert, focusBody, update, updateBody, updateNumberText } from "../../src/update"
import { BodyKind, NodeKind, NodeTransform, OperationKind, Operations } from "../../src/model/graph"
import { addEdge, changeNodePosition } from "../../src/update/graph"
import { translate } from "../../src/linear_algebra/matrix3x3"
import { Model } from "../../src/model"
import { FocusKind } from "../../src/model/focus"
import { PointerActionKind } from "../../src/model/pointer_action"
import { Pointer } from "../../src/ui"
import { emptyModel } from "../../src/model/empty"
import { QuickSelectKind } from "../../src/model/quick_select"
import { defaultEffectModel, EffectModel, makeEffects } from "../mock_effects"
import { column, tensorFunc, TensorFunc } from "../../src/model/operations"
import { Table } from '../../src/model/table'

const model = emptyModel({ width: 500, height: 500 })
const addFunc = tensorFunc(tf.add)
const subFunc = tensorFunc(tf.sub)
const divFunc = tensorFunc(tf.sub)
const linspaceFunc = tensorFunc(tf.linspace as TensorFunc)

test("two pointers down on background starts zooming", () => {
    const effects = makeEffects()
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model,
        pointers: [pointer0, pointer1],
        focus: {
            kind: FocusKind.NONE,
            pointerAction: {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 0, y: 0 },
                pointerDistance: 0
            },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
    }
    expect(model4).toEqual(expectedModel)
})


test("double clicking background opens finder", () => {
    const effects = makeEffects()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model,
        pointers: [pointer],
        focus: {
            kind: FocusKind.FINDER_INSERT,
            search: '',
            options: [],
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        nodePlacementLocation: { x: 0, y: 0, show: false }
    }
    expect(model5).toEqual(expectedModel)
    expect(schedule).toEqual([
        { after: { milliseconds: 300 }, event: { kind: EventKind.OPEN_FINDER_TIMEOUT } }
    ])
})

test("clicking background then waiting too long cancels opens finder", () => {
    const effects = makeEffects()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    expect(schedule).toEqual([
        { after: { milliseconds: 300 }, event: { kind: EventKind.OPEN_FINDER_TIMEOUT } }
    ])
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.OPEN_FINDER_TIMEOUT,
    })
    expect(model4).toEqual(model)
})


test("clicking background triggers finder open timeout", () => {
    const effects = makeEffects()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const expectedModel: Model = {
        ...model,
        openFinderFirstClick: true
    }
    expect(model3).toEqual(expectedModel)
    expect(schedule).toEqual([
        { after: { milliseconds: 300 }, event: { kind: EventKind.OPEN_FINDER_TIMEOUT } }
    ])
})

test("two pointers down then up puts you in pan mode", () => {
    const effects = makeEffects()
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0
    })
    const expectedModel: Model = {
        ...model,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        pointers: [pointer1]
    }
    expect(model3).toEqual(expectedModel)
})

test("pointer down when finder open tracks pointer", () => {
    const effects = makeEffects()
    const model0 = openFinderInsert(model)
    const pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const expectedModel: Model = {
        ...model0,
        pointers: [pointer],
    }
    expect(model1).toEqual(expectedModel)
})

test("clicking node selects it and puts it on top of of the node order", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model3, render } = update(effects, model2, {
        kind: EventKind.CLICKED_NODE,
        node: node0
    })
    const expectedModel: Model = {
        ...model2,
        focus: {
            kind: FocusKind.NODE,
            node: node0,
            drag: true,
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        nodeOrder: [node1, node0],
    }
    expect(model3).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("pointer move before pointer down changes node placement location", () => {
    const effects = makeEffects()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_MOVE,
        pointer
    })
    const expectedModel: Model = {
        ...model,
        nodePlacementLocation: { x: 0, y: 0, show: false },
    }
    expect(model1).toEqual(expectedModel)
})

test("pointer move after pointer down pans camera", () => {
    const effects = makeEffects()
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { model: model2, render } = update(effects, model1, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            id: 0,
            position: { x: 50, y: 75 }
        }
    })
    const expectedModel: Model = {
        ...model,
        camera: translate(-50, -75),
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        pointers: [
            {
                id: 0,
                position: { x: 50, y: 75 }
            }
        ]
    }
    expect(model2).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("pointer move after clicking node pointer down drags node", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_NODE,
        node: node0
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { model: model5, render } = update(effects, model4, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            id: 0,
            position: { x: 50, y: 75 }
        }
    })
    const expectedModel: Model = {
        ...model2,
        pointers: [
            {
                id: 0,
                position: { x: 50, y: 75 }
            }
        ],
        graph: changeNodePosition(model2.graph, node0, () => ({ x: 50, y: 75 })),
        nodeOrder: [node1, node0],
        focus: {
            kind: FocusKind.NODE,
            node: node0,
            drag: true,
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model5).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("pointer move after clicking node, pointer down, then pointer up", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node: node0
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            id: 0,
            position: { x: 50, y: 75 }
        }
    })
    const expectedModel: Model = {
        ...model1,
        nodePlacementLocation: { x: 50, y: 75, show: false },
        focus: {
            kind: FocusKind.NODE,
            node: node0,
            drag: false,
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
    }
    expect(model5).toEqual(expectedModel)
})

test("mouse wheel zooms in camera relative to mouse position", () => {
    const effects = makeEffects()
    const { model: model1 } = update(effects, model, {
        kind: EventKind.WHEEL,
        deltaY: 10,
        position: { x: 50, y: 100 }
    })
    const expectedModel = {
        ...model,
        camera: [
            1.0717734625362931, 0, -3.588673126814655,
            0, 1.0717734625362931, -7.17734625362931,
            0, 0, 1,
        ]
    }
    expect(model1).toEqual(expectedModel)
})

test("clicking input selects it", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const input = (model1.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model2, render } = update(effects, model1, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.INPUT,
            input,
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model2).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("clicking new input selects it and deselects old input", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const [input0, input1] = (model1.graph.nodes[node0] as NodeTransform).inputs
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_INPUT,
        input: input0
    })
    const { model: model3, render } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: input1
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.INPUT,
            input: input1,
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model3).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("clicking output after clicking input adds connection", () => {
    const effectModel: EffectModel = { uuid: 0, time: 0 }
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const input = (model2.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const newEffectModel = { ...effectModel }
    const { model: model4, render } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const expectedModel: Model = {
        ...model2,
        graph: addEdge({
            graph: model2.graph,
            input,
            output,
            generateUUID: makeEffects(newEffectModel).generateUUID
        }).graph
    }
    expect(model4).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("clicking output selects it", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const output = model1.graph.nodes[node0].outputs[0]
    const { model: model2, render } = update(effects, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.OUTPUT,
            output,
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model2).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("clicking new output selects it and deselects old output", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const [output0, output1] = model1.graph.nodes[node0].outputs
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output0
    })
    const { model: model3, render } = update(effects, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output1
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.OUTPUT,
            output: output1,
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model3).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("clicking input after clicking output adds connection", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const output = model2.graph.nodes[node1].outputs[0]
    const { model: model3, render } = update(effects, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const newEffectModel = { ...effectModel }
    const input = (model3.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const expectedModel: Model = {
        ...model2,
        graph: addEdge({
            graph: model2.graph,
            input,
            output,
            generateUUID: makeEffects(newEffectModel).generateUUID
        }).graph
    }
    expect(model4).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("double click opens finder", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = { ...model, operations }
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_UP,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 50, y: 50 }
        }
    })
    const { model: model5, render } = update(effects, model4, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.FINDER_INSERT,
            search: '',
            options: ['Add', 'Sub'],
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        nodePlacementLocation: { x: 50, y: 50, show: false },
        pointers: [
            {
                id: 0,
                position: { x: 50, y: 50 }
            }
        ]
    }
    expect(model5).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("key down when finder is not shown does nothing", () => {
    const { model: model1 } = update(makeEffects(), model, {
        kind: EventKind.KEYDOWN,
        key: 'a',
        ctrl: false
    })
    expect(model1).toEqual(model)
})


test("f key down when finder is not shown opens finder", () => {
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = { ...model, operations }
    const { model: model1, render } = update(makeEffects(), model0, {
        kind: EventKind.KEYDOWN,
        key: 'f',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.FINDER_INSERT,
            search: '',
            options: ["Add", "Sub"],
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model1).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("clicking a finder option adds node to graph", () => {
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0 = openFinderInsert({ ...model, operations })
    const { model: model1, render } = update(makeEffects(), model0, {
        kind: EventKind.CLICKED_FINDER_OPTION,
        option: 'Add'
    })
    const { model: expectedModel } = addNodeToGraph({
        model: { ...model, operations },
        position: { x: 250, y: 250 },
        operation: operations['Add'],
        generateUUID: makeEffects().generateUUID
    })
    expect(model1).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("key down when finder is shown appends to search", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0 = openFinderInsert({ ...model, operations })
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.KEYDOWN,
        key: 'a',
        ctrl: false
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: 'd',
        ctrl: false
    })
    const { model: model3, render } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'd',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.FINDER_INSERT,
            search: 'add',
            options: ['Add'],
            quickSelect: { kind: QuickSelectKind.NONE }
        },
    }
    expect(model3).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("backspace key down when finder is shown deletes from search", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0 = openFinderInsert({ ...model, operations })
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.KEYDOWN,
        key: 'a',
        ctrl: false
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: 'd',
        ctrl: false
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'd',
        ctrl: false
    })
    const { model: model4, render } = update(effects, model3, {
        kind: EventKind.KEYDOWN,
        key: 'Backspace',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.FINDER_INSERT,
            search: 'ad',
            options: ['Add'],
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model4).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("enter key down when finder is shown closes finder and adds node", () => {
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0 = openFinderInsert({ ...model, operations })
    const { model: model1, render } = update(makeEffects(), model0, {
        kind: EventKind.KEYDOWN,
        key: 'Enter',
        ctrl: false
    })
    const { model: expectedModel } = addNodeToGraph({
        model: { ...model, operations },
        position: { x: 250, y: 250 },
        operation: operations['Add'],
        generateUUID: makeEffects().generateUUID
    })
    expect(model1).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("enter key down when finder is shown and finder has search closes finder and adds node", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = openFinderInsert({ ...model, operations })
    let model1 = model0
    for (const key of 'add') {
        const { model: model } = update(effects, model1, {
            kind: EventKind.KEYDOWN,
            key,
            ctrl: false
        })
        model1 = model
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: 'Enter',
        ctrl: false
    })
    const { model: expectedModel } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Add'],
        position: { x: 250, y: 250 },
        generateUUID: makeEffects().generateUUID
    })
    expect(model2).toEqual(expectedModel)
})

test("enter key down when finder is shown and finder has search eliminates all options closes finder", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = openFinderInsert({ ...model, operations })
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.KEYDOWN,
        key: 'x',
        ctrl: false
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: 'Enter',
        ctrl: false
    })
    expect(model2).toEqual({ ...model, operations })
})

test("escape key down when finder is shown closes finder", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = openFinderInsert({ ...model, operations })
    const { model: model1, render } = update(effects, model0, {
        kind: EventKind.KEYDOWN,
        key: 'Escape',
        ctrl: false
    })
    const expectedModel = { ...model, operations }
    expect(model1).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("shift key down when finder is shown are ignored", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = openFinderInsert({ ...model, operations })
    const { model: model1, render } = update(effects, model0, {
        kind: EventKind.KEYDOWN,
        key: 'Shift',
        ctrl: false
    })
    expect(model1).toEqual(model0)
    expect(render).toBeUndefined()
})

test("alt key down when finder is shown are ignored", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = openFinderInsert({ ...model, operations })
    const { model: model1, render } = update(effects, model0, {
        kind: EventKind.KEYDOWN,
        key: 'Alt',
        ctrl: false
    })
    expect(model1).toEqual(model0)
    expect(render).toBeUndefined()
})

test("control key down when finder is shown are ignored", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = openFinderInsert({ ...model, operations })
    const { model: model1, render } = update(effects, model0, {
        kind: EventKind.KEYDOWN,
        key: 'Control',
        ctrl: false
    })
    expect(model1).toEqual(model0)
    expect(render).toBeUndefined()
})

test("meta key down when finder is shown are ignored", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = openFinderInsert({ ...model, operations })
    const { model: model1, render } = update(effects, model0, {
        kind: EventKind.KEYDOWN,
        key: 'Meta',
        ctrl: false
    })
    expect(model1).toEqual(model0)
    expect(render).toBeUndefined()
})

test("Tab key down when finder is shown are ignored", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = openFinderInsert({ ...model, operations })
    const { model: model1, render } = update(effects, model0, {
        kind: EventKind.KEYDOWN,
        key: 'Tab',
        ctrl: false
    })
    expect(model1).toEqual(model0)
    expect(render).toBeUndefined()

})

test("pressing number on keyboard appends to number node", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of '1234567890') {
        const { model: model } = update(effects, model2, {
            kind: EventKind.KEYDOWN,
            key,
            ctrl: false
        })
        model2 = model
    }
    const body = makeEffects({ ...effectModel, uuid: effectModel.uuid - 1 }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY,
            body,
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: 1234567890,
                    text: '1234567890'
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing -3.14 on keyboard writes a float for the number", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of '-3.14') {
        const { model: model } = update(effects, model2, {
            kind: EventKind.KEYDOWN,
            key,
            ctrl: false
        })
        model2 = model
    }
    const body = makeEffects({ ...effectModel, uuid: effectModel.uuid - 1 }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY,
            body,
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: -3.14,
                    text: '-3.14'
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing -3.1.4 on keyboard ignores the second decimal", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of '-3.1.4') {
        const { model: model } = update(effects, model2, {
            kind: EventKind.KEYDOWN,
            key,
            ctrl: false
        })
        model2 = model
    }
    const body = makeEffects({ ...effectModel, uuid: effectModel.uuid - 1 }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY,
            body,
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: -3.14,
                    text: '-3.14'
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})


test("pressing backspace on keyboard deletes from number node", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of '1234567890') {
        const { model: model } = update(effects, model2, {
            kind: EventKind.KEYDOWN,
            key,
            ctrl: false
        })
        model2 = model
    }
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'Backspace',
        ctrl: false
    })
    const body = makeEffects({ ...effectModel, uuid: effectModel.uuid - 1 }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY,
            body,
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: 123456789,
                    text: '123456789'
                }
            }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing backspace when number node value is 0 has no effect", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (let i = 0; i < 3; ++i) {
        const { model: model } = update(effects, model1, {
            kind: EventKind.KEYDOWN,
            key: 'Backspace',
            ctrl: false
        })
        model2 = model
    }
    const body = makeEffects({ ...effectModel, uuid: effectModel.uuid - 1 }).generateUUID()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY,
            body,
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    kind: BodyKind.NUMBER,
                    uuid: body,
                    node,
                    value: 0,
                    text: '0'
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing enter on keyboard while editing number node exits virtual keyboard", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of '1234567890') {
        const { model: model } = update(effects, model2, {
            kind: EventKind.KEYDOWN,
            key,
            ctrl: false
        })
        model2 = model
    }
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'Enter',
        ctrl: false
    })
    const body = makeEffects({ ...effectModel, uuid: effectModel.uuid - 1 }).generateUUID()
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
                    text: '1234567890'
                }
            }
        }
    }
    expect(model3).toEqual(expectedModel)
})


test("pressing non number on keyboard while editing number node is ignored", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body)
    let model2 = model1
    for (const key of 'qwertyuiopasdfghjklzxvbnm') {
        const { model: model } = update(effects, model2, {
            kind: EventKind.KEYDOWN,
            key,
            ctrl: false
        })
        model2 = model
    }
    const body = makeEffects({ ...effectModel, uuid: effectModel.uuid - 1 }).generateUUID()
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
                    text: '0'
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})


test("pressing - on keyboard while editing number node makes the number negative", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const model1 = updateNumberText(model0, model0.graph.nodes[node].body, () => '10').model
    const model2 = focusBody(model1, model1.graph.nodes[node].body!)
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: '-',
        ctrl: false
    })
    const body = makeEffects({ ...effectModel, uuid: effectModel.uuid - 1 }).generateUUID()
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
                    text: '-10'
                }
            }
        },
        focus: {
            kind: FocusKind.BODY,
            body,
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing + on keyboard while editing number node makes the number negative", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const model1 = updateNumberText(model0, model0.graph.nodes[node].body, () => '-10').model
    const model2 = focusBody(model1, model1.graph.nodes[node].body!)
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: '+',
        ctrl: false
    })
    const body = makeEffects({ ...effectModel, uuid: effectModel.uuid - 1 }).generateUUID()
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
                    text: '10'
                }
            }
        },
        focus: {
            kind: FocusKind.BODY,
            body,
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model3).toEqual(expectedModel)
})


test("pressing c on keyboard while editing number node makes the number 0", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: 'c',
        ctrl: false
    })
    const body = makeEffects({ ...effectModel, uuid: effectModel.uuid - 1 }).generateUUID()
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
                    text: '0'
                }
            }
        },
        focus: {
            kind: FocusKind.BODY,
            body,
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("clicking a number node opens the numeric keyboard", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.CLICKED_BODY,
        body
    })
    const expectedModel = focusBody(model0, body)
    expect(model1).toEqual(expectedModel)
})

test("clicking a number node when another number node is selected switches selections", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node: node0 } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model1, node: node1 } = addNodeToGraph({
        model: model0,
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body0 = model1.graph.nodes[node0].body!
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_BODY,
        body: body0
    })
    const body1 = model2.graph.nodes[node1].body!
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_BODY,
        body: body1
    })
    const expectedModel = focusBody(model1, body1)
    expect(model3).toEqual(expectedModel)
})

test("clicking background when a number node is selected deselects it", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model0.graph.nodes[node].body!
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_BODY,
        body
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        openFinderFirstClick: true,
        pointers: [pointer]
    }
    expect(model5).toEqual(expectedModel)
})

test("pressing Escape when a number node is selected deselects it", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.CLICKED_BODY,
        body
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: 'Escape',
        ctrl: false
    })
    expect(model2).toEqual(model0)
})

test("clicking input when a number node is selected deselects it and selects input", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        },
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const { model: model0, node: number } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model1, node: add } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model1.graph.nodes[number].body!
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_BODY,
        body
    })
    const input = (model2.graph.nodes[add] as NodeTransform).inputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.INPUT,
            input,
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("clicking output when a number node is selected deselects it and selects output", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.CLICKED_BODY,
        body
    })
    const output = model0.graph.nodes[node].outputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.OUTPUT,
            output,
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("clicking node when a number node is selected deselects it and selects node", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Number': {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.CLICKED_BODY,
        body
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.NODE,
            node,
            drag: true,
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("zooming", () => {
    const effects = makeEffects()
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 10, y: 10 }
    }
    const pointer2: Pointer = {
        id: 1,
        position: { x: 20, y: 20 }
    }
    const pointer3: Pointer = {
        id: 1,
        position: { x: 30, y: 30 }
    }
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const expectedModel0: Model = {
        ...model,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        pointers: [pointer0]
    }
    expect(model1).toEqual(expectedModel0)
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const expectedModel1: Model = {
        ...model,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 0, y: 0 },
                pointerDistance: 0,
            },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        pointers: [pointer0, pointer1]
    }
    expect(model2).toEqual(expectedModel1)
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer2
    })
    const expectedModel2: Model = {
        ...model,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 10, y: 10 },
                pointerDistance: Math.sqrt(Math.pow(20, 2) + Math.pow(20, 2)),
            },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        pointers: [pointer0, pointer2]
    }
    expect(model3).toEqual(expectedModel2)
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer3
    })
    const expectedModel3: Model = {
        ...model,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 15, y: 15 },
                pointerDistance: Math.sqrt(Math.pow(30, 2) + Math.pow(30, 2)),
            },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        pointers: [pointer0, pointer3],
        camera: [
            0.906625499506728, 0, -3.13250999013456,
            0, 0.906625499506728, -3.13250999013456,
            0, 0, 1,
        ]
    }
    expect(model4).toEqual(expectedModel3)
})

test("pressing d on keyboard with node selected deletes it", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'd',
        ctrl: false
    })
    expect(model3).toEqual(model0)
})

test("clicking background when a node is selected deselects it", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        openFinderFirstClick: true,
        pointers: [pointer]
    }
    expect(model6).toEqual(expectedModel)
})

test("pressing escape when a node is selected deselects it", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'Escape',
        ctrl: false
    })
    expect(model3).toEqual(model1)
})


test("clicking background when a input is selected deselects it", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const input = (model2.graph.nodes[node] as NodeTransform).inputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        openFinderFirstClick: true,
        pointers: [pointer]
    }
    expect(model6).toEqual(expectedModel)
})

test("pressing escape when a input is selected deselects it", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const input = (model1.graph.nodes[node] as NodeTransform).inputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'Escape',
        ctrl: false
    })
    expect(model3).toEqual(model1)
})


test("clicking background when a output is selected deselects it", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const output = model2.graph.nodes[node].outputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        openFinderFirstClick: true,
        pointers: [pointer]
    }
    expect(model6).toEqual(expectedModel)
})

test("pressing escape when a output is selected deselects it", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const output = model1.graph.nodes[node].outputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'Escape',
        ctrl: false
    })
    expect(model3).toEqual(model1)
})

test("delete node", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.DELETE_NODE,
        node,
    })
    expect(model2).toEqual(model0)
})


test("delete input edge", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const input = (model2.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.DELETE_INPUT_EDGE,
        input
    })
    expect(model5).toEqual(model2)
})

test("pressing d on keyboard with input selected delete edge attached", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const input = (model2.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.KEYDOWN,
        key: 'd',
        ctrl: false
    })
    expect(model6).toEqual(model2)
})

test("delete output edges", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const [input0, input1] = (model2.graph.nodes[node0] as NodeTransform).inputs
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: input0
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: input1
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.DELETE_OUTPUT_EDGES,
        output
    })
    expect(model7).toEqual(model2)
})

test("pressing d on keyboard with output selected delete edges attached", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        }
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const [input0, input1] = (model2.graph.nodes[node0] as NodeTransform).inputs
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: input0
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: input1
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.KEYDOWN,
        key: 'd',
        ctrl: false
    })
    expect(model8).toEqual(model2)
})

test("connecting output of same node where input is selected is not allowed", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const input = (model1.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output = model2.graph.nodes[node0].outputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    expect(model3).toEqual(model2)
})


test("connecting input of same node where output is selected is not allowed", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const output = model1.graph.nodes[node0].outputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const input = (model1.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    expect(model3).toEqual(model2)
})

test("connecting output to input if input already has edge replaces it", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        },
        'Div': {
            kind: OperationKind.TRANSFORM,
            name: 'Div',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: divFunc
        }
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model3, node: node2 } = addNodeToGraph({
        model: model2,
        operation: operations['Div'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const input = (model3.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output0 = model4.graph.nodes[node1].outputs[0]
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output0
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output1 = model6.graph.nodes[node2].outputs[0]
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output1
    })
    const expectedModel: Model = {
        ...model3,
        graph: addEdge({
            graph: model3.graph,
            input,
            output: output1,
            generateUUID: makeEffects({ ...effectModel, uuid: effectModel.uuid - 1 }).generateUUID
        }).graph
    }
    expect(model7).toEqual(expectedModel)
})


test("connecting input to output if input already has edge replaces it", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Add': {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        'Sub': {
            kind: OperationKind.TRANSFORM,
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: subFunc
        },
        'Div': {
            kind: OperationKind.TRANSFORM,
            name: 'Div',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: divFunc
        }
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model3, node: node2 } = addNodeToGraph({
        model: model2,
        operation: operations['Div'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const input = (model3.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output0 = model4.graph.nodes[node1].outputs[0]
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output0
    })
    const output1 = model5.graph.nodes[node2].outputs[0]
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output1
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const expectedModel: Model = {
        ...model3,
        graph: addEdge({
            graph: model3.graph,
            input,
            output: output1,
            generateUUID: makeEffects({ ...effectModel, uuid: effectModel.uuid - 1 }).generateUUID
        }).graph
    }
    expect(model7).toEqual(expectedModel)
})

test("three pointers down then one up doesn't change state", () => {
    const effects = makeEffects()
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 }
    }
    const pointer2: Pointer = {
        id: 2,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer2
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer: pointer2
    })
    const expectedModel: Model = {
        ...model,
        pointers: [pointer0, pointer1],
    }
    expect(model4).toEqual(expectedModel)
})


test("three pointers down on node then one up keeps state dragging", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        operations: {
            'Add': {
                kind: OperationKind.TRANSFORM,
                name: 'Add',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: addFunc
            },
        }
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations['Add'],
        position: { x: 250, y: 250 },
        generateUUID: effects.generateUUID
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 }
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.POINTER_UP,
        pointer: pointer1
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NODE,
            node,
            drag: true,
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        pointers: [pointer0],
    }
    expect(model6).toEqual(expectedModel)
})

test("pointer move when input selected updates node placement location", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        operations: {
            'Add': {
                kind: OperationKind.TRANSFORM,
                name: 'Add',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: addFunc
            },
        }
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: (model2.graph.nodes[node] as NodeTransform).inputs[0]
    })
    const pointer1: Pointer = {
        id: 0,
        position: { x: 50, y: 50 }
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer1
    })
    const expectedModel: Model = {
        ...model3,
        nodePlacementLocation: { x: 50, y: 50, show: false },
        pointers: [pointer1]
    }
    expect(model4).toEqual(expectedModel)
})

test("pointer move when output selected updates node placement location", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        operations: {
            'Add': {
                kind: OperationKind.TRANSFORM,
                name: 'Add',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: addFunc
            },
        }
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model2.graph.nodes[node].outputs[0]
    })
    const pointer1: Pointer = {
        id: 0,
        position: { x: 50, y: 50 }
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer1
    })
    const expectedModel: Model = {
        ...model3,
        nodePlacementLocation: { x: 50, y: 50, show: false },
        pointers: [pointer1]
    }
    expect(model4).toEqual(expectedModel)
})

test("pointer move when body selected updates node placement location", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        operations: {
            'Number': {
                kind: OperationKind.NUMBER,
                name: 'Number',
                outputs: ['out']
            }
        }
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_BODY,
        body: model2.graph.nodes[node].body!
    })
    const pointer1: Pointer = {
        id: 0,
        position: { x: 50, y: 50 }
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer1
    })
    const expectedModel: Model = {
        ...model3,
        nodePlacementLocation: { x: 50, y: 50, show: false },
        pointers: [pointer1]
    }
    expect(model4).toEqual(expectedModel)
})

test("pointer move when finder open only updates pointer state", () => {
    const effects = makeEffects()
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0
    })
    const pointer1: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.POINTER_UP,
        pointer: pointer1
    })
    const pointer2: Pointer = {
        id: 0,
        position: { x: 50, y: 50 }
    }
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer2
    })
    const expectedModel: Model = {
        ...model6,
        pointers: []
    }
    expect(model7).toEqual(expectedModel)
})


test("pressing f with node selected opens finder", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        operations: {
            'Add': {
                kind: OperationKind.TRANSFORM,
                name: 'Add',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: addFunc
            },
        }
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.KEYDOWN,
        key: 'f',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model4,
        focus: {
            kind: FocusKind.FINDER_INSERT,
            search: '',
            options: ['Add'],
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model5).toEqual(expectedModel)
})


test("pressing f with input selected opens finder", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        operations: {
            'Add': {
                kind: OperationKind.TRANSFORM,
                name: 'Add',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: addFunc
            },
        }
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: (model2.graph.nodes[node] as NodeTransform).inputs[0]
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.KEYDOWN,
        key: 'f',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model4,
        focus: {
            kind: FocusKind.FINDER_INSERT,
            search: '',
            options: ['Add'],
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model5).toEqual(expectedModel)
})

test("pressing f with output selected opens finder", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        operations: {
            'Add': {
                kind: OperationKind.TRANSFORM,
                name: 'Add',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: addFunc
            },
        }
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model2.graph.nodes[node].outputs[0]
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.KEYDOWN,
        key: 'f',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model4,
        focus: {
            kind: FocusKind.FINDER_INSERT,
            search: '',
            options: ['Add'],
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model5).toEqual(expectedModel)
})

test("key up with input selected does nothing", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        operations: {
            'Add': {
                kind: OperationKind.TRANSFORM,
                name: 'Add',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: addFunc
            },
        }
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: (model2.graph.nodes[node] as NodeTransform).inputs[0]
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.KEYDOWN,
        key: 'z',
        ctrl: false
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.KEYUP,
        key: 'z',
        ctrl: false
    })
    expect(model6).toEqual(model4)
})

test("clicking background with finder open closes it", () => {
    const effects = makeEffects()
    const { model: model1 } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: 'f',
        ctrl: false
    })
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model,
        pointers: [pointer]
    }
    expect(model3).toEqual(expectedModel)
})

test("pointer move after moving with keyboard stops showing node placement location", () => {
    const effects = makeEffects()
    const { model: model1, render: render0 } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: 'h',
        ctrl: false
    })
    expect(render0).toBeUndefined()
    expect(model1).toEqual({
        ...model,
        nodePlacementLocation: { x: 250, y: 250, show: true },
        panCamera: { left: true, up: false, down: false, right: false, now: 0 }
    })
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model2, render: render1 } = update(effects, model1, {
        kind: EventKind.POINTER_MOVE,
        pointer
    })
    expect(render1).toEqual(true)
    expect(model2).toEqual({
        ...model1,
        nodePlacementLocation: { x: 0, y: 0, show: false }
    })
    const { model: model3, render: render2 } = update(effects, model2, {
        kind: EventKind.POINTER_MOVE,
        pointer
    })
    expect(render2).toBeUndefined()
    expect(model3).toEqual(model2)
})

test("update body", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        operations: {
            'Number': {
                kind: OperationKind.NUMBER,
                name: 'Number',
                outputs: ['out']
            },
        }
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: model0.operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model1.graph.nodes[node].body
    const { model: model2 } = updateBody(model1, body, number => ({
        ...number,
        kind: BodyKind.NUMBER,
        value: 10,
        text: '10'
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
                    text: '10'
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing any alphanumeric key while editing text node appends key to value", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Text': {
            kind: OperationKind.TEXT,
            name: 'Text',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Text'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of 'qwertyuiopasdfghjklzxcvbnm1234567890') {
        const { model: nextModel } = update(effects, model3, {
            kind: EventKind.KEYDOWN,
            key: key,
            ctrl: false
        })
        model3 = nextModel
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
                    value: 'qwertyuiopasdfghjklzxcvbnm1234567890',
                }
            }
        },
        focus: {
            kind: FocusKind.BODY,
            body,
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing backspace while editing text node removes letter from value", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Text': {
            kind: OperationKind.TEXT,
            name: 'Text',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Text'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of 'qwerty') {
        const { model: nextModel } = update(effects, model3, {
            kind: EventKind.KEYDOWN,
            key: key,
            ctrl: false
        })
        model3 = nextModel
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.KEYDOWN,
        key: 'Backspace',
        ctrl: false
    })
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
                    value: 'qwert',
                }
            }
        },
        focus: {
            kind: FocusKind.BODY,
            body,
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model4).toEqual(expectedModel)
})

test("pressing enter while editing text node clears the focus", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Text': {
            kind: OperationKind.TEXT,
            name: 'Text',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Text'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of 'qwerty') {
        const { model: nextModel } = update(effects, model3, {
            kind: EventKind.KEYDOWN,
            key: key,
            ctrl: false
        })
        model3 = nextModel
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.KEYDOWN,
        key: 'Enter',
        ctrl: false
    })
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
                    value: 'qwerty',
                }
            }
        }
    }
    expect(model4).toEqual(expectedModel)
})

test("pressing escape while editing text node clears the focus", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Text': {
            kind: OperationKind.TEXT,
            name: 'Text',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Text'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of 'qwerty') {
        const { model: nextModel } = update(effects, model3, {
            kind: EventKind.KEYDOWN,
            key: key,
            ctrl: false
        })
        model3 = nextModel
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.KEYDOWN,
        key: 'Escape',
        ctrl: false
    })
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
                    value: 'qwerty',
                }
            }
        }
    }
    expect(model4).toEqual(expectedModel)
})


test("pressing shift while editing text node does nothing", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Text': {
            kind: OperationKind.TEXT,
            name: 'Text',
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['Text'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of 'qwerty') {
        const { model: nextModel } = update(effects, model3, {
            kind: EventKind.KEYDOWN,
            key: key,
            ctrl: false
        })
        model3 = nextModel
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.KEYDOWN,
        key: 'Shift',
        ctrl: false
    })
    expect(model4).toEqual(model3)
})

test("pressing any key while focusing a body with no content does nothing", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'add': {
            kind: OperationKind.TRANSFORM,
            name: 'add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations['add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of 'qwertyuiopasdfghjklzxcvbnm1234567890') {
        const { model: nextModel } = update(effects, model3, {
            kind: EventKind.KEYDOWN,
            key: key,
            ctrl: false
        })
        model3 = nextModel
    }
    expect(model3).toEqual(model2)
})

test("upload table", () => {
    const table: Table = {
        'a': [1, 2, 3],
        'b': [4, 5, 6]
    }
    const { model: model1 } = update(makeEffects(), model, {
        kind: EventKind.UPLOAD_TABLE,
        name: 'train.csv',
        table,
        position: { x: 0, y: 0 }
    })
    const generateUUID = makeEffects().generateUUID
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
                    name: 'train.csv',
                    outputs: [output],
                    body,
                    position: { x: 0, y: 0 }
                }
            },
            inputs: {},
            bodys: {
                [body]: {
                    kind: BodyKind.TABLE,
                    uuid: body,
                    node,
                    name: 'train.csv',
                    value: table
                }
            },
            outputs: {
                [output]: {
                    uuid: output,
                    node,
                    name: 'table',
                    edges: []
                }
            },
            edges: {},
        },
        nodeOrder: [node]
    }
    expect(model1).toEqual(expectedModel)
})

test("pressing c with node selected opens finder in change mode", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        operations: {
            'Number': {
                kind: OperationKind.NUMBER,
                name: 'Number',
                outputs: ['out'],
            },
            'Add': {
                kind: OperationKind.TRANSFORM,
                name: 'Add',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: addFunc
            },
            'Sub': {
                kind: OperationKind.TRANSFORM,
                name: 'Sub',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: subFunc
            },
        }
    }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: model0.operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0]
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: (model4.graph.nodes[add] as NodeTransform).inputs[0]
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model5.graph.nodes[y].outputs[0]
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input: (model6.graph.nodes[add] as NodeTransform).inputs[1]
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_NODE,
        node: add
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: 'c',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model7,
        focus: {
            kind: FocusKind.FINDER_CHANGE,
            search: '',
            options: ['Number', 'Add', 'Sub'],
            node: add,
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model9).toEqual(expectedModel)
})


test("pressing enter with finder in change mode replaces node but preserves inputs and outputs", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        operations: {
            'Number': {
                kind: OperationKind.NUMBER,
                name: 'Number',
                outputs: ['out'],
            },
            'Add': {
                kind: OperationKind.TRANSFORM,
                name: 'Add',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: addFunc
            },
            'Sub': {
                kind: OperationKind.TRANSFORM,
                name: 'Sub',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: subFunc
            },
        }
    }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: model0.operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0]
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: (model4.graph.nodes[add] as NodeTransform).inputs[0]
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model5.graph.nodes[y].outputs[0]
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input: (model6.graph.nodes[add] as NodeTransform).inputs[1]
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_NODE,
        node: add
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: 'c',
        ctrl: false
    })
    let model10 = model9
    for (const key of "Sub") {
        const { model: nextModel } = update(effects, model10, {
            kind: EventKind.KEYDOWN,
            key: key,
            ctrl: false
        })
        model10 = nextModel
    }
    const { model: model11 } = update(effects, model10, {
        kind: EventKind.KEYDOWN,
        key: 'Enter',
        ctrl: false
    })
    const node = model7.graph.nodes[add] as NodeTransform
    const expectedModel: Model = {
        ...model7,
        graph: {
            ...model7.graph,
            nodes: {
                ...model7.graph.nodes,
                [node.uuid]: {
                    ...node,
                    name: 'Sub',
                    func: subFunc,
                }
            }
        }
    }
    expect(model11).toEqual(expectedModel)
})

test("change node with different input and output names", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        operations: {
            'Number': {
                kind: OperationKind.NUMBER,
                name: 'Number',
                outputs: ['out'],
            },
            'Add': {
                kind: OperationKind.TRANSFORM,
                name: 'Add',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: addFunc
            },
            'Column': {
                kind: OperationKind.TRANSFORM,
                name: 'Column',
                inputs: ['table', 'column'],
                outputs: ['data'],
                func: column
            },
        }
    }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: model0.operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0]
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: (model4.graph.nodes[add] as NodeTransform).inputs[0]
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model5.graph.nodes[y].outputs[0]
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input: (model6.graph.nodes[add] as NodeTransform).inputs[1]
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_NODE,
        node: add
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: 'c',
        ctrl: false
    })
    let model10 = model9
    for (const key of "Column") {
        const { model: nextModel } = update(effects, model10, {
            kind: EventKind.KEYDOWN,
            key: key,
            ctrl: false
        })
        model10 = nextModel
    }
    const { model: model11 } = update(effects, model10, {
        kind: EventKind.KEYDOWN,
        key: 'Enter',
        ctrl: false
    })
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
                    name: 'Column',
                    func: column,
                }
            },
            inputs: {
                [node.inputs[0]]: {
                    uuid: node.inputs[0],
                    node: node.uuid,
                    name: 'table',
                    edge: edges[0]
                },
                [node.inputs[1]]: {
                    uuid: node.inputs[1],
                    node: node.uuid,
                    name: 'column',
                    edge: edges[1]
                }
            },
            outputs: {
                ...model7.graph.outputs,
                [node.outputs[0]]: {
                    uuid: node.outputs[0],
                    node: node.uuid,
                    name: 'data',
                    edges: []
                }
            }
        }
    }
    expect(model11).toEqual(expectedModel)
})

test("change node with more inputs then existing node", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        operations: {
            'Number': {
                kind: OperationKind.NUMBER,
                name: 'Number',
                outputs: ['out'],
            },
            'Add': {
                kind: OperationKind.TRANSFORM,
                name: 'Add',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: addFunc
            },
            'Linspace': {
                kind: OperationKind.TRANSFORM,
                name: 'Linspace',
                inputs: ['start', 'stop', 'num'],
                outputs: ['out'],
                func: linspaceFunc
            },
        }
    }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: model0.operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0]
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: (model4.graph.nodes[add] as NodeTransform).inputs[0]
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model5.graph.nodes[y].outputs[0]
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input: (model6.graph.nodes[add] as NodeTransform).inputs[1]
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_NODE,
        node: add
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: 'c',
        ctrl: false
    })
    let model10 = model9
    for (const key of "Linspace") {
        const { model: nextModel } = update(effects, model10, {
            kind: EventKind.KEYDOWN,
            key: key,
            ctrl: false
        })
        model10 = nextModel
    }
    const { model: model11 } = update(effects, model10, {
        kind: EventKind.KEYDOWN,
        key: 'Enter',
        ctrl: false
    })
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
                    inputs: [...node.inputs, '13'],
                    name: 'Linspace',
                    func: linspaceFunc,
                }
            },
            inputs: {
                [node.inputs[0]]: {
                    uuid: node.inputs[0],
                    node: node.uuid,
                    name: 'start',
                    edge: edges[0]
                },
                [node.inputs[1]]: {
                    uuid: node.inputs[1],
                    node: node.uuid,
                    name: 'stop',
                    edge: edges[1]
                },
                '13': {
                    uuid: '13',
                    node: node.uuid,
                    name: 'num',
                }
            },
            bodys: {
                ...model7.graph.bodys,
                [node.body]: {
                    kind: BodyKind.NO,
                    uuid: node.body,
                    node: node.uuid
                }
            }
        }
    }
    expect(model11).toEqual(expectedModel)
})
