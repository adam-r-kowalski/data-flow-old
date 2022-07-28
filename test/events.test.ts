import { addNodeToGraph, EventKind, openFinder, openNumericKeyboard, update } from "../src/event"
import { Operations } from "../src/graph/model"
import { addEdge, changeNodePosition } from "../src/graph/update"
import { translate } from "../src/linear_algebra/matrix3x3"
import { emptyState, InputTargetKind, SelectedKind, State, VirtualKeyboardKind } from "../src/state"
import { Pointer } from "../src/ui"

const makeGenerateUUID = (state: { i: number } = { i: 0 }) => {
    return () => {
        const uuid = state.i.toString()
        ++state.i
        return uuid
    }
}

test("pointer down", () => {
    const state = emptyState()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { state: state1, schedule } = update(makeGenerateUUID(), state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const expectedState = {
        ...emptyState(),
        dragging: true,
        pointers: [pointer],
        potentialDoubleClick: true
    }
    expect(state1).toEqual(expectedState)
    expect(schedule).toEqual([
        {
            after: { milliseconds: 300 },
            event: { kind: EventKind.DOUBLE_CLICK_TIMEOUT }
        }
    ])
})

test("two pointers down", () => {
    const generateUUID = makeGenerateUUID()
    const state = emptyState()
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 }
    }
    const { state: state1, schedule } = update(generateUUID, state, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const expectedState = {
        ...emptyState(),
        pointers: [pointer0, pointer1],
        zooming: true
    }
    expect(state2).toEqual(expectedState)
    expect(schedule).toEqual([
        {
            after: { milliseconds: 300 },
            event: { kind: EventKind.DOUBLE_CLICK_TIMEOUT }
        }
    ])
})

