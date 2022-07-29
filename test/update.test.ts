import { addNodeToGraph, EventKind, openFinder, openNumericKeyboard, update } from "../src/update"
import { Operations } from "../src/model/graph"
import { addEdge, changeNodePosition } from "../src/update/graph"
import { translate } from "../src/linear_algebra/matrix3x3"
import { emptyModel, Model, FocusKind, PointerActionKind } from "../src/model"
import { Pointer } from "../src/ui"

const makeGenerateUUID = (model: { i: number } = { i: 0 }) => {
    return () => {
        const uuid = model.i.toString()
        ++model.i
        return uuid
    }
}

test("pointer down starts panning camera", () => {
    const model = emptyModel()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(makeGenerateUUID(), model, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const expectedModel: Model = {
        ...emptyModel(),
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN }
        },
        pointers: [pointer],
    }
    expect(model1).toEqual(expectedModel)
})

test("two pointers down starts zooming", () => {
    const generateUUID = makeGenerateUUID()
    const model = emptyModel()
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(generateUUID, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const expectedModel: Model = {
        ...emptyModel(),
        pointers: [pointer0, pointer1],
        focus: {
            kind: FocusKind.NONE,
            pointerAction: {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 0, y: 0 },
                pointerDistance: 0
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("double clicking background opens finder", () => {
    const generateUUID = makeGenerateUUID()
    const model = emptyModel()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(generateUUID, model, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model2, schedule } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const { model: model4 } = update(generateUUID, model3, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model5 } = update(generateUUID, model4, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model,
        pointers: [pointer],
        focus: {
            kind: FocusKind.FINDER,
            search: '',
            options: []
        }
    }
    expect(model5).toEqual(expectedModel)
    expect(schedule).toEqual([
        { after: { milliseconds: 300 }, event: { kind: EventKind.OPEN_FINDER_TIMEOUT } }
    ])
})

test("clicking background triggers finder open timeout", () => {
    const generateUUID = makeGenerateUUID()
    const model = emptyModel()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(generateUUID, model, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { model: model2, schedule } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const { model: model3 } = update(generateUUID, model2, {
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
    const generateUUID = makeGenerateUUID()
    const model = emptyModel()
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(generateUUID, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0
    })
    const expectedModel = {
        ...emptyModel(),
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN }
        },
        pointers: [pointer1]
    }
    expect(model3).toEqual(expectedModel)
})

test("pointer down when finder open tracks pointer", () => {
    const generateUUID = makeGenerateUUID()
    const model = openFinder(emptyModel())
    const pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(generateUUID, model, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const expectedModel: Model = {
        ...model,
        pointers: [pointer]
    }
    expect(model1).toEqual(expectedModel)
})

test("clicking node selects it and puts it on top of of the node order", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    const model0: Model = {
        ...emptyModel(),
        operations
    }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { model: model3, render } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_NODE,
        node: node0
    })
    const expectedModel: Model = {
        ...model2,
        focus: {
            kind: FocusKind.NODE,
            node: node0,
            drag: true
        },
        nodeOrder: [node1, node0],
    }
    expect(model3).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("pointer move before pointer down does nothing", () => {
    const generateUUID = makeGenerateUUID()
    const model = emptyModel()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(generateUUID, model, {
        kind: EventKind.POINTER_MOVE,
        pointer
    })
    expect(model1).toEqual(emptyModel())
})

test("pointer move after pointer down pans camera", () => {
    const generateUUID = makeGenerateUUID()
    const model = emptyModel()
    const { model: model1 } = update(generateUUID, model, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { model: model2, render } = update(generateUUID, model1, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            id: 0,
            position: { x: 50, y: 75 }
        }
    })
    const expectedModel: Model = {
        ...emptyModel(),
        camera: translate(-50, -75),
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN }
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
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    const model0: Model = {
        ...emptyModel(),
        operations
    }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_NODE,
        node: node0
    })
    const { model: model4 } = update(generateUUID, model3, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { model: model5, render } = update(generateUUID, model4, {
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
            drag: true
        }
    }
    expect(model5).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("pointer move after clicking node, pointer down, then pointer up", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    const model0: Model = {
        ...emptyModel(),
        operations
    }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_NODE,
        node: node0
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { model: model4 } = update(generateUUID, model3, {
        kind: EventKind.POINTER_UP,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { model: model5 } = update(generateUUID, model4, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            id: 0,
            position: { x: 50, y: 75 }
        }
    })
    const expectedModel: Model = {
        ...model1,
        nodePlacementLocation: { x: 50, y: 75 },
        focus: {
            kind: FocusKind.NODE,
            node: node0,
            drag: false
        },
    }
    expect(model5).toEqual(expectedModel)
})

test("mouse wheel zooms in camera relative to mouse position", () => {
    const generateUUID = makeGenerateUUID()
    const model = emptyModel()
    const { model: model1 } = update(generateUUID, model, {
        kind: EventKind.WHEEL,
        deltaY: 10,
        position: { x: 50, y: 100 }
    })
    const expectedModel = {
        ...emptyModel(),
        camera: [
            1.0717734625362931, 0, -3.588673126814655,
            0, 1.0717734625362931, -7.17734625362931,
            0, 0, 1,
        ]
    }
    expect(model1).toEqual(expectedModel)
})

test("clicking input selects it", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    const model0: Model = {
        ...emptyModel(),
        operations
    }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const input = model1.graph.nodes[node0].inputs[0]
    const { model: model2, render } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.INPUT,
            input
        }
    }
    expect(model2).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("clicking new input selects it and deselects old input", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    const model0: Model = {
        ...emptyModel(),
        operations
    }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const [input0, input1] = model1.graph.nodes[node0].inputs
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_INPUT,
        input: input0
    })
    const { model: model3, render } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: input1
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.INPUT,
            input: input1
        }
    }
    expect(model3).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("clicking output after clicking input adds connection", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    const model0: Model = {
        ...emptyModel(),
        operations
    }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const input = model2.graph.nodes[node0].inputs[0]
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const newUuidModel = { ...uuidModel }
    const { model: model4, render } = update(generateUUID, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const expectedModel: Model = {
        ...model2,
        graph: addEdge({
            graph: model2.graph,
            input,
            output,
            generateUUID: makeGenerateUUID(newUuidModel)
        }).graph
    }
    expect(model4).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("clicking output selects it", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    const model0: Model = {
        ...emptyModel(),
        operations
    }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const output = model1.graph.nodes[node0].outputs[0]
    const { model: model2, render } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.OUTPUT,
            output
        }
    }
    expect(model2).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("clicking new output selects it and deselects old output", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    const model0: Model = {
        ...emptyModel(),
        operations
    }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const [output0, output1] = model1.graph.nodes[node0].outputs
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output0
    })
    const { model: model3, render } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output1
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.OUTPUT,
            output: output1
        }
    }
    expect(model3).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("clicking input after clicking output adds connection", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    const model0: Model = {
        ...emptyModel(),
        operations
    }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const output = model2.graph.nodes[node1].outputs[0]
    const { model: model3, render } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const newUuidModel = { ...uuidModel }
    const input = model3.graph.nodes[node0].inputs[0]
    const { model: model4 } = update(generateUUID, model3, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const expectedModel: Model = {
        ...model2,
        graph: addEdge({
            graph: model2.graph,
            input,
            output,
            generateUUID: makeGenerateUUID(newUuidModel)
        }).graph
    }
    expect(model4).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("double click opens finder", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    const model0: Model = {
        ...emptyModel(),
        operations
    }
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 50, y: 50 }
        }
    })
    const { model: model3, render } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.FINDER,
            search: '',
            options: ['Add', 'Sub'],
        },
        nodePlacementLocation: { x: 50, y: 50 },
        pointers: [
            {
                id: 0,
                position: { x: 50, y: 50 }
            }
        ]
    }
    expect(model3).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("key down when finder is not shown does nothing", () => {
    const model = emptyModel()
    const { model: model1 } = update(makeGenerateUUID(), model, {
        kind: EventKind.KEYDOWN,
        key: 'a'
    })
    expect(model1).toEqual(emptyModel())
})


