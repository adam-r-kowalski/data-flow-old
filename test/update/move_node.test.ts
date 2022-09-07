import * as tf from '@tensorflow/tfjs-core'

import { emptyModel } from "../../src/model/empty"
import { OperationKind, Operations } from "../../src/model/graph"
import { tensorFunc } from "../../src/model/operations"
import { addNodeToGraph, EventKind, update } from "../../src/update"
import { changeNodePosition } from "../../src/update/graph"
import { makeEffects } from "../mock_effects"

const model = emptyModel({ width: 500, height: 500 })

const addFunc = tensorFunc(tf.add)

test("h when a node is focused moves node left", () => {
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
    const model0 = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model3, dispatch } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'h',
        ctrl: false
    })
    expect(dispatch).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(model3).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: true, up: false, down: false, right: false, now: 0 }
        }
    })
    const { model: model4, schedule } = update(effects, model3, {
        kind: EventKind.MOVE_NODE,
    })
    expect(schedule).toEqual([{
        after: { milliseconds: 10 },
        event: { kind: EventKind.MOVE_NODE }
    }])
    expect(model4).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: true, up: false, down: false, right: false, now: 1 }
        },
        graph: changeNodePosition(model2.graph, node, () => ({ x: -0.5, y: 0 }))
    })
    const { model: model5, dispatch: dispatch1 } = update(effects, model4, {
        kind: EventKind.KEYUP,
        key: 'h',
        ctrl: false
    })
    expect(dispatch1).toBeUndefined()
    expect(model5).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: false, right: false, now: 1 }
        },
        graph: changeNodePosition(model2.graph, node, () => ({ x: -0.5, y: 0 }))
    })
})

test("j when a node is focused moves node down", () => {
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
    const model0 = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model3, dispatch } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'j',
        ctrl: false
    })
    expect(dispatch).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(model3).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: true, right: false, now: 0 }
        }
    })
    const { model: model4, schedule } = update(effects, model3, {
        kind: EventKind.MOVE_NODE,
    })
    expect(schedule).toEqual([{
        after: { milliseconds: 10 },
        event: { kind: EventKind.MOVE_NODE }
    }])
    expect(model4).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: true, right: false, now: 1 }
        },
        graph: changeNodePosition(model2.graph, node, () => ({ x: 0, y: 0.5 }))
    })
    const { model: model5, dispatch: dispatch1 } = update(effects, model4, {
        kind: EventKind.KEYUP,
        key: 'j',
        ctrl: false
    })
    expect(dispatch1).toBeUndefined()
    expect(model5).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: false, right: false, now: 1 }
        },
        graph: changeNodePosition(model2.graph, node, () => ({ x: 0, y: 0.5 }))
    })
})

test("k when a node is focused moves node up", () => {
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
    const model0 = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model3, dispatch } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'k',
        ctrl: false
    })
    expect(dispatch).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(model3).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: true, down: false, right: false, now: 0 }
        }
    })
    const { model: model4, schedule } = update(effects, model3, {
        kind: EventKind.MOVE_NODE,
    })
    expect(schedule).toEqual([{
        after: { milliseconds: 10 },
        event: { kind: EventKind.MOVE_NODE }
    }])
    expect(model4).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: true, down: false, right: false, now: 1 }
        },
        graph: changeNodePosition(model2.graph, node, () => ({ x: 0, y: -0.5 }))
    })
    const { model: model5, dispatch: dispatch1 } = update(effects, model4, {
        kind: EventKind.KEYUP,
        key: 'k',
        ctrl: false
    })
    expect(dispatch1).toBeUndefined()
    expect(model5).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: false, right: false, now: 1 }
        },
        graph: changeNodePosition(model2.graph, node, () => ({ x: 0, y: -0.5 }))
    })
})

test("l when a node is focused moves node right", () => {
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
    const model0 = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model3, dispatch } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'l',
        ctrl: false
    })
    expect(dispatch).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(model3).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: false, right: true, now: 0 }
        }
    })
    const { model: model4, schedule } = update(effects, model3, {
        kind: EventKind.MOVE_NODE,
    })
    expect(schedule).toEqual([{
        after: { milliseconds: 10 },
        event: { kind: EventKind.MOVE_NODE }
    }])
    expect(model4).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: false, right: true, now: 1 }
        },
        graph: changeNodePosition(model2.graph, node, () => ({ x: 0.5, y: 0 }))
    })
    const { model: model5, dispatch: dispatch1 } = update(effects, model4, {
        kind: EventKind.KEYUP,
        key: 'l',
        ctrl: false
    })
    expect(dispatch1).toBeUndefined()
    expect(model5).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: false, right: false, now: 1 }
        },
        graph: changeNodePosition(model2.graph, node, () => ({ x: 0.5, y: 0 }))
    })
})

test("pressing a non hotkey when node focused does nothing", () => {
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
    const model0 = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model3, dispatch: dispatch0 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'z',
        ctrl: false
    })
    expect(dispatch0).toBeUndefined()
    expect(model3).toEqual(model2)
    const { model: model4, schedule: schedule0 } = update(effects, model3, {
        kind: EventKind.MOVE_NODE,
    })
    expect(schedule0).toBeUndefined()
    expect(model4).toEqual(model2)
    const { model: model5, dispatch: dispatch1 } = update(effects, model4, {
        kind: EventKind.KEYUP,
        key: 'z',
        ctrl: false,
    })
    expect(dispatch1).toBeUndefined()
    expect(model5).toEqual(model2)
})

test("pressing h then l when node focused does nothing", () => {
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
    const model0 = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model3, dispatch: dispatch0 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'h',
        ctrl: false
    })
    expect(dispatch0).toEqual([{ kind: EventKind.MOVE_NODE }])
    const { model: model4, dispatch: dispatch1 } = update(effects, model3, {
        kind: EventKind.KEYDOWN,
        key: 'l',
        ctrl: false
    })
    expect(dispatch1).toBeUndefined()
    const { model: model5, schedule } = update(effects, model4, {
        kind: EventKind.MOVE_NODE
    })
    expect(schedule).toEqual([{
        after: { milliseconds: 10 },
        event: { kind: EventKind.MOVE_NODE }
    }])
    expect(model5).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: true, up: false, down: false, right: true, now: 1 }
        }
    })
})

test("move node when nothing focused does nothing", () => {
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
    const model0 = { ...model, operations }
    const { model: model1 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.MOVE_NODE
    })
    expect(schedule).toBeUndefined()
    expect(model2).toEqual(model1)
})
