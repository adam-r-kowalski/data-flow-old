import * as tf from "@tensorflow/tfjs"
import { EventKind } from "../../src/event"

import { emptyModel } from "../../src/model/empty"
import { OperationKind, Operations } from "../../src/model/graph"
import { tensorFunc } from "../../src/model/operations"
import { mockDocument } from "../../src/ui/mock"
import { addNodeToGraph, update } from "../../src/update"
import { changeNodePosition } from "../../src/update/graph"
import { makeEffects, makeTracked, resetTracked } from "../mock_effects"

const model = emptyModel({ width: 500, height: 500 })

const addFunc = tensorFunc(tf.add)

test("h when a node is focused moves node left", () => {
    let tracked = makeTracked()
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
    const model0 = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.CLICKED_NODE,
            node,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "h",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    expect(model3).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: true, up: false, down: false, right: false, now: 0 },
        },
    })
    const model4 = update(
        tracked.effects,
        model3,
        {
            kind: EventKind.MOVE_NODE,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(tracked.times).toEqual([10])
    expect(model4).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: true, up: false, down: false, right: false, now: 1 },
        },
        graph: changeNodePosition(model2.graph, node, () => ({
            x: -0.5,
            y: 0,
        })),
    })
    tracked = resetTracked(tracked)
    const model5 = update(
        tracked.effects,
        model4,
        {
            kind: EventKind.KEYUP,
            key: "h",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    expect(model5).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: false, right: false, now: 1 },
        },
        graph: changeNodePosition(model2.graph, node, () => ({
            x: -0.5,
            y: 0,
        })),
    })
})

test("j when a node is focused moves node down", () => {
    let tracked = makeTracked()
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
    const model0 = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.CLICKED_NODE,
            node,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "j",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(tracked.times).toEqual([])
    expect(model3).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: true, right: false, now: 0 },
        },
    })
    tracked = resetTracked(tracked)
    const model4 = update(
        tracked.effects,
        model3,
        {
            kind: EventKind.MOVE_NODE,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(tracked.times).toEqual([10])
    expect(model4).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: true, right: false, now: 1 },
        },
        graph: changeNodePosition(model2.graph, node, () => ({ x: 0, y: 0.5 })),
    })
    tracked = resetTracked(tracked)
    const model5 = update(
        tracked.effects,
        model4,
        {
            kind: EventKind.KEYUP,
            key: "j",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    expect(model5).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: false, right: false, now: 1 },
        },
        graph: changeNodePosition(model2.graph, node, () => ({ x: 0, y: 0.5 })),
    })
})

test("k when a node is focused moves node up", () => {
    let tracked = makeTracked()
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
    const model0 = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.CLICKED_NODE,
            node,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "k",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(tracked.times).toEqual([])
    expect(model3).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: true, down: false, right: false, now: 0 },
        },
    })
    tracked = resetTracked(tracked)
    const model4 = update(
        tracked.effects,
        model3,
        {
            kind: EventKind.MOVE_NODE,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(tracked.times).toEqual([10])
    expect(model4).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: true, down: false, right: false, now: 1 },
        },
        graph: changeNodePosition(model2.graph, node, () => ({
            x: 0,
            y: -0.5,
        })),
    })
    tracked = resetTracked(tracked)
    const model5 = update(
        tracked.effects,
        model4,
        {
            kind: EventKind.KEYUP,
            key: "k",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    expect(model5).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: false, right: false, now: 1 },
        },
        graph: changeNodePosition(model2.graph, node, () => ({
            x: 0,
            y: -0.5,
        })),
    })
})

test("l when a node is focused moves node right", () => {
    let tracked = makeTracked()
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
    const model0 = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.CLICKED_NODE,
            node,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "l",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    expect(model3).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: false, right: true, now: 0 },
        },
    })
    const model4 = update(
        tracked.effects,
        model3,
        {
            kind: EventKind.MOVE_NODE,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(tracked.times).toEqual([10])
    tracked = resetTracked(tracked)
    expect(model4).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: false, right: true, now: 1 },
        },
        graph: changeNodePosition(model2.graph, node, () => ({ x: 0.5, y: 0 })),
    })
    const model5 = update(
        tracked.effects,
        model4,
        {
            kind: EventKind.KEYUP,
            key: "l",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    expect(model5).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: false, up: false, down: false, right: false, now: 1 },
        },
        graph: changeNodePosition(model2.graph, node, () => ({ x: 0.5, y: 0 })),
    })
})

test("pressing a non hotkey when node focused does nothing", () => {
    let effects = makeEffects(mockDocument())
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
    const model0 = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects: effects,
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
            key: "z",
        },
        dispatch
    )
    expect(model3).toEqual(model2)
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.MOVE_NODE,
        },
        dispatch
    )
    expect(model4).toEqual(model2)
    const model5 = update(
        effects,
        model4,
        {
            kind: EventKind.KEYUP,
            key: "z",
        },
        dispatch
    )
    expect(model5).toEqual(model2)
})

test("pressing h then l when node focused does nothing", () => {
    let tracked = makeTracked()
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
    const model0 = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects: tracked.effects,
        onTableUploaded,
    })
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.CLICKED_NODE,
            node,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYDOWN,
            key: "h",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model4 = update(
        tracked.effects,
        model3,
        {
            kind: EventKind.KEYDOWN,
            key: "l",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model5 = update(
        tracked.effects,
        model4,
        {
            kind: EventKind.MOVE_NODE,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.MOVE_NODE }])
    expect(tracked.times).toEqual([10])
    expect(model5).toEqual({
        ...model2,
        focus: {
            ...model2.focus,
            move: { left: true, up: false, down: false, right: true, now: 1 },
        },
    })
})

test("move node when nothing focused does nothing", () => {
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
    const model0 = { ...model, operations }
    const { model: model1 } = addNodeToGraph({
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
            kind: EventKind.MOVE_NODE,
        },
        dispatch
    )
    expect(model2).toEqual(model1)
})
