import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-cpu'

import { Model } from '../../src/model'
import { emptyModel } from '../../src/model/empty'
import { FocusKind } from '../../src/model/focus'
import { Operations } from "../../src/model/graph"
import { QuickSelectKind } from '../../src/model/quick_select'
import { addNodeToGraph, EventKind, update } from '../../src/update'
import { EffectModel, makeEffects } from "../mock_effects"

const model = emptyModel({ width: 500, height: 500 })

test("connecting all inputs for node evaluates operation", () => {
    const effectModel: EffectModel = { uuid: 0, time: 0 }
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 5,
            outputs: ['out'],
        },
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            operation: tf.add
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_INPUT,
        input: model3.graph.nodes[add].inputs[0]
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0]
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_INPUT,
        input: model5.graph.nodes[add].inputs[1]
    })
    const { model: model7, render } = update(effects, model6, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[y].outputs[0]
    })
    const expectedModel: Model = {
        ...model,
        graph: {
            nodes: {
                [x]: {
                    uuid: x,
                    name: "Number",
                    inputs: [],
                    body: model4.graph.nodes[x].body!,
                    outputs: model4.graph.nodes[x].outputs,
                    position: { x: 0, y: 0 }
                },
                [y]: {
                    uuid: y,
                    name: "Number",
                    inputs: [],
                    body: model4.graph.nodes[y].body!,
                    outputs: model4.graph.nodes[y].outputs,
                    position: { x: 0, y: 0 }
                },
                [add]: {
                    uuid: add,
                    name: "Add",
                    inputs: model4.graph.nodes[add].inputs,
                    body: '12',
                    outputs: model4.graph.nodes[add].outputs,
                    position: { x: 0, y: 0 },
                    operation: tf.add
                },
            },
            edges: {
                "10": {
                    uuid: "10",
                    input: model4.graph.nodes[add].inputs[0],
                    output: "1",
                },
                "11": {
                    uuid: "11",
                    input: model4.graph.nodes[add].inputs[1],
                    output: "4",
                }
            },
            inputs: {
                [model4.graph.nodes[add].inputs[0]]: {
                    uuid: model4.graph.nodes[add].inputs[0],
                    name: "x",
                    node: add,
                    edge: "10"
                },
                [model4.graph.nodes[add].inputs[1]]: {
                    uuid: model4.graph.nodes[add].inputs[1],
                    name: "y",
                    node: add,
                    edge: "11"
                }
            },
            outputs: {
                [model4.graph.nodes[x].outputs[0]]: {
                    uuid: model4.graph.nodes[x].outputs[0],
                    name: "out",
                    node: x,
                    edges: ["10"]
                },
                [model4.graph.nodes[y].outputs[0]]: {
                    uuid: model4.graph.nodes[y].outputs[0],
                    name: "out",
                    node: y,
                    edges: ["11"]
                },
                [model4.graph.nodes[add].outputs[0]]: {
                    uuid: model4.graph.nodes[add].outputs[0],
                    name: "out",
                    node: add,
                    edges: []
                },
            },
            bodys: {
                [model4.graph.nodes[x].body!]: {
                    uuid: model4.graph.nodes[x].body!,
                    node: x,
                    value: 5,
                    shape: [],
                    editable: true,
                    rank: 0,
                },
                [model4.graph.nodes[y].body!]: {
                    uuid: model4.graph.nodes[y].body!,
                    node: y,
                    value: 5,
                    shape: [],
                    editable: true,
                    rank: 0,
                },
                '12': {
                    uuid: '12',
                    node: add,
                    value: 10,
                    shape: [],
                    editable: false,
                    rank: 0,
                },
            }
        },
        nodeOrder: [x, y, add],
        operations
    }
    expect(model7).toEqual(expectedModel)
    expect(render).toEqual(true)
})