test("pointer double click", () => {
    const generateUUID = makeGenerateUUID()
    const state = emptyState()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { state: state1 } = update(generateUUID, state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const { state: state3, dispatch } = update(generateUUID, state2, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const expectedState = {
        ...emptyState(),
        pointers: [pointer]
    }
    expect(state3).toEqual(expectedState)
    expect(dispatch).toEqual([{ kind: EventKind.DOUBLE_CLICK, pointer }])
})

test("pointer double click timeout", () => {
    const generateUUID = makeGenerateUUID()
    const state = emptyState()
    const pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { state: state1 } = update(generateUUID, state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.DOUBLE_CLICK_TIMEOUT
    })
    const expectedState = emptyState()
    expect(state3).toEqual(expectedState)
})

test("pointer down then up", () => {
    const generateUUID = makeGenerateUUID()
    const state = emptyState()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { state: state1 } = update(generateUUID, state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const expectedState = {
        ...emptyState(),
        potentialDoubleClick: true
    }
    expect(state2).toEqual(expectedState)
})

test("two pointers down then up", () => {
    const generateUUID = makeGenerateUUID()
    const state = emptyState()
    const pointer0: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const pointer1: Pointer = {
        id: 1,
        position: { x: 0, y: 0 }
    }
    const { state: state1 } = update(generateUUID, state, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0
    })
    const expectedState = {
        ...emptyState(),
        dragging: true,
        pointers: [pointer1]
    }
    expect(state3).toEqual(expectedState)
})

test("pointer down when finder open", () => {
    const generateUUID = makeGenerateUUID()
    const state = openFinder(emptyState())
    const pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { state: state1 } = update(generateUUID, state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const expectedState = openFinder(emptyState())
    expect(state1).toEqual(expectedState)
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
    const state0: State = {
        ...emptyState(),
        operations
    }
    const { state: state1, node: node0 } = addNodeToGraph({
        state: state0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { state: state2, node: node1 } = addNodeToGraph({
        state: state1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { state: state3, render } = update(generateUUID, state2, {
        kind: EventKind.CLICKED_NODE,
        node: node0
    })
    const expectedState = {
        ...state2,
        selected: {
            kind: SelectedKind.NODE,
            node: node0
        },
        nodeOrder: [node1, node0],
    }
    expect(state3).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("pointer move before pointer down does nothing", () => {
    const generateUUID = makeGenerateUUID()
    const state = emptyState()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { state: state1 } = update(generateUUID, state, {
        kind: EventKind.POINTER_MOVE,
        pointer
    })
    expect(state1).toEqual(emptyState())
})

test("pointer move after pointer down", () => {
    const generateUUID = makeGenerateUUID()
    const state = emptyState()
    const { state: state1 } = update(generateUUID, state, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { state: state2, render } = update(generateUUID, state1, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            id: 0,
            position: { x: 50, y: 75 }
        }
    })
    const expectedState = {
        ...emptyState(),
        camera: translate(-50, -75),
        potentialDoubleClick: true,
        dragging: true,
        pointers: [
            {
                id: 0,
                position: { x: 50, y: 75 }
            }
        ]
    }
    expect(state2).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("pointer move after clicking node pointer down", () => {
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
    const state0: State = {
        ...emptyState(),
        operations
    }
    const { state: state1, node: node0 } = addNodeToGraph({
        state: state0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { state: state2, node: node1 } = addNodeToGraph({
        state: state1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.CLICKED_NODE,
        node: node0
    })
    const { state: state4 } = update(generateUUID, state3, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { state: state5, render } = update(generateUUID, state4, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            id: 0,
            position: { x: 50, y: 75 }
        }
    })
    const expectedState = {
        ...state2,
        pointers: [
            {
                id: 0,
                position: { x: 50, y: 75 }
            }
        ],
        graph: changeNodePosition(state2.graph, node0, () => ({ x: 50, y: 75 })),
        nodeOrder: [node1, node0],
        dragging: true,
        potentialDoubleClick: true,
        selected: {
            kind: SelectedKind.NODE,
            node: node0
        }
    }
    expect(state5).toEqual(expectedState)
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
    const state0: State = {
        ...emptyState(),
        operations
    }
    const { state: state1, node: node0 } = addNodeToGraph({
        state: state0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.CLICKED_NODE,
        node: node0
    })
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { state: state4 } = update(generateUUID, state3, {
        kind: EventKind.POINTER_UP,
        pointer: {
            id: 0,
            position: { x: 0, y: 0 }
        }
    })
    const { state: state5 } = update(generateUUID, state4, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            id: 0,
            position: { x: 50, y: 75 }
        }
    })
    const expectedState = {
        ...state1,
        nodePlacementLocation: { x: 50, y: 75 },
        selected: {
            kind: SelectedKind.NODE,
            node: node0
        },
        potentialDoubleClick: true
    }
    expect(state5).toEqual(expectedState)
})

test("mouse wheel zooms in camera relative to mouse position", () => {
    const generateUUID = makeGenerateUUID()
    const state = emptyState()
    const { state: state1 } = update(generateUUID, state, {
        kind: EventKind.WHEEL,
        deltaY: 10,
        position: { x: 50, y: 100 }
    })
    const expectedState = {
        ...emptyState(),
        camera: [
            1.0717734625362931, 0, -3.588673126814655,
            0, 1.0717734625362931, -7.17734625362931,
            0, 0, 1,
        ]
    }
    expect(state1).toEqual(expectedState)
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
    const state0: State = {
        ...emptyState(),
        operations
    }
    const { state: state1, node: node0 } = addNodeToGraph({
        state: state0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const input = state1.graph.nodes[node0].inputs[0]
    const { state: state2, render } = update(generateUUID, state1, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const expectedState = {
        ...state1,
        selected: {
            kind: SelectedKind.INPUT,
            input
        }
    }
    expect(state2).toEqual(expectedState)
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
    const state0: State = {
        ...emptyState(),
        operations
    }
    const { state: state1, node: node0 } = addNodeToGraph({
        state: state0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const [input0, input1] = state1.graph.nodes[node0].inputs
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.CLICKED_INPUT,
        input: input0
    })
    const { state: state3, render } = update(generateUUID, state2, {
        kind: EventKind.CLICKED_INPUT,
        input: input1
    })
    const expectedState = {
        ...state1,
        selected: {
            kind: SelectedKind.INPUT,
            input: input1
        }
    }
    expect(state3).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("clicking output after clicking input adds connection", () => {
    const uuidState = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidState)
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
    const state0: State = {
        ...emptyState(),
        operations
    }
    const { state: state1, node: node0 } = addNodeToGraph({
        state: state0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { state: state2, node: node1 } = addNodeToGraph({
        state: state1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const input = state2.graph.nodes[node0].inputs[0]
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const output = state3.graph.nodes[node1].outputs[0]
    const newUuidState = { ...uuidState }
    const { state: state4, render } = update(generateUUID, state3, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const expectedState = {
        ...state2,
        graph: addEdge({
            graph: state2.graph,
            input,
            output,
            generateUUID: makeGenerateUUID(newUuidState)
        }).graph
    }
    expect(state4).toEqual(expectedState)
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
    const state0: State = {
        ...emptyState(),
        operations
    }
    const { state: state1, node: node0 } = addNodeToGraph({
        state: state0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const output = state1.graph.nodes[node0].outputs[0]
    const { state: state2, render } = update(generateUUID, state1, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const expectedState = {
        ...state1,
        selected: {
            kind: SelectedKind.OUTPUT,
            output
        }
    }
    expect(state2).toEqual(expectedState)
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
    const state0: State = {
        ...emptyState(),
        operations
    }
    const { state: state1, node: node0 } = addNodeToGraph({
        state: state0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const [output0, output1] = state1.graph.nodes[node0].outputs
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output0
    })
    const { state: state3, render } = update(generateUUID, state2, {
        kind: EventKind.CLICKED_OUTPUT,
        output: output1
    })
    const expectedState = {
        ...state1,
        selected: {
            kind: SelectedKind.OUTPUT,
            output: output1
        }
    }
    expect(state3).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("clicking input after clicking output adds connection", () => {
    const uuidState = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidState)
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
    const state0: State = {
        ...emptyState(),
        operations
    }
    const { state: state1, node: node0 } = addNodeToGraph({
        state: state0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const { state: state2, node: node1 } = addNodeToGraph({
        state: state1,
        operation: operations['Sub'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const output = state2.graph.nodes[node1].outputs[0]
    const { state: state3, render } = update(generateUUID, state2, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const newUuidState = { ...uuidState }
    const input = state3.graph.nodes[node0].inputs[0]
    const { state: state4 } = update(generateUUID, state3, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const expectedState = {
        ...state2,
        graph: addEdge({
            graph: state2.graph,
            input,
            output,
            generateUUID: makeGenerateUUID(newUuidState)
        }).graph
    }
    expect(state4).toEqual(expectedState)
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
    const state0: State = {
        ...emptyState(),
        operations
    }
    const { state: state1, render } = update(generateUUID, state0, {
        kind: EventKind.DOUBLE_CLICK,
        pointer: {
            id: 0,
            position: { x: 50, y: 50 }
        }
    })
    const expectedState: State = {
        ...state0,
        finder: {
            show: true,
            search: '',
            options: ['Add', 'Sub']
        },
        nodePlacementLocation: { x: 50, y: 50 },
        virtualKeyboard: {
            kind: VirtualKeyboardKind.ALPHABETIC,
            show: true,
        },
        inputTarget: { kind: InputTargetKind.FINDER },
    }
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})


test("key down when finder is not shown does nothing", () => {
    const state = emptyState()
    const { state: state1 } = update(makeGenerateUUID(), state, {
        kind: EventKind.KEYDOWN,
        key: 'a'
    })
    expect(state1).toEqual(emptyState())
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
    const state0: State = {
        ...emptyState(),
        operations
    }
    const { state: state1, render } = update(makeGenerateUUID(), state0, {
        kind: EventKind.KEYDOWN,
        key: 'f'
    })
    const expectedState = {
        ...state0,
        finder: {
            show: true,
            search: '',
            options: ["Add", "Sub"]
        },
        virtualKeyboard: {
            kind: VirtualKeyboardKind.ALPHABETIC,
            show: true,
        },
        inputTarget: { kind: InputTargetKind.FINDER }
    }
    expect(state1).toEqual(expectedState)
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
    const state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1, render } = update(makeGenerateUUID(), state0, {
        kind: EventKind.CLICKED_FINDER_OPTION,
        option: 'Add'
    })
    const { state: expectedState } = addNodeToGraph({
        state: { ...emptyState(), operations },
        position: { x: 0, y: 0 },
        operation: operations['Add'],
        generateUUID: makeGenerateUUID()
    })
    expect(state1).toEqual(expectedState)
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
    const state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1 } = update(generateUUID, state0, {
        kind: EventKind.KEYDOWN,
        key: 'a'
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const { state: state3, render } = update(generateUUID, state2, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const expectedState = {
        ...state0,
        finder: {
            show: true,
            search: 'add',
            options: ['Add']
        }
    }
    expect(state3).toEqual(expectedState)
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
    const state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1 } = update(generateUUID, state0, {
        kind: EventKind.KEYDOWN,
        key: 'a'
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const { state: state4, render } = update(generateUUID, state3, {
        kind: EventKind.KEYDOWN,
        key: 'Backspace'
    })
    const expectedState = {
        ...state0,
        finder: {
            show: true,
            search: 'ad',
            options: ['Add']
        }
    }
    expect(state4).toEqual(expectedState)
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
    const state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1, render } = update(makeGenerateUUID(), state0, {
        kind: EventKind.KEYDOWN,
        key: 'Enter'
    })
    const { state: expectedState } = addNodeToGraph({
        state: { ...emptyState(), operations },
        position: { x: 0, y: 0 },
        operation: operations['Add'],
        generateUUID: makeGenerateUUID()
    })
    expect(state1).toEqual(expectedState)
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
    let state0 = openFinder({
        ...emptyState(),
        operations
    })
    let state1 = state0
    for (const key of 'add') {
        const { state } = update(generateUUID, state1, {
            kind: EventKind.KEYDOWN,
            key
        })
        state1 = state
    }
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.KEYDOWN,
        key: 'Enter'
    })
    const { state: expectedState } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: makeGenerateUUID()
    })
    expect(state2).toEqual(expectedState)
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
    let state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1 } = update(generateUUID, state0, {
        kind: EventKind.KEYDOWN,
        key: 'x'
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.KEYDOWN,
        key: 'Enter'
    })
    expect(state2).toEqual({ ...emptyState(), operations })
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
    let state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1 } = update(generateUUID, state0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'x'
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'ret'
    })
    const expectedState = { ...emptyState(), operations }
    expect(state2).toEqual(expectedState)
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
    let state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1, render } = update(generateUUID, state0, {
        kind: EventKind.KEYDOWN,
        key: 'Escape'
    })
    const expectedState = { ...emptyState(), operations }
    expect(state1).toEqual(expectedState)
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
    let state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1, render } = update(generateUUID, state0, {
        kind: EventKind.KEYDOWN,
        key: 'Shift'
    })
    expect(state1).toEqual(state0)
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
    let state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1, render } = update(generateUUID, state0, {
        kind: EventKind.KEYDOWN,
        key: 'Alt'
    })
    expect(state1).toEqual(state0)
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
    let state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1, render } = update(generateUUID, state0, {
        kind: EventKind.KEYDOWN,
        key: 'Control'
    })
    expect(state1).toEqual(state0)
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
    let state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1, render } = update(generateUUID, state0, {
        kind: EventKind.KEYDOWN,
        key: 'Meta'
    })
    expect(state1).toEqual(state0)
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
    let state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1, render } = update(generateUUID, state0, {
        kind: EventKind.KEYDOWN,
        key: 'Tab'
    })
    expect(state1).toEqual(state0)
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
    let state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1 } = update(generateUUID, state0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'a'
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'd'
    })
    const { state: state3, render } = update(generateUUID, state2, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const expectedState = {
        ...state0,
        finder: {
            show: true,
            search: 'add',
            options: ['Add']
        }
    }
    expect(state3).toEqual(expectedState)
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
    const state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1 } = update(generateUUID, state0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'a'
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'd'
    })
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'd'
    })
    const { state: state4, render } = update(generateUUID, state3, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'del'
    })
    const expectedState = {
        ...state0,
        finder: {
            show: true,
            search: 'ad',
            options: ['Add']
        }
    }
    expect(state4).toEqual(expectedState)
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
    const state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1 } = update(generateUUID, state0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'a'
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'space'
    })
    const { state: state3, render } = update(generateUUID, state2, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'd'
    })
    const expectedState = {
        ...state0,
        finder: {
            show: true,
            search: 'a d',
            options: []
        }
    }
    expect(state3).toEqual(expectedState)
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
    const state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1, render } = update(makeGenerateUUID(), state0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'ret'
    })
    const { state: expectedState } = addNodeToGraph({
        state: { ...emptyState(), operations },
        position: { x: 0, y: 0 },
        operation: operations['Add'],
        generateUUID: makeGenerateUUID()
    })
    expect(state1).toEqual(expectedState)
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
    let state0 = openFinder({
        ...emptyState(),
        operations
    })
    const { state: state1, render } = update(generateUUID, state0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'sft'
    })
    expect(state1).toEqual(state0)
    expect(render).toBeUndefined()
})

test("pressing number on keyboard appends to number node", () => {
    const uuidState = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidState)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { state: state0, node } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const state1 = openNumericKeyboard(state0, state0.graph.nodes[node].body!)
    let state2 = state1
    for (const key of '1234567890') {
        const { state } = update(generateUUID, state2, {
            kind: EventKind.KEYDOWN,
            key
        })
        state2 = state
    }
    const body = makeGenerateUUID({ i: uuidState.i - 1 })()
    const expectedState: State = {
        ...state0,
        operations,
        virtualKeyboard: {
            show: true,
            kind: VirtualKeyboardKind.NUMERIC
        },
        inputTarget: {
            kind: InputTargetKind.NUMBER,
            body
        },
        selected: {
            kind: SelectedKind.BODY,
            body
        },
        graph: {
            ...state0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    value: 1234567890
                }
            }
        }
    }
    expect(state2).toEqual(expectedState)
})

test("pressing backspace on keyboard deletes from number node", () => {
    const uuidState = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidState)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { state: state0, node } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const state1 = openNumericKeyboard(state0, state0.graph.nodes[node].body!)
    let state2 = state1
    for (const key of '1234567890') {
        const { state } = update(generateUUID, state2, {
            kind: EventKind.KEYDOWN,
            key
        })
        state2 = state
    }
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.KEYDOWN,
        key: 'Backspace'
    })
    const body = makeGenerateUUID({ i: uuidState.i - 1 })()
    const expectedState: State = {
        ...state0,
        operations,
        virtualKeyboard: {
            show: true,
            kind: VirtualKeyboardKind.NUMERIC
        },
        inputTarget: {
            kind: InputTargetKind.NUMBER,
            body
        },
        selected: {
            kind: SelectedKind.BODY,
            body
        },
        graph: {
            ...state0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    value: 123456789
                }
            }
        }
    }
    expect(state3).toEqual(expectedState)
})