test("f key down when finder is not shown opens finder", () => {
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    const model0: Model = {
        ...emptyModel(),
        operations
    }
    const { model: model1, render } = update(makeGenerateUUID(), model0, {
        kind: EventKind.KEYDOWN,
        key: 'f'
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.FINDER,
            search: '',
            options: ["Add", "Sub"],
        }
    }
    expect(model1).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("clicking a finder option adds node to graph", () => {
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    const model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1, render } = update(makeGenerateUUID(), model0, {
        kind: EventKind.CLICKED_FINDER_OPTION,
        option: 'Add'
    })
    const { model: expectedModel } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        position: { x: 0, y: 0 },
        operation: operations['Add'],
        generateUUID: makeGenerateUUID()
    })
    expect(model1).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("key down when finder is shown appends to search", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    const model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.KEYDOWN,
        key: 'a'
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const { model: model3, render } = update(generateUUID, model2, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.FINDER,
            search: 'add',
            options: ['Add'],
        },
    }
    expect(model3).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("backspace key down when finder is shown deletes from search", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    const model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.KEYDOWN,
        key: 'a'
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const { model: model4, render } = update(generateUUID, model3, {
        kind: EventKind.KEYDOWN,
        key: 'Backspace'
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.FINDER,
            search: 'ad',
            options: ['Add'],
        }
    }
    expect(model4).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("enter key down when finder is shown closes finder and adds node", () => {
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    const model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1, render } = update(makeGenerateUUID(), model0, {
        kind: EventKind.KEYDOWN,
        key: 'Enter'
    })
    const { model: expectedModel } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        position: { x: 0, y: 0 },
        operation: operations['Add'],
        generateUUID: makeGenerateUUID()
    })
    expect(model1).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("enter key down when finder is shown and finder has search closes finder and adds node", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    let model0 = openFinder({
        ...emptyModel(),
        operations
    })
    let model1 = model0
    for (const key of 'add') {
        const { model: model } = update(generateUUID, model1, {
            kind: EventKind.KEYDOWN,
            key
        })
        model1 = model
    }
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.KEYDOWN,
        key: 'Enter'
    })
    const { model: expectedModel } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: makeGenerateUUID()
    })
    expect(model2).toEqual(expectedModel)
})