test("clicking output after clicking input adds connection", () => {
    const effectModel: EffectModel = { uuid: 0, time: 0 }
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 5,
            outputs: ['out'],
        },
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            operation: tf.add
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_INPUT,
        input: model3.graph.nodes[add].inputs[0]
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0]
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_INPUT,
        input: model5.graph.nodes[add].inputs[1]
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[y].outputs[0]
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_BODY,
        body: model3.graph.nodes[x].body!
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: 'Backspace',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model,
        graph: {
            nodes: {
                [x]: {
                    uuid: x,
                    name: "Number",
                    inputs: [],
                    body: model4.graph.nodes[x].body!,
                    outputs: model4.graph.nodes[x].outputs,
                    position: { x: 0, y: 0 }
                },
                [y]: {
                    uuid: y,
                    name: "Number",
                    inputs: [],
                    body: model4.graph.nodes[y].body!,
                    outputs: model4.graph.nodes[y].outputs,
                    position: { x: 0, y: 0 }
                },
                [add]: {
                    uuid: add,
                    name: "Add",
                    inputs: model4.graph.nodes[add].inputs,
                    body: '13',
                    outputs: model4.graph.nodes[add].outputs,
                    position: { x: 0, y: 0 },
                    operation: tf.add
                },
            },
            edges: {
                "10": {
                    uuid: "10",
                    input: model4.graph.nodes[add].inputs[0],
                    output: "1",
                },
                "11": {
                    uuid: "11",
                    input: model4.graph.nodes[add].inputs[1],
                    output: "4",
                }
            },
            inputs: {
                [model4.graph.nodes[add].inputs[0]]: {
                    uuid: model4.graph.nodes[add].inputs[0],
                    name: "x",
                    node: add,
                    edge: "10"
                },
                [model4.graph.nodes[add].inputs[1]]: {
                    uuid: model4.graph.nodes[add].inputs[1],
                    name: "y",
                    node: add,
                    edge: "11"
                }
            },
            outputs: {
                [model4.graph.nodes[x].outputs[0]]: {
                    uuid: model4.graph.nodes[x].outputs[0],
                    name: "out",
                    node: x,
                    edges: ["10"]
                },
                [model4.graph.nodes[y].outputs[0]]: {
                    uuid: model4.graph.nodes[y].outputs[0],
                    name: "out",
                    node: y,
                    edges: ["11"]
                },
                [model4.graph.nodes[add].outputs[0]]: {
                    uuid: model4.graph.nodes[add].outputs[0],
                    name: "out",
                    node: add,
                    edges: []
                },
            },
            bodys: {
                [model4.graph.nodes[x].body!]: {
                    uuid: model4.graph.nodes[x].body!,
                    node: x,
                    value: 0,
                    shape: [],
                    editable: true,
                    rank: 0,
                },
                [model4.graph.nodes[y].body!]: {
                    uuid: model4.graph.nodes[y].body!,
                    node: y,
                    value: 5,
                    shape: [],
                    editable: true,
                    rank: 0,
                },
                '13': {
                    uuid: '13',
                    node: add,
                    value: 5,
                    shape: [],
                    editable: false,
                    rank: 0,
                },
            }
        },
        nodeOrder: [x, y, add],
        focus: {
            kind: FocusKind.BODY,
            body: model4.graph.nodes[x].body!,
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        operations
    }
    expect(model9).toEqual(expectedModel)
})

test("deleting input edge deletes body in associated input node and propagates out", () => {
    const effectModel: EffectModel = { uuid: 0, time: 0 }
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 5,
            outputs: ['out'],
        },
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            operation: tf.add
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_INPUT,
        input: model3.graph.nodes[add].inputs[0]
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0]
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_INPUT,
        input: model5.graph.nodes[add].inputs[1]
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model6.graph.nodes[y].outputs[0]
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_INPUT,
        input: model7.graph.nodes[add].inputs[1]
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: 'd',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model,
        graph: {
            nodes: {
                [x]: {
                    uuid: x,
                    name: "Number",
                    inputs: [],
                    body: model4.graph.nodes[x].body!,
                    outputs: model4.graph.nodes[x].outputs,
                    position: { x: 0, y: 0 }
                },
                [y]: {
                    uuid: y,
                    name: "Number",
                    inputs: [],
                    body: model4.graph.nodes[y].body!,
                    outputs: model4.graph.nodes[y].outputs,
                    position: { x: 0, y: 0 }
                },
                [add]: {
                    uuid: add,
                    name: "Add",
                    inputs: model4.graph.nodes[add].inputs,
                    outputs: model4.graph.nodes[add].outputs,
                    position: { x: 0, y: 0 },
                    operation: tf.add
                },
            },
            edges: {
                "10": {
                    uuid: "10",
                    input: model4.graph.nodes[add].inputs[0],
                    output: "1",
                },
            },
            inputs: {
                [model4.graph.nodes[add].inputs[0]]: {
                    uuid: model4.graph.nodes[add].inputs[0],
                    name: "x",
                    node: add,
                    edge: "10"
                },
                [model4.graph.nodes[add].inputs[1]]: {
                    uuid: model4.graph.nodes[add].inputs[1],
                    name: "y",
                    node: add,
                }
            },
            outputs: {
                [model4.graph.nodes[x].outputs[0]]: {
                    uuid: model4.graph.nodes[x].outputs[0],
                    name: "out",
                    node: x,
                    edges: ["10"]
                },
                [model4.graph.nodes[y].outputs[0]]: {
                    uuid: model4.graph.nodes[y].outputs[0],
                    name: "out",
                    node: y,
                    edges: []
                },
                [model4.graph.nodes[add].outputs[0]]: {
                    uuid: model4.graph.nodes[add].outputs[0],
                    name: "out",
                    node: add,
                    edges: []
                },
            },
            bodys: {
                [model4.graph.nodes[x].body!]: {
                    uuid: model4.graph.nodes[x].body!,
                    node: x,
                    value: 5,
                    shape: [],
                    editable: true,
                    rank: 0,
                },
                [model4.graph.nodes[y].body!]: {
                    uuid: model4.graph.nodes[y].body!,
                    node: y,
                    value: 5,
                    shape: [],
                    editable: true,
                    rank: 0,
                },
            }
        },
        nodeOrder: [x, y, add],
        operations
    }
    expect(model9).toEqual(expectedModel)
})

