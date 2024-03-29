import * as tf from "@tensorflow/tfjs"

import { Model } from "../../src/model"
import { emptyModel } from "../../src/model/empty"
import { FocusKind } from "../../src/model/focus"
import {
    BodyKind,
    NodeKind,
    NodeTransform,
    OperationKind,
    Operations,
} from "../../src/model/graph"
import { tensorFunc } from "../../src/model/operations"
import { QuickSelectKind } from "../../src/model/quick_select"
import { addNodeToGraph, update, updateNumberText } from "../../src/update"
import { EffectModel, makeEffects } from "../mock_effects"
import { EventKind } from "../../src/event"
import { mockDocument } from "../../src/ui/mock"

const model = emptyModel({ width: 500, height: 500 })

const addFunc = tensorFunc(tf.add)

test("connecting all inputs for node evaluates operation", () => {
    const effectModel: EffectModel = { uuid: 0, time: 0 }
    const effects = makeEffects(mockDocument(), effectModel)
    const onTableUploaded = () => {}
    const dispatch = () => {}
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
    const model0: Model = { ...model, operations }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model2 = updateNumberText(
        model1,
        model1.graph.nodes[x].body,
        () => "5"
    )
    const { model: model3, node: y } = addNodeToGraph({
        model: model2,
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model4 = updateNumberText(
        model3,
        model3.graph.nodes[y].body,
        () => "5"
    )
    const { model: model5, node: add } = addNodeToGraph({
        model: model4,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model5.graph.nodes[add] as NodeTransform).inputs[0],
        },
        dispatch
    )
    const model7 = update(
        effects,
        model6,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model5.graph.nodes[x].outputs[0],
        },
        dispatch
    )
    const model8 = update(
        effects,
        model7,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model5.graph.nodes[add] as NodeTransform).inputs[1],
        },
        dispatch
    )
    const model9 = update(
        effects,
        model8,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model3.graph.nodes[y].outputs[0],
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model,
        graph: {
            nodes: {
                [x]: {
                    kind: NodeKind.SOURCE,
                    uuid: x,
                    name: "Number",
                    body: model5.graph.nodes[x].body,
                    outputs: model5.graph.nodes[x].outputs,
                    position: { x: 0, y: 0 },
                },
                [y]: {
                    kind: NodeKind.SOURCE,
                    uuid: y,
                    name: "Number",
                    body: model5.graph.nodes[y].body,
                    outputs: model5.graph.nodes[y].outputs,
                    position: { x: 0, y: 0 },
                },
                [add]: {
                    kind: NodeKind.TRANSFORM,
                    uuid: add,
                    name: "Add",
                    inputs: (model5.graph.nodes[add] as NodeTransform).inputs,
                    body: model5.graph.nodes[add].body,
                    outputs: model5.graph.nodes[add].outputs,
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
            },
            edges: {
                "11": {
                    uuid: "11",
                    input: (model5.graph.nodes[add] as NodeTransform).inputs[0],
                    output: "1",
                },
                "12": {
                    uuid: "12",
                    input: (model5.graph.nodes[add] as NodeTransform).inputs[1],
                    output: "4",
                },
            },
            inputs: {
                [(model5.graph.nodes[add] as NodeTransform).inputs[0]]: {
                    uuid: (model5.graph.nodes[add] as NodeTransform).inputs[0],
                    name: "x",
                    node: add,
                    edge: "11",
                },
                [(model5.graph.nodes[add] as NodeTransform).inputs[1]]: {
                    uuid: (model5.graph.nodes[add] as NodeTransform).inputs[1],
                    name: "y",
                    node: add,
                    edge: "12",
                },
            },
            outputs: {
                [model5.graph.nodes[x].outputs[0]]: {
                    uuid: model5.graph.nodes[x].outputs[0],
                    name: "out",
                    node: x,
                    edges: ["11"],
                },
                [model5.graph.nodes[y].outputs[0]]: {
                    uuid: model5.graph.nodes[y].outputs[0],
                    name: "out",
                    node: y,
                    edges: ["12"],
                },
                [model5.graph.nodes[add].outputs[0]]: {
                    uuid: model5.graph.nodes[add].outputs[0],
                    name: "out",
                    node: add,
                    edges: [],
                },
            },
            bodys: {
                [model5.graph.nodes[x].body]: {
                    kind: BodyKind.NUMBER,
                    uuid: model5.graph.nodes[x].body,
                    node: x,
                    value: 5,
                    text: "5",
                },
                [model5.graph.nodes[y].body]: {
                    kind: BodyKind.NUMBER,
                    uuid: model5.graph.nodes[y].body,
                    node: y,
                    value: 5,
                    text: "5",
                },
                [model5.graph.nodes[add].body]: {
                    kind: BodyKind.TENSOR,
                    uuid: model5.graph.nodes[add].body,
                    node: add,
                    value: 10,
                    shape: [],
                    rank: 0,
                },
            },
        },
        nodeOrder: [x, y, add],
        operations,
    }
    expect(model9).toEqual(expectedModel)
})