test("enter key down when finder is shown and finder has search eliminates all options closes finder", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    let model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.KEYDOWN,
        key: 'x'
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.KEYDOWN,
        key: 'Enter'
    })
    expect(model2).toEqual({ ...emptyModel(), operations })
})

test("ret virtual key down when finder is shown and finder has search eliminates all options closes finder", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    let model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'x'
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'ret'
    })
    const expectedModel = { ...emptyModel(), operations }
    expect(model2).toEqual(expectedModel)
})


test("escape key down when finder is shown closes finder", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    let model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1, render } = update(generateUUID, model0, {
        kind: EventKind.KEYDOWN,
        key: 'Escape'
    })
    const expectedModel = { ...emptyModel(), operations }
    expect(model1).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("shift key down when finder is shown are ignored", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    let model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1, render } = update(generateUUID, model0, {
        kind: EventKind.KEYDOWN,
        key: 'Shift'
    })
    expect(model1).toEqual(model0)
    expect(render).toBeUndefined()
})

test("alt key down when finder is shown are ignored", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    let model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1, render } = update(generateUUID, model0, {
        kind: EventKind.KEYDOWN,
        key: 'Alt'
    })
    expect(model1).toEqual(model0)
    expect(render).toBeUndefined()
})

test("control key down when finder is shown are ignored", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    let model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1, render } = update(generateUUID, model0, {
        kind: EventKind.KEYDOWN,
        key: 'Control'
    })
    expect(model1).toEqual(model0)
    expect(render).toBeUndefined()
})