test("deleting output edge deletes body in associated input node and propagates out", () => {
    const effectModel: EffectModel = { uuid: 0, time: 0 }
    const effects = makeEffects(effectModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 5,
            outputs: ['out'],
        },
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            operation: tf.add
        },
    }
    const model0: Model = { ...model, operations }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_INPUT,
        input: model3.graph.nodes[add].inputs[0]
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0]
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_INPUT,
        input: model5.graph.nodes[add].inputs[1]
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model6.graph.nodes[y].outputs[0]
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model7.graph.nodes[y].outputs[0]
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: 'd',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model,
        graph: {
            nodes: {
                [x]: {
                    uuid: x,
                    name: "Number",
                    inputs: [],
                    body: model4.graph.nodes[x].body!,
                    outputs: model4.graph.nodes[x].outputs,
                    position: { x: 0, y: 0 }
                },
                [y]: {
                    uuid: y,
                    name: "Number",
                    inputs: [],
                    body: model4.graph.nodes[y].body!,
                    outputs: model4.graph.nodes[y].outputs,
                    position: { x: 0, y: 0 }
                },
                [add]: {
                    uuid: add,
                    name: "Add",
                    inputs: model4.graph.nodes[add].inputs,
                    outputs: model4.graph.nodes[add].outputs,
                    position: { x: 0, y: 0 },
                    operation: tf.add
                },
            },
            edges: {
                "10": {
                    uuid: "10",
                    input: model4.graph.nodes[add].inputs[0],
                    output: "1",
                },
            },
            inputs: {
                [model4.graph.nodes[add].inputs[0]]: {
                    uuid: model4.graph.nodes[add].inputs[0],
                    name: "x",
                    node: add,
                    edge: "10"
                },
                [model4.graph.nodes[add].inputs[1]]: {
                    uuid: model4.graph.nodes[add].inputs[1],
                    name: "y",
                    node: add,
                }
            },
            outputs: {
                [model4.graph.nodes[x].outputs[0]]: {
                    uuid: model4.graph.nodes[x].outputs[0],
                    name: "out",
                    node: x,
                    edges: ["10"]
                },
                [model4.graph.nodes[y].outputs[0]]: {
                    uuid: model4.graph.nodes[y].outputs[0],
                    name: "out",
                    node: y,
                    edges: []
                },
                [model4.graph.nodes[add].outputs[0]]: {
                    uuid: model4.graph.nodes[add].outputs[0],
                    name: "out",
                    node: add,
                    edges: []
                },
            },
            bodys: {
                [model4.graph.nodes[x].body!]: {
                    uuid: model4.graph.nodes[x].body!,
                    node: x,
                    value: 5,
                    shape: [],
                    editable: true,
                    rank: 0,
                },
                [model4.graph.nodes[y].body!]: {
                    uuid: model4.graph.nodes[y].body!,
                    node: y,
                    value: 5,
                    shape: [],
                    editable: true,
                    rank: 0,
                },
            }
        },
        nodeOrder: [x, y, add],
        operations
    }
    expect(model9).toEqual(expectedModel)
})