test("pressing backspace when number node value is 0 has no effect", () => {
    const uuidState = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidState)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { state: state0, node } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const state1 = openNumericKeyboard(state0, state0.graph.nodes[node].body!)
    let state2 = state1
    for (let i = 0; i < 3; ++i) {
        const { state } = update(generateUUID, state1, {
            kind: EventKind.KEYDOWN,
            key: 'Backspace'
        })
        state2 = state
    }
    const body = makeGenerateUUID({ i: uuidState.i - 1 })()
    const expectedState: State = {
        ...state0,
        operations,
        virtualKeyboard: {
            show: true,
            kind: VirtualKeyboardKind.NUMERIC
        },
        inputTarget: {
            kind: InputTargetKind.NUMBER,
            body
        },
        selected: {
            kind: SelectedKind.BODY,
            body
        },
        graph: {
            ...state0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    value: 0
                }
            }
        }
    }
    expect(state2).toEqual(expectedState)
})

test("pressing del on virtual keyboard when number node value is 0 has no effect", () => {
    const uuidState = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidState)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { state: state0, node } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const state1 = openNumericKeyboard(state0, state0.graph.nodes[node].body!)
    let state2 = state1
    for (let i = 0; i < 3; ++i) {
        const { state } = update(generateUUID, state2, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key: 'del'
        })
        state2 = state
    }
    const body = makeGenerateUUID({ i: uuidState.i - 1 })()
    const expectedState: State = {
        ...state0,
        operations,
        virtualKeyboard: {
            show: true,
            kind: VirtualKeyboardKind.NUMERIC
        },
        inputTarget: {
            kind: InputTargetKind.NUMBER,
            body
        },
        selected: {
            kind: SelectedKind.BODY,
            body
        },
        graph: {
            ...state0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    value: 0
                }
            }
        }
    }
    expect(state2).toEqual(expectedState)
})