test("meta key down when finder is shown are ignored", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    let model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1, render } = update(generateUUID, model0, {
        kind: EventKind.KEYDOWN,
        key: 'Meta'
    })
    expect(model1).toEqual(model0)
    expect(render).toBeUndefined()
})

test("Tab key down when finder is shown are ignored", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    let model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1, render } = update(generateUUID, model0, {
        kind: EventKind.KEYDOWN,
        key: 'Tab'
    })
    expect(model1).toEqual(model0)
    expect(render).toBeUndefined()

})

test("virtual key down when finder is shown appends to search", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    let model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'a'
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'd'
    })
    const { model: model3, render } = update(generateUUID, model2, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.FINDER,
            search: 'add',
            options: ['Add'],
        }
    }
    expect(model3).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("del virtual key down when finder is shown deletes from search", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    const model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'a'
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'd'
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'd'
    })
    const { model: model4, render } = update(generateUUID, model3, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'del'
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.FINDER,
            search: 'ad',
            options: ['Add'],
        }
    }
    expect(model4).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("space virtual key down when finder is shown adds space to search", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    const model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'a'
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'space'
    })
    const { model: model3, render } = update(generateUUID, model2, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'd'
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.FINDER,
            search: 'a d',
            options: [],
        }
    }
    expect(model3).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("ret virtual key down when finder is shown closes finder and adds node", () => {
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    const model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1, render } = update(makeGenerateUUID(), model0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'ret'
    })
    const { model: expectedModel } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        position: { x: 0, y: 0 },
        operation: operations['Add'],
        generateUUID: makeGenerateUUID()
    })
    expect(model1).toEqual(expectedModel)
    expect(render).toEqual(true)
})

test("sft virtual key down when finder is shown are ignored", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        }
    }
    let model0 = openFinder({
        ...emptyModel(),
        operations
    })
    const { model: model1, render } = update(generateUUID, model0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'sft'
    })
    expect(model1).toEqual(model0)
    expect(render).toBeUndefined()
})