test("changing body retriggers evaluation", () => {
    const effectModel: EffectModel = { uuid: 0, time: 0 }
    const effects = makeEffects(mockDocument(), effectModel)
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
    const model0: Model = { ...model, operations }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model2 = updateNumberText(
        model1,
        model1.graph.nodes[x].body,
        () => "5"
    )
    const { model: model3, node: y } = addNodeToGraph({
        model: model2,
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model4 = updateNumberText(
        model3,
        model3.graph.nodes[y].body,
        () => "5"
    )
    const { model: model5, node: add } = addNodeToGraph({
        model: model4,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model5.graph.nodes[add] as NodeTransform).inputs[0],
        },
        dispatch
    )
    const model7 = update(
        effects,
        model6,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model5.graph.nodes[x].outputs[0],
        },
        dispatch
    )
    const model8 = update(
        effects,
        model7,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model5.graph.nodes[add] as NodeTransform).inputs[1],
        },
        dispatch
    )
    const model9 = update(
        effects,
        model8,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model3.graph.nodes[y].outputs[0],
        },
        dispatch
    )
    const model10 = update(
        effects,
        model9,
        {
            kind: EventKind.CLICKED_BODY,
            body: model3.graph.nodes[x].body,
        },
        dispatch
    )
    const model11 = update(
        effects,
        model10,
        {
            kind: EventKind.KEYDOWN,
            key: "Backspace",
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model,
        graph: {
            nodes: {
                [x]: {
                    kind: NodeKind.SOURCE,
                    uuid: x,
                    name: "Number",
                    body: model5.graph.nodes[x].body,
                    outputs: model5.graph.nodes[x].outputs,
                    position: { x: 0, y: 0 },
                },
                [y]: {
                    kind: NodeKind.SOURCE,
                    uuid: y,
                    name: "Number",
                    body: model5.graph.nodes[y].body,
                    outputs: model5.graph.nodes[y].outputs,
                    position: { x: 0, y: 0 },
                },
                [add]: {
                    kind: NodeKind.TRANSFORM,
                    uuid: add,
                    name: "Add",
                    inputs: (model5.graph.nodes[add] as NodeTransform).inputs,
                    body: model5.graph.nodes[add].body,
                    outputs: model5.graph.nodes[add].outputs,
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
            },
            edges: {
                "11": {
                    uuid: "11",
                    input: (model5.graph.nodes[add] as NodeTransform).inputs[0],
                    output: "1",
                },
                "12": {
                    uuid: "12",
                    input: (model5.graph.nodes[add] as NodeTransform).inputs[1],
                    output: "4",
                },
            },
            inputs: {
                [(model5.graph.nodes[add] as NodeTransform).inputs[0]]: {
                    uuid: (model5.graph.nodes[add] as NodeTransform).inputs[0],
                    name: "x",
                    node: add,
                    edge: "11",
                },
                [(model5.graph.nodes[add] as NodeTransform).inputs[1]]: {
                    uuid: (model5.graph.nodes[add] as NodeTransform).inputs[1],
                    name: "y",
                    node: add,
                    edge: "12",
                },
            },
            outputs: {
                [model5.graph.nodes[x].outputs[0]]: {
                    uuid: model5.graph.nodes[x].outputs[0],
                    name: "out",
                    node: x,
                    edges: ["11"],
                },
                [model5.graph.nodes[y].outputs[0]]: {
                    uuid: model5.graph.nodes[y].outputs[0],
                    name: "out",
                    node: y,
                    edges: ["12"],
                },
                [model5.graph.nodes[add].outputs[0]]: {
                    uuid: model5.graph.nodes[add].outputs[0],
                    name: "out",
                    node: add,
                    edges: [],
                },
            },
            bodys: {
                [model5.graph.nodes[x].body]: {
                    kind: BodyKind.NUMBER,
                    uuid: model5.graph.nodes[x].body,
                    node: x,
                    value: 0,
                    text: "0",
                },
                [model5.graph.nodes[y].body]: {
                    kind: BodyKind.NUMBER,
                    uuid: model5.graph.nodes[y].body,
                    node: y,
                    value: 5,
                    text: "5",
                },
                [model5.graph.nodes[add].body]: {
                    kind: BodyKind.TENSOR,
                    uuid: model5.graph.nodes[add].body,
                    node: add,
                    value: 5,
                    shape: [],
                    rank: 0,
                },
            },
        },
        nodeOrder: [x, y, add],
        operations,
        focus: {
            kind: FocusKind.BODY_NUMBER,
            body: model5.graph.nodes[x].body,
            quickSelect: {
                kind: QuickSelectKind.NONE,
            },
        },
    }
    expect(model11).toEqual(expectedModel)
})