test("pressing number on virtual keyboard appends to number node", () => {
    const uuidState = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidState)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { state: state0, node } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const state1 = openNumericKeyboard(state0, state0.graph.nodes[node].body!)
    let state2 = state1
    for (const key of '1234567890') {
        const { state } = update(generateUUID, state2, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        })
        state2 = state
    }
    const body = makeGenerateUUID({ i: uuidState.i - 1 })()
    const expectedState: State = {
        ...state0,
        operations,
        virtualKeyboard: {
            show: true,
            kind: VirtualKeyboardKind.NUMERIC
        },
        inputTarget: {
            kind: InputTargetKind.NUMBER,
            body
        },
        selected: {
            kind: SelectedKind.BODY,
            body
        },
        graph: {
            ...state0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    value: 1234567890
                }
            }
        }
    }
    expect(state2).toEqual(expectedState)
})

test("pressing del on virtual keyboard deletes from number node", () => {
    const uuidState = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidState)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { state: state0, node } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const state1 = openNumericKeyboard(state0, state0.graph.nodes[node].body!)
    let state2 = state1
    for (const key of '1234567890') {
        const { state } = update(generateUUID, state2, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        })
        state2 = state
    }
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'del'
    })
    const body = makeGenerateUUID({ i: uuidState.i - 1 })()
    const expectedState: State = {
        ...state0,
        operations,
        virtualKeyboard: {
            show: true,
            kind: VirtualKeyboardKind.NUMERIC
        },
        inputTarget: {
            kind: InputTargetKind.NUMBER,
            body
        },
        selected: {
            kind: SelectedKind.BODY,
            body
        },
        graph: {
            ...state0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    value: 123456789
                }
            }
        }
    }
    expect(state3).toEqual(expectedState)
})