test("pressing number on keyboard appends to number node", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const model1 = openNumericKeyboard(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of '1234567890') {
        const { model: model } = update(generateUUID, model2, {
            kind: EventKind.KEYDOWN,
            key
        })
        model2 = model
    }
    const body = makeGenerateUUID({ i: uuidModel.i - 1 })()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY,
            body
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    node,
                    value: 1234567890
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing backspace on keyboard deletes from number node", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const model1 = openNumericKeyboard(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of '1234567890') {
        const { model: model } = update(generateUUID, model2, {
            kind: EventKind.KEYDOWN,
            key
        })
        model2 = model
    }
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.KEYDOWN,
        key: 'Backspace'
    })
    const body = makeGenerateUUID({ i: uuidModel.i - 1 })()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY,
            body
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    node,
                    value: 123456789
                }
            }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing backspace when number node value is 0 has no effect", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const model1 = openNumericKeyboard(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (let i = 0; i < 3; ++i) {
        const { model: model } = update(generateUUID, model1, {
            kind: EventKind.KEYDOWN,
            key: 'Backspace'
        })
        model2 = model
    }
    const body = makeGenerateUUID({ i: uuidModel.i - 1 })()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY,
            body
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    node,
                    value: 0
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing del on virtual keyboard when number node value is 0 has no effect", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const model1 = openNumericKeyboard(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (let i = 0; i < 3; ++i) {
        const { model: model } = update(generateUUID, model2, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key: 'del'
        })
        model2 = model
    }
    const body = makeGenerateUUID({ i: uuidModel.i - 1 })()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY,
            body
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    node,
                    value: 0
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing number on virtual keyboard appends to number node", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const model1 = openNumericKeyboard(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of '1234567890') {
        const { model: model } = update(generateUUID, model2, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        })
        model2 = model
    }
    const body = makeGenerateUUID({ i: uuidModel.i - 1 })()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY,
            body
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    node,
                    value: 1234567890
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing del on virtual keyboard deletes from number node", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const model1 = openNumericKeyboard(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of '1234567890') {
        const { model: model } = update(generateUUID, model2, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        })
        model2 = model
    }
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'del'
    })
    const body = makeGenerateUUID({ i: uuidModel.i - 1 })()
    const expectedModel: Model = {
        ...model0,
        operations,
        focus: {
            kind: FocusKind.BODY,
            body,
        },
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    node,
                    value: 123456789
                }
            }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing enter on keyboard while editing number node exits virtual keyboard", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const model1 = openNumericKeyboard(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of '1234567890') {
        const { model: model } = update(generateUUID, model2, {
            kind: EventKind.KEYDOWN,
            key
        })
        model2 = model
    }
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.KEYDOWN,
        key: 'Enter'
    })
    const body = makeGenerateUUID({ i: uuidModel.i - 1 })()
    const expectedModel: Model = {
        ...model0,
        operations,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    node,
                    value: 1234567890
                }
            }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing ret on virtual keyboard while editing number node exits virtual keyboard", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const model1 = openNumericKeyboard(model0, model0.graph.nodes[node].body!)
    let model2 = model1
    for (const key of '1234567890') {
        const { model: model } = update(generateUUID, model2, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        })
        model2 = model
    }
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'ret'
    })
    const body = makeGenerateUUID({ i: uuidModel.i - 1 })()
    const expectedModel: Model = {
        ...model0,
        operations,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    node,
                    value: 1234567890
                }
            }
        }
    }
    expect(model3).toEqual(expectedModel)
})


test("pressing non number on keyboard while editing number node is ignored", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const model1 = openNumericKeyboard(model0, node)
    let model2 = model1
    for (const key of 'qwertyuiopasdfghjklzxcvbnm') {
        const { model: model } = update(generateUUID, model2, {
            kind: EventKind.KEYDOWN,
            key
        })
        model2 = model
    }
    const body = makeGenerateUUID({ i: uuidModel.i - 1 })()
    const expectedModel: Model = {
        ...model1,
        operations,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    node,
                    value: 0
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})


test("pressing non number on virtual keyboard while editing number node is ignored", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const model1 = openNumericKeyboard(model0, node)
    let model2 = model1
    for (const key of 'qwertyuiopasdfghjklzxcvbnm') {
        const { model: model } = update(generateUUID, model2, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        })
        model2 = model
    }
    const body = makeGenerateUUID({ i: uuidModel.i - 1 })()
    const expectedModel: Model = {
        ...model1,
        operations,
        graph: {
            ...model0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    node,
                    value: 0
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing a key on virtual keyboard while no input target selected doesn't change the model", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0 } = addNodeToGraph({
        model: {
            ...emptyModel(),
            operations,
            focus: {
                kind: FocusKind.NONE,
                pointerAction: { kind: PointerActionKind.NONE }
            }
        },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: '1'
    })
    expect(model1).toEqual(model0)
})

test("clicking a number node opens the numeric keyboard", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.CLICKED_NUMBER,
        body
    })
    const expectedModel = openNumericKeyboard(model0, body)
    expect(model1).toEqual(expectedModel)
})

test("clicking a number node when another number node is selected switches selections", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node: node0 } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { model: model1, node: node1 } = addNodeToGraph({
        model: model0,
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const body0 = model1.graph.nodes[node0].body!
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_NUMBER,
        body: body0
    })
    const body1 = model2.graph.nodes[node1].body!
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_NUMBER,
        body: body1
    })
    const expectedModel = openNumericKeyboard(model1, body1)
    expect(model3).toEqual(expectedModel)
})

