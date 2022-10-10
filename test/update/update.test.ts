import { update } from "../../src/update"
import { Model } from "../../src/model"
import { FocusKind } from "../../src/model/focus"
import { PointerActionKind } from "../../src/model/pointer_action"
import { Pointer } from "../../src/ui"
import { emptyModel } from "../../src/model/empty"
import { QuickSelectKind } from "../../src/model/quick_select"
import { makeEffects, makeTracked, resetTracked } from "../mock_effects"
import { EventKind } from "../../src/event"
import { mockDocument } from "../../src/ui/mock"

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
        },
        dispatch
    )
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.CLICKED_BACKGROUND,
        },
        dispatch
    )
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.POINTER_DOWN,
            pointer: pointer1,
        },
        dispatch
    )
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.CLICKED_BACKGROUND,
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
    expect(model4).toEqual(expectedModel)
})

test("double clicking background opens finder", () => {
    let tracked = makeTracked()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.POINTER_DOWN,
            pointer,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.CLICKED_BACKGROUND,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.OPEN_FINDER_TIMEOUT }])
    expect(tracked.times).toEqual([300])
    tracked = resetTracked(tracked)
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.POINTER_UP,
            pointer,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model4 = update(
        tracked.effects,
        model3,
        {
            kind: EventKind.POINTER_DOWN,
            pointer,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model5 = update(
        tracked.effects,
        model4,
        {
            kind: EventKind.CLICKED_BACKGROUND,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const expectedModel: Model = {
        ...model,
        pointers: [pointer],
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
        nodePlacementLocation: { x: 0, y: 0, show: false },
    }
    expect(model5).toEqual(expectedModel)
})

test("clicking background then waiting too long cancels opens finder", () => {
    let tracked = makeTracked()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.POINTER_DOWN,
            pointer,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.CLICKED_BACKGROUND,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.OPEN_FINDER_TIMEOUT }])
    expect(tracked.times).toEqual([300])
    tracked = resetTracked(tracked)
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.POINTER_UP,
            pointer,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model4 = update(
        tracked.effects,
        model3,
        {
            kind: EventKind.OPEN_FINDER_TIMEOUT,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    expect(model4).toEqual(model)
})

/*
test("clicking background triggers finder open timeout", () => {
    const effects = makeEffects(mockDocument())
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer,
    })
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_UP,
        pointer,
    })
    const expectedModel: Model = {
        ...model,
        openFinderFirstClick: true,
    }
    expect(model3).toEqual(expectedModel)
    expect(schedule).toEqual([
        {
            after: { milliseconds: 300 },
            event: { kind: EventKind.OPEN_FINDER_TIMEOUT },
        },
    ])
})

test("two pointers down then up puts you in pan mode", () => {
    const effects = makeEffects(mockDocument())
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 },
    }
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0,
    })
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
    const model0 = openFinderInsert(model)
    const pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.POINTER_DOWN,
        pointer,
    })
    const expectedModel: Model = {
        ...model0,
        pointers: [pointer],
    }
    expect(model1).toEqual(expectedModel)
})

test("clicking node selects it and puts it on top of of the node order", () => {
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
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_NODE,
        node: node0,
    })
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
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_MOVE,
        pointer,
    })
    const expectedModel: Model = {
        ...model,
        nodePlacementLocation: { x: 0, y: 0, show: false },
    }
    expect(model1).toEqual(expectedModel)
})

test("pointer move after pointer down pans camera", () => {
    const effects = makeEffects(mockDocument())
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 },
        },
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            id: 0,
            position: { x: 50, y: 75 },
        },
    })
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
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_NODE,
        node: node0,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 },
        },
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            id: 0,
            position: { x: 50, y: 75 },
        },
    })
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
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node: node0,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 },
        },
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 },
        },
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            id: 0,
            position: { x: 50, y: 75 },
        },
    })
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
    const effects = makeEffects(mockDocument())
    const { model: model1 } = update(effects, model, {
        kind: EventKind.WHEEL,
        deltaY: 10,
        position: { x: 50, y: 100 },
    })
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
    })
    const input = (model1.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
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
    })
    const [input0, input1] = (model1.graph.nodes[node0] as NodeTransform).inputs
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_INPUT,
        input: input0,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: input1,
    })
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
    const effects = makeEffects(effectModel)
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
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
    })
    const input = (model2.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const newEffectModel = { ...effectModel }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
    const expectedModel: Model = {
        ...model2,
        graph: addEdge({
            graph: model2.graph,
            input,
            output,
            generateUUID: makeEffects(newEffectModel).generateUUID,
        }).graph,
    }
    expect(model4).toEqual(expectedModel)
})

test("clicking output selects it", () => {
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
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const output = model1.graph.nodes[node0].outputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
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
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const [output0, output1] = model1.graph.nodes[node0].outputs
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output0,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output1,
    })
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
    const effects = makeEffects(effectModel)
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
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
    })
    const output = model2.graph.nodes[node1].outputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
    const newEffectModel = { ...effectModel }
    const input = (model3.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
    const expectedModel: Model = {
        ...model2,
        graph: addEdge({
            graph: model2.graph,
            input,
            output,
            generateUUID: makeEffects(newEffectModel).generateUUID,
        }).graph,
    }
    expect(model4).toEqual(expectedModel)
})

test("double click opens finder", () => {
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
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 },
        },
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_UP,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 },
        },
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 50, y: 50 },
        },
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
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
        pointers: [
            {
                id: 0,
                position: { x: 50, y: 50 },
            },
        ],
    }
    expect(model5).toEqual(expectedModel)
})

test("f key down when finder is not shown opens finder", () => {
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
    const { model: model1 } = update(makeEffects(mockDocument()), model0, {
        kind: EventKind.KEYDOWN,
        key: "f",
    })
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
    const { model: model1 } = update(makeEffects(mockDocument()), model0, {
        kind: EventKind.FINDER_INSERT,
        option: "Add",
    })
    const { model: expectedModel } = addNodeToGraph({
        model: { ...model, operations },
        position: { x: 250, y: 250 },
        operation: operations["Add"],
        effects: makeEffects(mockDocument()),
    })
    expect(model1).toEqual(expectedModel)
})

test("pressing number on keyboard appends to number node", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
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
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of "1234567890") {
        const { model: model } = update(effects, model2, {
            kind: EventKind.KEYDOWN,
            key,
        })
        model2 = model
    }
    const body = makeEffects({
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
    const effects = makeEffects(effectModel)
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
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of "-3.14") {
        const { model: model } = update(effects, model2, {
            kind: EventKind.KEYDOWN,
            key,
        })
        model2 = model
    }
    const body = makeEffects({
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
    const effects = makeEffects(effectModel)
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
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of "-3.1.4") {
        const { model: model } = update(effects, model2, {
            kind: EventKind.KEYDOWN,
            key,
        })
        model2 = model
    }
    const body = makeEffects({
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
    const effects = makeEffects(effectModel)
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
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of "1234567890") {
        const { model: model } = update(effects, model2, {
            kind: EventKind.KEYDOWN,
            key,
        })
        model2 = model
    }
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: "Backspace",
    })
    const body = makeEffects({
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
    const effects = makeEffects(effectModel)
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
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (let i = 0; i < 3; ++i) {
        const { model: model } = update(effects, model1, {
            kind: EventKind.KEYDOWN,
            key: "Backspace",
        })
        model2 = model
    }
    const body = makeEffects({
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
    const effects = makeEffects(effectModel)
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
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of "1234567890") {
        const { model: model } = update(effects, model2, {
            kind: EventKind.KEYDOWN,
            key,
        })
        model2 = model
    }
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: "Enter",
    })
    const body = makeEffects({
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
    const effects = makeEffects(effectModel)
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
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body)
    let model2 = model1
    for (const key of "qwertyuiopasdfghjklzxvbnm") {
        const { model: model } = update(effects, model2, {
            kind: EventKind.KEYDOWN,
            key,
        })
        model2 = model
    }
    const body = makeEffects({
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
    const effects = makeEffects(effectModel)
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
    })
    const model1 = updateNumberText(
        model0,
        model0.graph.nodes[node].body,
        () => "10"
    ).model
    const model2 = focusBody(model1, model1.graph.nodes[node].body!)
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: "-",
    })
    const body = makeEffects({
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
    const effects = makeEffects(effectModel)
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
    })
    const model1 = updateNumberText(
        model0,
        model0.graph.nodes[node].body,
        () => "-10"
    ).model
    const model2 = focusBody(model1, model1.graph.nodes[node].body!)
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: "+",
    })
    const body = makeEffects({
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
    const effects = makeEffects(effectModel)
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
    })
    const model1 = focusBody(model0, model0.graph.nodes[node].body!)
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: "c",
    })
    const body = makeEffects({
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
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.CLICKED_BODY,
        body,
    })
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
    const { model: model0, node: node0 } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model1, node: node1 } = addNodeToGraph({
        model: model0,
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const body0 = model1.graph.nodes[node0].body!
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_BODY,
        body: body0,
    })
    const body1 = model2.graph.nodes[node1].body!
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_BODY,
        body: body1,
    })
    const expectedModel = focusBody(model1, body1)
    expect(model3).toEqual(expectedModel)
})

test("clicking background when a number node is selected deselects it", () => {
    const effects = makeEffects(mockDocument())
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
    })
    const body = model0.graph.nodes[node].body!
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.POINTER_DOWN,
        pointer,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_BODY,
        body,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_UP,
        pointer,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_DOWN,
        pointer,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        openFinderFirstClick: true,
        pointers: [pointer],
    }
    expect(model5).toEqual(expectedModel)
})

test("pressing Escape when a number node is selected deselects it", () => {
    const effects = makeEffects(mockDocument())
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
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.CLICKED_BODY,
        body,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: "Escape",
    })
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
    const { model: model0, node: number } = addNodeToGraph({
        model: { ...model, operations },
        operation: operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model1, node: add } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const body = model1.graph.nodes[number].body!
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_BODY,
        body,
    })
    const input = (model2.graph.nodes[add] as NodeTransform).inputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
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
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.CLICKED_BODY,
        body,
    })
    const output = model0.graph.nodes[node].outputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
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
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.CLICKED_BODY,
        body,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node,
    })
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
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0,
    })
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
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1,
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
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        pointers: [pointer0, pointer1],
    }
    expect(model2).toEqual(expectedModel1)
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer2,
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
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        pointers: [pointer0, pointer2],
    }
    expect(model3).toEqual(expectedModel2)
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer3,
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
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: "d",
    })
    expect(model3).toEqual(model0)
})

test("clicking background when a node is selected deselects it", () => {
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
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_NODE,
        node,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.POINTER_DOWN,
        pointer,
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        openFinderFirstClick: true,
        pointers: [pointer],
    }
    expect(model6).toEqual(expectedModel)
})

test("pressing escape when a node is selected deselects it", () => {
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
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: "Escape",
    })
    expect(model3).toEqual(model1)
})

test("clicking background when a input is selected deselects it", () => {
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
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer,
    })
    const input = (model2.graph.nodes[node] as NodeTransform).inputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.POINTER_DOWN,
        pointer,
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        openFinderFirstClick: true,
        pointers: [pointer],
    }
    expect(model6).toEqual(expectedModel)
})

test("pressing escape when a input is selected deselects it", () => {
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
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const input = (model1.graph.nodes[node] as NodeTransform).inputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: "Escape",
    })
    expect(model3).toEqual(model1)
})

test("clicking background when a output is selected deselects it", () => {
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
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer,
    })
    const output = model2.graph.nodes[node].outputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.POINTER_DOWN,
        pointer,
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        openFinderFirstClick: true,
        pointers: [pointer],
    }
    expect(model6).toEqual(expectedModel)
})

test("pressing escape when a output is selected deselects it", () => {
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
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const output = model1.graph.nodes[node].outputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: "Escape",
    })
    expect(model3).toEqual(model1)
})

test("delete node", () => {
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
    const model0: Model = { ...model, operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.DELETE_NODE,
        node,
    })
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
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
    })
    const input = (model2.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.DELETE_INPUT_EDGE,
        input,
    })
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
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
    })
    const input = (model2.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.KEYDOWN,
        key: "d",
    })
    expect(model6).toEqual(model2)
})

test("delete output edges", () => {
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
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
    })
    const [input0, input1] = (model2.graph.nodes[node0] as NodeTransform).inputs
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: input0,
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: input1,
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.DELETE_OUTPUT_EDGES,
        output,
    })
    expect(model7).toEqual(model2)
})

test("pressing d on keyboard with output selected delete edges attached", () => {
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
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
    })
    const [input0, input1] = (model2.graph.nodes[node0] as NodeTransform).inputs
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: input0,
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: input1,
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.KEYDOWN,
        key: "d",
    })
    expect(model8).toEqual(model2)
})

test("connecting output of same node where input is selected is not allowed", () => {
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
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const input = (model1.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
    const output = model2.graph.nodes[node0].outputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
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
    const model0: Model = { ...model, operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const output = model1.graph.nodes[node0].outputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output,
    })
    const input = (model1.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
    expect(model3).toEqual(model2)
})

test("connecting output to input if input already has edge replaces it", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
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
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model3, node: node2 } = addNodeToGraph({
        model: model2,
        operation: operations["Div"],
        position: { x: 0, y: 0 },
        effects,
    })
    const input = (model3.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
    const output0 = model4.graph.nodes[node1].outputs[0]
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output0,
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
    const output1 = model6.graph.nodes[node2].outputs[0]
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output1,
    })
    const expectedModel: Model = {
        ...model3,
        graph: addEdge({
            graph: model3.graph,
            input,
            output: output1,
            generateUUID: makeEffects({
                ...effectModel,
                uuid: effectModel.uuid - 1,
            }).generateUUID,
        }).graph,
    }
    expect(model7).toEqual(expectedModel)
})

test("connecting input to output if input already has edge replaces it", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
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
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations["Sub"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model3, node: node2 } = addNodeToGraph({
        model: model2,
        operation: operations["Div"],
        position: { x: 0, y: 0 },
        effects,
    })
    const input = (model3.graph.nodes[node0] as NodeTransform).inputs[0]
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
    const output0 = model4.graph.nodes[node1].outputs[0]
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output0,
    })
    const output1 = model5.graph.nodes[node2].outputs[0]
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output1,
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input,
    })
    const expectedModel: Model = {
        ...model3,
        graph: addEdge({
            graph: model3.graph,
            input,
            output: output1,
            generateUUID: makeEffects({
                ...effectModel,
                uuid: effectModel.uuid - 1,
            }).generateUUID,
        }).graph,
    }
    expect(model7).toEqual(expectedModel)
})

test("three pointers down then one up doesn't change state", () => {
    const effects = makeEffects(mockDocument())
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
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer2,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer: pointer2,
    })
    const expectedModel: Model = {
        ...model,
        pointers: [pointer0, pointer1],
    }
    expect(model4).toEqual(expectedModel)
})

test("three pointers down on node then one up keeps state dragging", () => {
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
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 },
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_NODE,
        node,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_NODE,
        node,
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.POINTER_UP,
        pointer: pointer1,
    })
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
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: (model2.graph.nodes[node] as NodeTransform).inputs[0],
    })
    const pointer1: Pointer = {
        id: 0,
        position: { x: 50, y: 50 },
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer1,
    })
    const expectedModel: Model = {
        ...model3,
        nodePlacementLocation: { x: 50, y: 50, show: false },
        pointers: [pointer1],
    }
    expect(model4).toEqual(expectedModel)
})

test("pointer move when output selected updates node placement location", () => {
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
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model2.graph.nodes[node].outputs[0],
    })
    const pointer1: Pointer = {
        id: 0,
        position: { x: 50, y: 50 },
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer1,
    })
    const expectedModel: Model = {
        ...model3,
        nodePlacementLocation: { x: 50, y: 50, show: false },
        pointers: [pointer1],
    }
    expect(model4).toEqual(expectedModel)
})

test("pointer move when body selected updates node placement location", () => {
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
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_BODY,
        body: model2.graph.nodes[node].body!,
    })
    const pointer1: Pointer = {
        id: 0,
        position: { x: 50, y: 50 },
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer1,
    })
    const expectedModel: Model = {
        ...model3,
        nodePlacementLocation: { x: 50, y: 50, show: false },
        pointers: [pointer1],
    }
    expect(model4).toEqual(expectedModel)
})

test("pointer move when finder open only updates pointer state", () => {
    const effects = makeEffects(mockDocument())
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model1 } = update(effects, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0,
    })
    const pointer1: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.POINTER_UP,
        pointer: pointer1,
    })
    const pointer2: Pointer = {
        id: 0,
        position: { x: 50, y: 50 },
    }
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer2,
    })
    const expectedModel: Model = {
        ...model6,
        pointers: [],
    }
    expect(model7).toEqual(expectedModel)
})

test("pressing f with node selected opens finder", () => {
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
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_NODE,
        node,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.KEYDOWN,
        key: "f",
    })
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
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: (model2.graph.nodes[node] as NodeTransform).inputs[0],
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.KEYDOWN,
        key: "f",
    })
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
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model2.graph.nodes[node].outputs[0],
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.KEYDOWN,
        key: "f",
    })
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
    })
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: (model2.graph.nodes[node] as NodeTransform).inputs[0],
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0,
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.KEYDOWN,
        key: "z",
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.KEYUP,
        key: "z",
    })
    expect(model6).toEqual(model4)
})

test("clicking background with finder open closes it", () => {
    const effects = makeEffects(mockDocument())
    const { model: model1 } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "f",
    })
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model,
        pointers: [pointer],
    }
    expect(model3).toEqual(expectedModel)
})

test("pointer move after moving with keyboard stops showing node placement location", () => {
    const effects = makeEffects(mockDocument())
    const { model: model1 } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "h",
    })
    expect(model1).toEqual({
        ...model,
        nodePlacementLocation: { x: 250, y: 250, show: true },
        panCamera: { left: true, up: false, down: false, right: false, now: 0 },
    })
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.POINTER_MOVE,
        pointer,
    })
    expect(model2).toEqual({
        ...model1,
        nodePlacementLocation: { x: 0, y: 0, show: false },
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.POINTER_MOVE,
        pointer,
    })
    expect(model3).toEqual(model2)
})

test("update body", () => {
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
    })
    const body = model1.graph.nodes[node].body
    const { model: model2 } = updateBody(model1, body, (number) => ({
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
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
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
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of "qwertyuiopasdfghjklzxcvbnm1234567890") {
        const { model: nextModel } = update(effects, model3, {
            kind: EventKind.KEYDOWN,
            key: key,
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
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
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
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of "qwerty") {
        const { model: nextModel } = update(effects, model3, {
            kind: EventKind.KEYDOWN,
            key: key,
        })
        model3 = nextModel
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.KEYDOWN,
        key: "Backspace",
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
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
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
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of "qwerty") {
        const { model: nextModel } = update(effects, model3, {
            kind: EventKind.KEYDOWN,
            key: key,
        })
        model3 = nextModel
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.KEYDOWN,
        key: "Enter",
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
                    value: "qwerty",
                },
            },
        },
    }
    expect(model4).toEqual(expectedModel)
})

test("pressing escape while editing text node clears the focus", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
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
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of "qwerty") {
        const { model: nextModel } = update(effects, model3, {
            kind: EventKind.KEYDOWN,
            key: key,
        })
        model3 = nextModel
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.KEYDOWN,
        key: "Escape",
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
                    value: "qwerty",
                },
            },
        },
    }
    expect(model4).toEqual(expectedModel)
})

test("pressing shift while editing text node does nothing", () => {
    const effectModel = defaultEffectModel()
    const effects = makeEffects(effectModel)
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
    })
    const body = model0.graph.nodes[node].body
    const model2 = focusBody(model0, body)
    let model3 = model2
    for (const key of "qwerty") {
        const { model: nextModel } = update(effects, model3, {
            kind: EventKind.KEYDOWN,
            key: key,
        })
        model3 = nextModel
    }
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.KEYDOWN,
        key: "Shift",
    })
    expect(model4).toEqual(model3)
})

test("upload table", () => {
    const table: Table = {
        name: "table.csv",
        columns: {
            a: [1, 2, 3],
            b: [4, 5, 6],
        },
    }
    const { model: model1 } = update(makeEffects(mockDocument()), model, {
        kind: EventKind.UPLOAD_TABLE,
        table,
        position: { x: 0, y: 0 },
    })
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
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0],
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model5.graph.nodes[y].outputs[0],
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_NODE,
        node: add,
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: "c",
    })
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
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0],
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model5.graph.nodes[y].outputs[0],
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_NODE,
        node: add,
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.CHANGE_NODE,
        node: add,
    })
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
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0],
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model5.graph.nodes[y].outputs[0],
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_NODE,
        node: add,
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: "c",
    })
    let model10 = model9
    for (const key of "Sub") {
        const { model: nextModel } = update(effects, model10, {
            kind: EventKind.KEYDOWN,
            key: key,
        })
        model10 = nextModel
    }
    const { model: model11, dispatch } = update(effects, model10, {
        kind: EventKind.KEYDOWN,
        key: "Enter",
    })
    expect(dispatch).toEqual([
        { kind: EventKind.FINDER_CHANGE, option: "Sub", node: add },
    ])
    const { model: model12 } = update(effects, model11, dispatch![0])
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
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0],
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model5.graph.nodes[y].outputs[0],
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_NODE,
        node: add,
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: "c",
    })
    const { model: model10 } = update(effects, model9, {
        kind: EventKind.FINDER_CHANGE,
        option: "Sub",
        node: add,
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
                    name: "Sub",
                    func: subFunc,
                },
            },
        },
    }
    expect(model10).toEqual(expectedModel)
})

test("change node with different input and output names", () => {
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
        effects,
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0],
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model5.graph.nodes[y].outputs[0],
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_NODE,
        node: add,
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: "c",
    })
    let model10 = model9
    for (const key of "Column") {
        const { model: nextModel } = update(effects, model10, {
            kind: EventKind.KEYDOWN,
            key: key,
        })
        model10 = nextModel
    }
    const { model: model11, dispatch } = update(effects, model10, {
        kind: EventKind.KEYDOWN,
        key: "Enter",
    })
    expect(dispatch).toEqual([
        { kind: EventKind.FINDER_CHANGE, option: "Column", node: add },
    ])
    const { model: model12 } = update(effects, model11, dispatch![0])
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
        effects,
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0],
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model5.graph.nodes[y].outputs[0],
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_NODE,
        node: add,
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: "c",
    })
    let model10 = model9
    for (const key of "Linspace") {
        const { model: nextModel } = update(effects, model10, {
            kind: EventKind.KEYDOWN,
            key: key,
        })
        model10 = nextModel
    }
    const { model: model11, dispatch } = update(effects, model10, {
        kind: EventKind.KEYDOWN,
        key: "Enter",
    })
    expect(dispatch).toEqual([
        { kind: EventKind.FINDER_CHANGE, option: "Linspace", node: add },
    ])
    const { model: model12 } = update(effects, model11, dispatch![0])
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
        effects,
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0],
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model5.graph.nodes[y].outputs[0],
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_NODE,
        node: add,
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: "c",
    })
    let model10 = model9
    for (const key of "Sin") {
        const { model: nextModel } = update(effects, model10, {
            kind: EventKind.KEYDOWN,
            key: key,
        })
        model10 = nextModel
    }
    const { model: model11, dispatch } = update(effects, model10, {
        kind: EventKind.KEYDOWN,
        key: "Enter",
    })
    expect(dispatch).toEqual([
        { kind: EventKind.FINDER_CHANGE, option: "Sin", node: add },
    ])
    const { model: model12 } = update(effects, model11, dispatch![0])
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
    const { model: model1, node: number } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node: number,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: "c",
    })
    const { model: model4, dispatch } = update(effects, model3, {
        kind: EventKind.KEYDOWN,
        key: "Enter",
    })
    expect(dispatch).toEqual([
        { kind: EventKind.FINDER_CHANGE, option: "Number", node: number },
    ])
    const { model: model5 } = update(effects, model4, dispatch![0])
    expect(model5).toEqual(model1)
})

test("change from source node to a transform node does nothing", () => {
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
        },
    }
    const { model: model1, node: number } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node: number,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: "c",
    })
    let model4 = model3
    for (const key of "Add") {
        const { model: nextModel } = update(effects, model4, {
            kind: EventKind.KEYDOWN,
            key: key,
        })
        model4 = nextModel
    }
    const { model: model5, dispatch } = update(effects, model4, {
        kind: EventKind.KEYDOWN,
        key: "Enter",
    })
    expect(dispatch).toEqual([
        {
            kind: EventKind.FINDER_CHANGE,
            option: "Add",
            node: number,
        },
    ])
    const { model: model6 } = update(effects, model5, dispatch![0])
    expect(model6).toEqual(model1)
})

test("deleting a node forces evaluation of outputs", () => {
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
        },
    }
    const { model: model1, node: x } = addNodeToGraph({
        model: model0,
        operation: model0.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model2, node: y } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Number"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model3, node: add } = addNodeToGraph({
        model: model2,
        operation: model0.operations["Add"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model3.graph.nodes[x].outputs[0],
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: (model4.graph.nodes[add] as NodeTransform).inputs[0],
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model5.graph.nodes[y].outputs[0],
    })
    const { model: model7 } = update(effects, model6, {
        kind: EventKind.CLICKED_INPUT,
        input: (model6.graph.nodes[add] as NodeTransform).inputs[1],
    })
    const { model: model8 } = update(effects, model7, {
        kind: EventKind.CLICKED_NODE,
        node: x,
    })
    const { model: model9 } = update(effects, model8, {
        kind: EventKind.KEYDOWN,
        key: "d",
    })
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
    })
    const { model: model2, node: b } = addNodeToGraph({
        model: model1,
        operation: model1.operations["Sin"],
        position: { x: 0, y: 0 },
        effects,
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model2.graph.nodes[a].outputs[0],
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.CLICKED_INPUT,
        input: (model2.graph.nodes[b] as NodeTransform).inputs[0],
    })
    const { model: model5 } = update(effects, model4, {
        kind: EventKind.CLICKED_OUTPUT,
        output: model2.graph.nodes[b].outputs[0],
    })
    const { model: model6 } = update(effects, model5, {
        kind: EventKind.CLICKED_INPUT,
        input: (model2.graph.nodes[a] as NodeTransform).inputs[0],
    })
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
    const {
        model: model1,
        node,
        event,
    } = addNodeToGraph({
        model: model0,
        operation: model0.operations["upload csv"],
        position: { x: 0, y: 0 },
        effects,
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
    expect(await event).toEqual({
        kind: EventKind.UPLOAD_CSV,
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
    const {
        model: model1,
        node,
        event,
    } = addNodeToGraph({
        model: model0,
        operation: model0.operations["upload csv"],
        position: { x: 0, y: 0 },
        effects,
    })
    const body = model1.graph.nodes[node].body
    const output = model1.graph.nodes[node].outputs[0]
    const { model: model2 } = update(effects, model1, (await event)!)
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
    const effects = makeEffects(effectModel)
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
    })
    const body = model0.graph.nodes[node].body
    const model1 = focusBody(model0, body)
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: "sft",
    })
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
*/