test("deleting input edge deletes body in associated input node and propagates out", () => {
    const effectModel: EffectModel = { uuid: 0, time: 0 }
    const effects = makeEffects(mockDocument(), effectModel)
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
    const model0: Model = { ...model, operations }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model2 = updateNumberText(
        model1,
        model1.graph.nodes[x].body,
        () => "5"
    )
    const { model: model3, node: y } = addNodeToGraph({
        model: model2,
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model4 = updateNumberText(
        model3,
        model3.graph.nodes[y].body,
        () => "5"
    )
    const { model: model5, node: add } = addNodeToGraph({
        model: model4,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model5.graph.nodes[add] as NodeTransform).inputs[0],
        },
        dispatch
    )
    const model7 = update(
        effects,
        model6,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model6.graph.nodes[x].outputs[0],
        },
        dispatch
    )
    const model8 = update(
        effects,
        model7,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model7.graph.nodes[add] as NodeTransform).inputs[1],
        },
        dispatch
    )
    const model9 = update(
        effects,
        model8,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model8.graph.nodes[y].outputs[0],
        },
        dispatch
    )
    const model10 = update(
        effects,
        model9,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model9.graph.nodes[add] as NodeTransform).inputs[1],
        },
        dispatch
    )
    const model11 = update(
        effects,
        model10,
        {
            kind: EventKind.KEYDOWN,
            key: "d",
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model,
        graph: {
            nodes: {
                [x]: {
                    kind: NodeKind.SOURCE,
                    uuid: x,
                    name: "Number",
                    body: model5.graph.nodes[x].body,
                    outputs: model5.graph.nodes[x].outputs,
                    position: { x: 0, y: 0 },
                },
                [y]: {
                    kind: NodeKind.SOURCE,
                    uuid: y,
                    name: "Number",
                    body: model5.graph.nodes[y].body,
                    outputs: model5.graph.nodes[y].outputs,
                    position: { x: 0, y: 0 },
                },
                [add]: {
                    kind: NodeKind.TRANSFORM,
                    uuid: add,
                    name: "Add",
                    inputs: (model5.graph.nodes[add] as NodeTransform).inputs,
                    body: model5.graph.nodes[add].body,
                    outputs: model5.graph.nodes[add].outputs,
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
            },
            edges: {
                "11": {
                    uuid: "11",
                    input: (model5.graph.nodes[add] as NodeTransform).inputs[0],
                    output: "1",
                },
            },
            inputs: {
                [(model5.graph.nodes[add] as NodeTransform).inputs[0]]: {
                    uuid: (model5.graph.nodes[add] as NodeTransform).inputs[0],
                    name: "x",
                    node: add,
                    edge: "11",
                },
                [(model5.graph.nodes[add] as NodeTransform).inputs[1]]: {
                    uuid: (model5.graph.nodes[add] as NodeTransform).inputs[1],
                    name: "y",
                    node: add,
                },
            },
            outputs: {
                [model5.graph.nodes[x].outputs[0]]: {
                    uuid: model5.graph.nodes[x].outputs[0],
                    name: "out",
                    node: x,
                    edges: ["11"],
                },
                [model5.graph.nodes[y].outputs[0]]: {
                    uuid: model5.graph.nodes[y].outputs[0],
                    name: "out",
                    node: y,
                    edges: [],
                },
                [model5.graph.nodes[add].outputs[0]]: {
                    uuid: model5.graph.nodes[add].outputs[0],
                    name: "out",
                    node: add,
                    edges: [],
                },
            },
            bodys: {
                [model5.graph.nodes[x].body]: {
                    kind: BodyKind.NUMBER,
                    uuid: model5.graph.nodes[x].body,
                    node: x,
                    value: 5,
                    text: "5",
                },
                [model5.graph.nodes[y].body]: {
                    kind: BodyKind.NUMBER,
                    uuid: model5.graph.nodes[y].body,
                    node: y,
                    value: 5,
                    text: "5",
                },
                [model5.graph.nodes[add].body]: {
                    kind: BodyKind.NO,
                    uuid: model5.graph.nodes[add].body,
                    node: add,
                },
            },
        },
        nodeOrder: [x, y, add],
        operations,
    }
    expect(model11).toEqual(expectedModel)
})