test("clicking background when a number node is selected deselects it", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.CLICKED_NUMBER,
        body
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN }
        },
        openFinderFirstClick: true
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing Escape when a number node is selected deselects it", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.CLICKED_NUMBER,
        body
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.KEYDOWN,
        key: 'Escape'
    })
    expect(model2).toEqual(model0)
})

test("clicking input when a number node is selected deselects it and selects input", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.CLICKED_NUMBER,
        body
    })
    const input = model0.graph.nodes[node].inputs[0]
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.INPUT,
            input
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("clicking output when a number node is selected deselects it and selects output", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.CLICKED_NUMBER,
        body
    })
    const output = model0.graph.nodes[node].outputs[0]
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.OUTPUT,
            output
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("clicking node when a number node is selected deselects it and selects node", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { model: model0, node } = addNodeToGraph({
        model: { ...emptyModel(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const body = model0.graph.nodes[node].body!
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.CLICKED_NUMBER,
        body
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const expectedModel: Model = {
        ...model0,
        focus: {
            kind: FocusKind.NODE,
            node,
            drag: true
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("zooming", () => {
    const generateUUID = makeGenerateUUID()
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
    const model0 = emptyModel()
    const { model: model1 } = update(generateUUID, model0, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const expectedModel0: Model = {
        ...emptyModel(),
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN }
        },
        pointers: [pointer0]
    }
    expect(model1).toEqual(expectedModel0)
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const expectedModel1: Model = {
        ...emptyModel(),
        focus: {
            kind: FocusKind.NONE,
            pointerAction: {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 0, y: 0 },
                pointerDistance: 0
            }
        },
        pointers: [pointer0, pointer1]
    }
    expect(model2).toEqual(expectedModel1)
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer2
    })
    const expectedModel2: Model = {
        ...emptyModel(),
        focus: {
            kind: FocusKind.NONE,
            pointerAction: {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 10, y: 10 },
                pointerDistance: Math.sqrt(Math.pow(20, 2) + Math.pow(20, 2)),
            }
        },
        pointers: [pointer0, pointer2]
    }
    expect(model3).toEqual(expectedModel2)
    const { model: model4 } = update(generateUUID, model3, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer3
    })
    const expectedModel3: Model = {
        ...emptyModel(),
        focus: {
            kind: FocusKind.NONE,
            pointerAction: {
                kind: PointerActionKind.ZOOM,
                pointerCenter: { x: 15, y: 15 },
                pointerDistance: Math.sqrt(Math.pow(30, 2) + Math.pow(30, 2)),
            }
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
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    expect(model3).toEqual(model0)
})

test("clicking background when a node is selected deselects it", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN }
        },
        openFinderFirstClick: true
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing escape when a node is selected deselects it", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.KEYDOWN,
        key: 'Escape'
    })
    expect(model3).toEqual(model1)
})


test("clicking background when a input is selected deselects it", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const input = model1.graph.nodes[node].inputs[0]
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN }
        },
        openFinderFirstClick: true
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing escape when a input is selected deselects it", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const input = model1.graph.nodes[node].inputs[0]
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.KEYDOWN,
        key: 'Escape'
    })
    expect(model3).toEqual(model1)
})


test("clicking background when a output is selected deselects it", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const output = model1.graph.nodes[node].outputs[0]
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN }
        },
        openFinderFirstClick: true
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing escape when a output is selected deselects it", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const output = model1.graph.nodes[node].outputs[0]
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.KEYDOWN,
        key: 'Escape'
    })
    expect(model3).toEqual(model1)
})


test("delete input edge", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const input = model2.graph.nodes[node0].inputs[0]
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const { model: model4 } = update(generateUUID, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model5 } = update(generateUUID, model4, {
        kind: EventKind.DELETE_INPUT_EDGE,
        input
    })
    expect(model5).toEqual(model2)
})