test("pressing enter on keyboard while editing number node exits virtual keyboard", () => {
    const uuidState = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidState)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { state: state0, node } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const state1 = openNumericKeyboard(state0, state0.graph.nodes[node].body!)
    let state2 = state1
    for (const key of '1234567890') {
        const { state } = update(generateUUID, state2, {
            kind: EventKind.KEYDOWN,
            key
        })
        state2 = state
    }
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.KEYDOWN,
        key: 'Enter'
    })
    const body = makeGenerateUUID({ i: uuidState.i - 1 })()
    const expectedState: State = {
        ...state0,
        operations,
        graph: {
            ...state0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    value: 1234567890
                }
            }
        }
    }
    expect(state3).toEqual(expectedState)
})

test("pressing ret on virtual keyboard while editing number node exits virtual keyboard", () => {
    const uuidState = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidState)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { state: state0, node } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const state1 = openNumericKeyboard(state0, state0.graph.nodes[node].body!)
    let state2 = state1
    for (const key of '1234567890') {
        const { state } = update(generateUUID, state2, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        })
        state2 = state
    }
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'ret'
    })
    const body = makeGenerateUUID({ i: uuidState.i - 1 })()
    const expectedState: State = {
        ...state0,
        operations,
        graph: {
            ...state0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    value: 1234567890
                }
            }
        }
    }
    expect(state3).toEqual(expectedState)
})