test("deleting output edge deletes body in associated input node and propagates out", () => {
    const effectModel: EffectModel = { uuid: 0, time: 0 }
    const effects = makeEffects(mockDocument(), effectModel)
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
    const model0: Model = { ...model, operations }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model2 = updateNumberText(
        model1,
        model1.graph.nodes[x].body,
        () => "5"
    )
    const { model: model3, node: y } = addNodeToGraph({
        model: model2,
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model4 = updateNumberText(
        model3,
        model3.graph.nodes[y].body,
        () => "5"
    )
    const { model: model5, node: add } = addNodeToGraph({
        model: model4,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
        onTableUploaded,
    })
    const model6 = update(
        effects,
        model5,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model5.graph.nodes[add] as NodeTransform).inputs[0],
        },
        dispatch
    )
    const model7 = update(
        effects,
        model6,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model6.graph.nodes[x].outputs[0],
        },
        dispatch
    )
    const model8 = update(
        effects,
        model7,
        {
            kind: EventKind.CLICKED_INPUT,
            input: (model7.graph.nodes[add] as NodeTransform).inputs[1],
        },
        dispatch
    )
    const model9 = update(
        effects,
        model8,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model8.graph.nodes[y].outputs[0],
        },
        dispatch
    )
    const model10 = update(
        effects,
        model9,
        {
            kind: EventKind.CLICKED_OUTPUT,
            output: model9.graph.nodes[y].outputs[0],
        },
        dispatch
    )
    const model11 = update(
        effects,
        model10,
        {
            kind: EventKind.KEYDOWN,
            key: "d",
        },
        dispatch
    )
    const expectedModel: Model = {
        ...model,
        graph: {
            nodes: {
                [x]: {
                    kind: NodeKind.SOURCE,
                    uuid: x,
                    name: "Number",
                    body: model5.graph.nodes[x].body,
                    outputs: model5.graph.nodes[x].outputs,
                    position: { x: 0, y: 0 },
                },
                [y]: {
                    kind: NodeKind.SOURCE,
                    uuid: y,
                    name: "Number",
                    body: model5.graph.nodes[y].body,
                    outputs: model5.graph.nodes[y].outputs,
                    position: { x: 0, y: 0 },
                },
                [add]: {
                    kind: NodeKind.TRANSFORM,
                    uuid: add,
                    name: "Add",
                    inputs: (model5.graph.nodes[add] as NodeTransform).inputs,
                    body: model5.graph.nodes[add].body,
                    outputs: model5.graph.nodes[add].outputs,
                    position: { x: 0, y: 0 },
                    func: addFunc,
                },
            },
            edges: {
                "11": {
                    uuid: "11",
                    input: (model5.graph.nodes[add] as NodeTransform).inputs[0],
                    output: "1",
                },
            },
            inputs: {
                [(model5.graph.nodes[add] as NodeTransform).inputs[0]]: {
                    uuid: (model5.graph.nodes[add] as NodeTransform).inputs[0],
                    name: "x",
                    node: add,
                    edge: "11",
                },
                [(model5.graph.nodes[add] as NodeTransform).inputs[1]]: {
                    uuid: (model5.graph.nodes[add] as NodeTransform).inputs[1],
                    name: "y",
                    node: add,
                },
            },
            outputs: {
                [model5.graph.nodes[x].outputs[0]]: {
                    uuid: model5.graph.nodes[x].outputs[0],
                    name: "out",
                    node: x,
                    edges: ["11"],
                },
                [model5.graph.nodes[y].outputs[0]]: {
                    uuid: model5.graph.nodes[y].outputs[0],
                    name: "out",
                    node: y,
                    edges: [],
                },
                [model5.graph.nodes[add].outputs[0]]: {
                    uuid: model5.graph.nodes[add].outputs[0],
                    name: "out",
                    node: add,
                    edges: [],
                },
            },
            bodys: {
                [model5.graph.nodes[x].body]: {
                    kind: BodyKind.NUMBER,
                    uuid: model5.graph.nodes[x].body,
                    node: x,
                    value: 5,
                    text: "5",
                },
                [model5.graph.nodes[y].body]: {
                    kind: BodyKind.NUMBER,
                    uuid: model5.graph.nodes[y].body,
                    node: y,
                    value: 5,
                    text: "5",
                },
                [model5.graph.nodes[add].body]: {
                    kind: BodyKind.NO,
                    uuid: model5.graph.nodes[add].body,
                    node: add,
                },
            },
        },
        nodeOrder: [x, y, add],
        operations,
    }
    expect(model11).toEqual(expectedModel)
})