test("pressing d on keyboard with input selected delete edge attached", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const input = model2.graph.nodes[node0].inputs[0]
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const { model: model4 } = update(generateUUID, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model5 } = update(generateUUID, model4, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const { model: model6 } = update(generateUUID, model5, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    expect(model6).toEqual(model2)
})

test("delete output edges", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const [input0, input1] = model2.graph.nodes[node0].inputs
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: input0
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const { model: model4 } = update(generateUUID, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model5 } = update(generateUUID, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: input1
    })
    const { model: model6 } = update(generateUUID, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model7 } = update(generateUUID, model6, {
        kind: EventKind.DELETE_OUTPUT_EDGES,
        output
    })
    expect(model7).toEqual(model2)
})

test("pressing d on keyboard with output selected delete edges attached", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Sub',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const [input0, input1] = model2.graph.nodes[node0].inputs
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_INPUT,
        input: input0
    })
    const output = model3.graph.nodes[node1].outputs[0]
    const { model: model4 } = update(generateUUID, model3, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model5 } = update(generateUUID, model4, {
        kind: EventKind.CLICKED_INPUT,
        input: input1
    })
    const { model: model6 } = update(generateUUID, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model7 } = update(generateUUID, model6, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model8 } = update(generateUUID, model7, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    expect(model8).toEqual(model2)
})

test("connecting output of same node where input is selected is not allowed", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const input = model1.graph.nodes[node0].inputs[0]
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output = model2.graph.nodes[node0].outputs[0]
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    expect(model3).toEqual(model2)
})


test("connecting input of same node where output is selected is not allowed", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const output = model1.graph.nodes[node0].outputs[0]
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const input = model1.graph.nodes[node0].inputs[0]
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    expect(model3).toEqual(model2)
})

test("connecting output to input if input already has edge replaces it", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Div',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Div': {
            name: 'Div',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { model: model3, node: node2 } = addNodeToGraph({
        model: model2,
        operation: operations['Div'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const input = model3.graph.nodes[node0].inputs[0]
    const { model: model4 } = update(generateUUID, model3, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output0 = model4.graph.nodes[node1].outputs[0]
    const { model: model5 } = update(generateUUID, model4, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output0
    })
    const { model: model6 } = update(generateUUID, model5, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output1 = model6.graph.nodes[node2].outputs[0]
    const { model: model7 } = update(generateUUID, model6, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output1
    })
    const expectedModel: Model = {
        ...model3,
        graph: addEdge({
            graph: model3.graph,
            input,
            output: output1,
            generateUUID: makeGenerateUUID({ i: uuidModel.i - 1 })
        }).graph
    }
    expect(model7).toEqual(expectedModel)
})


test("connecting input to output if input already has edge replaces it", () => {
    const uuidModel = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidModel)
    const operations: Operations = {
        'Add': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Sub': {
            name: 'Div',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
        'Div': {
            name: 'Div',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    let model0 = { ...emptyModel(), operations }
    const { model: model1, node: node0 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { model: model3, node: node2 } = addNodeToGraph({
        model: model2,
        operation: operations['Div'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const input = model3.graph.nodes[node0].inputs[0]
    const { model: model4 } = update(generateUUID, model3, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output0 = model4.graph.nodes[node1].outputs[0]
    const { model: model5 } = update(generateUUID, model4, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output0
    })
    const output1 = model5.graph.nodes[node2].outputs[0]
    const { model: model6 } = update(generateUUID, model5, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output1
    })
    const { model: model7 } = update(generateUUID, model6, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const expectedModel: Model = {
        ...model3,
        graph: addEdge({
            graph: model3.graph,
            input,
            output: output1,
            generateUUID: makeGenerateUUID({ i: uuidModel.i - 1 })
        }).graph
    }
    expect(model7).toEqual(expectedModel)
})