test("pressing non number on keyboard while editing number node is ignored", () => {
    const uuidState = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidState)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { state: state0, node } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const state1 = openNumericKeyboard(state0, node)
    let state2 = state1
    for (const key of 'qwertyuiopasdfghjklzxcvbnm') {
        const { state } = update(generateUUID, state2, {
            kind: EventKind.KEYDOWN,
            key
        })
        state2 = state
    }
    const body = makeGenerateUUID({ i: uuidState.i - 1 })()
    const expectedState: State = {
        ...state1,
        operations,
        graph: {
            ...state0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    value: 0
                }
            }
        }
    }
    expect(state2).toEqual(expectedState)
})


test("pressing non number on virtual keyboard while editing number node is ignored", () => {
    const uuidState = { i: 0 }
    const generateUUID = makeGenerateUUID(uuidState)
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { state: state0, node } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const state1 = openNumericKeyboard(state0, node)
    let state2 = state1
    for (const key of 'qwertyuiopasdfghjklzxcvbnm') {
        const { state } = update(generateUUID, state2, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        })
        state2 = state
    }
    const body = makeGenerateUUID({ i: uuidState.i - 1 })()
    const expectedState: State = {
        ...state1,
        operations,
        graph: {
            ...state0.graph,
            bodys: {
                [body]: {
                    uuid: body,
                    value: 0
                }
            }
        }
    }
    expect(state2).toEqual(expectedState)
})

test("pressing a key on virtual keyboard while no input target selected doesn't change the state", () => {
    const generateUUID = makeGenerateUUID()
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        }
    }
    const { state: state0 } = addNodeToGraph({
        state: {
            ...emptyState(),
            operations,
            virtualKeyboard: {
                show: true,
                kind: VirtualKeyboardKind.NUMERIC
            },
        },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { state: state1 } = update(generateUUID, state0, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: '1'
    })
    expect(state1).toEqual(state0)
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
    const { state: state0, node } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const body = state0.graph.nodes[node].body!
    const { state: state1 } = update(generateUUID, state0, {
        kind: EventKind.CLICKED_NUMBER,
        body
    })
    const expectedState = openNumericKeyboard(state0, body)
    expect(state1).toEqual(expectedState)
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
    const { state: state0, node: node0 } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { state: state1, node: node1 } = addNodeToGraph({
        state: state0,
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const body0 = state1.graph.nodes[node0].body!
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.CLICKED_NUMBER,
        body: body0
    })
    const body1 = state2.graph.nodes[node1].body!
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.CLICKED_NUMBER,
        body: body1
    })
    const expectedState = openNumericKeyboard(state1, body1)
    expect(state3).toEqual(expectedState)
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
    const { state: state0, node } = addNodeToGraph({
        state: { ...emptyState(), operations },
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const body = state0.graph.nodes[node].body!
    const { state: state1 } = update(generateUUID, state0, {
        kind: EventKind.CLICKED_NUMBER,
        body
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    expect(state2).toEqual(state0)
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
    const state0 = emptyState()
    const { state: state1 } = update(generateUUID, state0, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const expectedState0 = {
        ...emptyState(),
        dragging: true,
        potentialDoubleClick: true,
        pointers: [pointer0]
    }
    expect(state1).toEqual(expectedState0)
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const expectedState1 = {
        ...emptyState(),
        zooming: true,
        pointers: [pointer0, pointer1]
    }
    expect(state2).toEqual(expectedState1)
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer2
    })
    const expectedState2 = {
        ...emptyState(),
        zooming: true,
        pointerDistance: Math.sqrt(Math.pow(20, 2) + Math.pow(20, 2)),
        pointerCenter: { x: 10, y: 10 },
        pointers: [pointer0, pointer2]
    }
    expect(state3).toEqual(expectedState2)
    const { state: state4 } = update(generateUUID, state3, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer3
    })
    const expectedState3 = {
        ...emptyState(),
        zooming: true,
        pointerDistance: Math.sqrt(Math.pow(30, 2) + Math.pow(30, 2)),
        pointerCenter: { x: 15, y: 15 },
        pointers: [pointer0, pointer3],
        camera: [
            0.906625499506728, 0, -3.13250999013456,
            0, 0.906625499506728, -3.13250999013456,
            0, 0, 1,
        ]
    }
    expect(state4).toEqual(expectedState3)
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
    let state0 = { ...emptyState(), operations }
    const { state: state1, node } = addNodeToGraph({
        state: state0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    expect(state3).toEqual(state0)
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
    let state0 = { ...emptyState(), operations }
    const { state: state1, node } = addNodeToGraph({
        state: state0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    expect(state3).toEqual(state1)
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
    let state0 = { ...emptyState(), operations }
    const { state: state1, node } = addNodeToGraph({
        state: state0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const input = state1.graph.nodes[node].inputs[0]
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.CLICKED_INPUT,
        input
    })
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    expect(state3).toEqual(state1)
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
    let state0 = { ...emptyState(), operations }
    const { state: state1, node } = addNodeToGraph({
        state: state0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID
    })
    const output = state1.graph.nodes[node].outputs[0]
    const { state: state2 } = update(generateUUID, state1, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { state: state3 } = update(generateUUID, state2, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    expect(state3).toEqual(state1)
})