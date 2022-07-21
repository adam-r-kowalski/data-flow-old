/*
import { AppEvent, EventKind, openFinder, openNumericKeyboard, update as originalUpdate } from "../src/event"
import { translate } from "../src/linear_algebra/matrix3x3"
import { initialState as originalInitialState, InputTargetKind, State, VirtualKeyboardKind } from "../src/state"
*/

import { EventKind, openFinder, update } from "../src/event"
import { translate } from "../src/linear_algebra/matrix3x3"
import { initialState } from "../src/state"

const generateUUID = () => {
    let i = 0
    return () => {
        const uuid = i.toString()
        ++i
        return uuid
    }
}

test("pointer down", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1, schedule } = update(generateUUID0, state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const expectedState = initialState(generateUUID1)
    expectedState.dragging = true
    expectedState.pointers = [pointer]
    expectedState.potentialDoubleClick = true
    expect(state1).toEqual(expectedState)
    expect(schedule).toEqual([
        {
            after: { milliseconds: 300 },
            event: { kind: EventKind.DOUBLE_CLICK_TIMEOUT }
        }
    ])
})

test("two pointers down", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const pointer0 = {
        x: 0,
        y: 0,
        id: 0,
    }
    const pointer1 = {
        x: 0,
        y: 0,
        id: 1,
    }
    const { state: state1, schedule } = update(generateUUID0, state, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { state: state2 } = update(generateUUID0, state1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const expectedState = initialState(generateUUID1)
    expectedState.pointers = [pointer0, pointer1]
    expectedState.zooming = true
    expect(state2).toEqual(expectedState)
    expect(schedule).toEqual([
        {
            after: { milliseconds: 300 },
            event: { kind: EventKind.DOUBLE_CLICK_TIMEOUT }
        }
    ])
})

test("pointer double click", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1 } = update(generateUUID0, state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { state: state2 } = update(generateUUID0, state1, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const { state: state3, dispatch } = update(generateUUID0, state2, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const expectedState = initialState(generateUUID1)
    expectedState.pointers = [pointer]
    expect(state3).toEqual(expectedState)
    expect(dispatch).toEqual([{ kind: EventKind.DOUBLE_CLICK, pointer }])
})

test("pointer double click timeout", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1 } = update(generateUUID0, state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { state: state2 } = update(generateUUID0, state1, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const { state: state3 } = update(generateUUID0, state2, {
        kind: EventKind.DOUBLE_CLICK_TIMEOUT
    })
    const expectedState = initialState(generateUUID1)
    expect(state3).toEqual(expectedState)
})

test("pointer down then up", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1 } = update(generateUUID0, state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { state: state2 } = update(generateUUID0, state1, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const expectedState = initialState(generateUUID1)
    expectedState.potentialDoubleClick = true
    expect(state2).toEqual(expectedState)
})

test("two pointers down then up", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const pointer0 = {
        x: 0,
        y: 0,
        id: 0,
    }
    const pointer1 = {
        x: 0,
        y: 0,
        id: 1,
    }
    const { state: state1 } = update(generateUUID0, state, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { state: state2 } = update(generateUUID0, state1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const { state: state3 } = update(generateUUID0, state2, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0
    })
    const expectedState = initialState(generateUUID1)
    expectedState.dragging = true
    expectedState.pointers = [pointer1]
    expect(state3).toEqual(expectedState)
})

test("pointer down when finder open", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = openFinder(initialState(generateUUID0))
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1 } = update(generateUUID0, state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const expectedState = openFinder(initialState(generateUUID1))
    expect(state1).toEqual(expectedState)
})


test("click node", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const nodeUUID = state.graph.nodeOrder[0]
    const { state: state1, render } = update(generateUUID0, state, {
        kind: EventKind.CLICKED_NODE,
        nodeUUID
    })
    const expectedState = initialState(generateUUID1)
    expectedState.draggedNode = nodeUUID
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("pointer move before pointer down does nothing", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1 } = update(generateUUID0, state, {
        kind: EventKind.POINTER_MOVE,
        pointer
    })
    expect(state1).toEqual(initialState(generateUUID1))
})

test("pointer move after pointer down", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const { state: state1 } = update(generateUUID0, state, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            x: 0,
            y: 0,
            id: 0,
        }
    })
    const { state: state2, render } = update(generateUUID0, state1, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            x: 50,
            y: 75,
            id: 0,
        }
    })
    const expectedState = initialState(generateUUID1)
    expectedState.camera = translate(-50, -75)
    expectedState.potentialDoubleClick = true
    expectedState.dragging = true
    expectedState.pointers = [
        {
            id: 0,
            x: 50,
            y: 75
        }
    ]
    expect(state2).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("pointer move after clicking node pointer down", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const nodeUUID = state.graph.nodeOrder[0]
    const { state: state1 } = update(generateUUID0, state, {
        kind: EventKind.CLICKED_NODE,
        nodeUUID
    })
    const { state: state2 } = update(generateUUID0, state1, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            x: 0,
            y: 0,
            id: 0,
        }
    })
    const { state: state3, render } = update(generateUUID0, state2, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            x: 50,
            y: 75,
            id: 0,
        }
    })
    expect(state3.camera).toEqual(initialState(generateUUID1).camera)
    expect(render).toEqual(true)
})

test("pointer move after clicking node, pointer down, then pointer up", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const nodeUUID = state.graph.nodeOrder[0]
    const { state: state1 } = update(generateUUID0, state, {
        kind: EventKind.CLICKED_NODE,
        nodeUUID
    })
    const { state: state2 } = update(generateUUID0, state1, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            x: 0,
            y: 0,
            id: 0,
        }
    })
    const { state: state3 } = update(generateUUID0, state2, {
        kind: EventKind.POINTER_UP,
        pointer: {
            x: 0,
            y: 0,
            id: 0,
        }
    })
    const { state: state4 } = update(generateUUID0, state3, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            x: 50,
            y: 75,
            id: 0,
        }
    })
    expect(state4.camera).toEqual(initialState(generateUUID1).camera)
})

test("mouse wheel zooms in camera relative to mouse position", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const { state: state1 } = update(generateUUID0, state, {
        kind: EventKind.WHEEL,
        x: 50,
        y: 100,
        deltaY: 10
    })
    const expectedState = initialState(generateUUID1)
    expectedState.camera = [
        1.0717734625362931, 0, -3.588673126814655,
        0, 1.0717734625362931, -7.17734625362931,
        0, 0, 1,
    ]
    expect(state1).toEqual(expectedState)
})

test("clicking input selects it", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const nodeUUID = state.graph.nodeOrder[2]
    const inputPath = { nodeUUID, inputIndex: 0 }
    const { state: state1, render } = update(generateUUID0, state, {
        kind: EventKind.CLICKED_INPUT,
        inputPath
    })
    const expectedState = initialState(generateUUID1)
    expectedState.graph.nodes[nodeUUID].inputs[0].selected = true
    expectedState.selectedInput = inputPath
    expectedState.draggedNode = inputPath.nodeUUID
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("clicking new input selects it and deselects old input", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const nodeUUID = state.graph.nodeOrder[2]
    const { state: state1 } = update(generateUUID0, state, {
        kind: EventKind.CLICKED_INPUT,
        inputPath: { nodeUUID, inputIndex: 0 }
    })
    const { state: state2, render } = update(generateUUID0, state1, {
        kind: EventKind.CLICKED_INPUT,
        inputPath: { nodeUUID, inputIndex: 1 }
    })
    const expectedState = initialState(generateUUID1)
    expectedState.graph.nodes[2].inputs[1].selected = true
    expectedState.selectedInput = { nodeUUID, inputIndex: 1 }
    expectedState.draggedNode = nodeUUID
    expect(state2).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("clicking output after clicking input adds connection", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const state = initialState(generateUUID0)
    const inputUUID = state.graph.nodeOrder[2]
    const outputUUID = state.graph.nodeOrder[2]
    const { state: state1 } = update(generateUUID0, state, {
        kind: EventKind.CLICKED_INPUT,
        inputPath: { nodeUUID: inputUUID, inputIndex: 1 }
    })
    const { state: state2, render } = update(generateUUID0, state1, {
        kind: EventKind.CLICKED_OUTPUT,
        outputPath: { nodeUUID: outputUUID, outputIndex: 0 }
    })
    const expectedState = initialState(generateUUID1)
    expectedState.graph.edges.push({
        input: { nodeUUID: inputUUID, inputIndex: 1 },
        output: { nodeUUID: outputUUID, outputIndex: 0 }
    })
    expectedState.graph.nodes[inputUUID].inputs[1].edgeIndices.push(5)
    expectedState.graph.nodes[outputUUID].outputs[0].edgeIndices.push(5)
    expect(state2).toEqual(expectedState)
    expect(render).toEqual(true)
})

/*
test("clicking output selects it", () => {
    const state = initialState()
    const expectedState = initialState()
    const outputPath = { nodeIndex: 0, outputIndex: 0 }
    const { state: state1, render } = update(state, {
        kind: EventKind.CLICKED_OUTPUT,
        outputPath
    })
    expectedState.graph.nodes[0].outputs[0].selected = true
    expectedState.selectedOutput = outputPath
    expectedState.draggedNode = outputPath.nodeIndex
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("clicking new output selects it and deselects old output", () => {
    const state = initialState()
    const expectedState = initialState()
    const { state: state1 } = update(state, {
        kind: EventKind.CLICKED_OUTPUT,
        outputPath: { nodeIndex: 0, outputIndex: 0 }
    })
    const { state: state2, render } = update(state1, {
        kind: EventKind.CLICKED_OUTPUT,
        outputPath: { nodeIndex: 1, outputIndex: 0 }
    })
    expectedState.graph.nodes[1].outputs[0].selected = true
    expectedState.selectedOutput = { nodeIndex: 1, outputIndex: 0 }
    expectedState.draggedNode = 1
    expect(state2).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("clicking input after clicking output adds connection", () => {
    const state = initialState()
    const expectedState = initialState()
    const { state: state1 } = update(state, {
        kind: EventKind.CLICKED_OUTPUT,
        outputPath: { nodeIndex: 0, outputIndex: 0 }
    })
    const { state: state2, render } = update(state1, {
        kind: EventKind.CLICKED_INPUT,
        inputPath: { nodeIndex: 2, inputIndex: 1 }
    })
    expectedState.graph.edges.push({
        input: { nodeIndex: 2, inputIndex: 1 },
        output: { nodeIndex: 0, outputIndex: 0 }
    })
    expectedState.graph.nodes[2].inputs[1].edgeIndices.push(5)
    expectedState.graph.nodes[0].outputs[0].edgeIndices.push(5)
    expect(state2).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("double click opens finder", () => {
    const state = initialState()
    const { state: state1, render } = update(state, {
        kind: EventKind.DOUBLE_CLICK,
        pointer: {
            x: 50,
            y: 50,
            id: 0
        }
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expectedState.virtualKeyboard.show = true
    expectedState.inputTarget = { kind: InputTargetKind.FINDER }
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expectedState.nodePlacementLocation = { x: 50, y: 50 }
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})


test("key down when finder is not shown does nothing", () => {
    const state = initialState()
    const { state: state1 } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'a'
    })
    const expectedState = initialState()
    expect(state1).toEqual(expectedState)
})


test("f key down when finder is not shown opens finder", () => {
    const state = initialState()
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'f'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expectedState.virtualKeyboard.show = true
    expectedState.inputTarget = { kind: InputTargetKind.FINDER }
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("clicking a finder option adds node to graph", () => {
    const state = openFinder(initialState())
    const { state: state1, render } = update(state, {
        kind: EventKind.CLICKED_FINDER_OPTION,
        option: 'Number'
    })
    const expectedState = initialState()
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expectedState.graph.nodes[6] = {
        name: "Number",
        inputs: [],
        body: {
            value: 0,
            editing: false,
        },
        outputs: [
            { name: "out", selected: false, edgeIndices: [] }
        ],
        x: 0,
        y: 0
    }
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})


test("key down when finder is shown appends to search", () => {
    const state = openFinder(initialState())
    const { state: state1 } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'a'
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const { state: state3, render } = update(state2, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expectedState.finder.search = 'add'
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.ALPHABETIC
    }
    expectedState.inputTarget.kind = InputTargetKind.FINDER
    expectedState.finder.options = ["Add"]
    expect(state3).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("backspace key down when finder is shown deletes from search", () => {
    const state = openFinder(initialState())
    const { state: state1 } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'a'
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const { state: state3 } = update(state2, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const { state: state4, render } = update(state3, {
        kind: EventKind.KEYDOWN,
        key: 'Backspace'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expectedState.finder.search = 'ad'
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.ALPHABETIC
    }
    expectedState.inputTarget.kind = InputTargetKind.FINDER
    expectedState.finder.options = ["Add"]
    expect(state4).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("enter key down when finder is shown closes finder and adds node", () => {
    const state = openFinder(initialState())
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Enter'
    })
    const expectedState = initialState()
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expectedState.graph.nodes[6] = {
        name: "Number",
        inputs: [],
        body: {
            value: 0,
            editing: false,
        },
        outputs: [
            { name: "out", selected: false, edgeIndices: [] }
        ],
        x: 0,
        y: 0
    }
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("enter key down when finder is shown and finder has search closes finder and adds node", () => {
    let state = openFinder(initialState())
    for (const key of 'add') {
        const { state: nextState } = update(state, {
            kind: EventKind.KEYDOWN,
            key
        })
        state = nextState
    }
    const { state: nextState } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Enter'
    })
    state = nextState
    const expectedState = initialState()
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expectedState.graph.nodes[6] = {
        name: "Add",
        inputs: [
            { name: "x", selected: false, edgeIndices: [] },
            { name: "y", selected: false, edgeIndices: [] }
        ],
        outputs: [
            { name: "out", selected: false, edgeIndices: [] }
        ],
        x: 0,
        y: 0
    }
    expect(state).toEqual(expectedState)
})

test("enter key down when finder is shown and finder has search eliminates all options closes finder", () => {
    let state = openFinder(initialState())
    const { state: state1 } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'x'
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.KEYDOWN,
        key: 'Enter'
    })
    const expectedState = initialState()
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expect(state2).toEqual(expectedState)
})


test("ret virtual key down when finder is shown and finder has search eliminates all options closes finder", () => {
    let state = openFinder(initialState())
    const { state: state1 } = update(state, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'x'
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'ret'
    })
    const expectedState = initialState()
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expect(state2).toEqual(expectedState)
})


test("escape key down when finder is shown closes finder", () => {
    const state = openFinder(initialState())
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Escape'
    })
    const expectedState = initialState()
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("shift key down when finder is shown are ignored", () => {
    const state = openFinder(initialState())
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Shift'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.ALPHABETIC
    }
    expectedState.inputTarget.kind = InputTargetKind.FINDER
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("alt key down when finder is shown are ignored", () => {
    const state = openFinder(initialState())
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Alt'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.ALPHABETIC
    }
    expectedState.inputTarget.kind = InputTargetKind.FINDER
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("control key down when finder is shown are ignored", () => {
    const state = openFinder(initialState())
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Control'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.ALPHABETIC
    }
    expectedState.inputTarget.kind = InputTargetKind.FINDER
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("meta key down when finder is shown are ignored", () => {
    const state = openFinder(initialState())
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Meta'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.ALPHABETIC
    }
    expectedState.inputTarget.kind = InputTargetKind.FINDER
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("Tab key down when finder is shown are ignored", () => {
    const state = openFinder(initialState())
    state.finder.show = true
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Tab'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.ALPHABETIC
    }
    expectedState.inputTarget.kind = InputTargetKind.FINDER
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("virtual key down when finder is shown appends to search", () => {
    const state = openFinder(initialState())
    const { state: state1 } = update(state, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'a'
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'd'
    })
    const { state: state3, render } = update(state2, {
        kind: EventKind.KEYDOWN,
        key: 'd'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expectedState.finder.search = 'add'
    expectedState.finder.options = ['Add']
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.ALPHABETIC
    }
    expectedState.inputTarget.kind = InputTargetKind.FINDER
    expect(state3).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("del virtual key down when finder is shown deletes from search", () => {
    const state = openFinder(initialState())
    const { state: state1 } = update(state, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'a'
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'd'
    })
    const { state: state3 } = update(state2, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'd'
    })
    const { state: state4, render } = update(state3, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'del'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expectedState.finder.search = 'ad'
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.ALPHABETIC
    }
    expectedState.inputTarget.kind = InputTargetKind.FINDER
    expectedState.finder.options = ['Add']
    expect(state4).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("space virtual key down when finder is shown adds space to search", () => {
    const state = openFinder(initialState())
    const { state: state1 } = update(state, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'a'
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'space'
    })
    const { state: state3, render } = update(state2, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'd'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expectedState.finder.search = 'a d'
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.ALPHABETIC
    }
    expectedState.inputTarget.kind = InputTargetKind.FINDER
    expect(state3).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("ret virtual key down when finder is shown closes finder", () => {
    const state = openFinder(initialState())
    const { state: state1, render } = update(state, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'ret'
    })
    const expectedState = initialState()
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expectedState.graph.nodes[6] = {
        name: "Number",
        inputs: [],
        body: {
            value: 0,
            editing: false,
        },
        outputs: [
            { name: "out", selected: false, edgeIndices: [] }
        ],
        x: 0,
        y: 0
    }
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("sft virtual key down when finder is shown are ignored", () => {
    const state = openFinder(initialState())
    const { state: state1, render } = update(state, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'sft'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.ALPHABETIC
    }
    expectedState.inputTarget.kind = InputTargetKind.FINDER
    expectedState.finder.options = [
        "Number", "Add", "Subtract", "Multiply", "Divide", "Equal", "Less Than", "Log"
    ]
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("pressing number on keyboard appends to number node", () => {
    const nodeIndex = 3
    let state = openNumericKeyboard(initialState(), nodeIndex)
    for (const key of '1234567890') {
        const { state: nextState } = update(state, {
            kind: EventKind.KEYDOWN,
            key
        })
        state = nextState
    }
    const expectedState = initialState()
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    }
    expectedState.inputTarget = {
        kind: InputTargetKind.NUMBER,
        nodeIndex
    }
    expectedState.graph.nodes[nodeIndex].body!.editing = true
    expectedState.graph.nodes[nodeIndex].body!.value = 151234567890
    expect(state).toEqual(expectedState)
})

test("pressing backspace on keyboard deletes from number node", () => {
    const nodeIndex = 3
    let state = openNumericKeyboard(initialState(), nodeIndex)
    for (const key of '1234567890') {
        const { state: nextState } = update(state, {
            kind: EventKind.KEYDOWN,
            key
        })
        state = nextState
    }
    const { state: nextState } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Backspace'
    })
    state = nextState
    const expectedState = initialState()
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    }
    expectedState.inputTarget = {
        kind: InputTargetKind.NUMBER,
        nodeIndex
    }
    expectedState.graph.nodes[nodeIndex].body!.editing = true
    expectedState.graph.nodes[nodeIndex].body!.value = 15123456789
    expect(state).toEqual(expectedState)
})

test("pressing backspace when number node value is 0 has no effect", () => {
    const nodeIndex = 3
    let state = openNumericKeyboard(initialState(), nodeIndex)
    for (let i = 0; i < 3; ++i) {
        const { state: nextState } = update(state, {
            kind: EventKind.KEYDOWN,
            key: 'Backspace'
        })
        state = nextState
    }
    const expectedState = initialState()
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    }
    expectedState.inputTarget = {
        kind: InputTargetKind.NUMBER,
        nodeIndex
    }
    expectedState.graph.nodes[nodeIndex].body!.editing = true
    expectedState.graph.nodes[nodeIndex].body!.value = 0
    expect(state).toEqual(expectedState)
})

test("pressing del on virtual keyboard when number node value is 0 has no effect", () => {
    const nodeIndex = 3
    let state = openNumericKeyboard(initialState(), nodeIndex)
    for (let i = 0; i < 3; ++i) {
        const { state: nextState } = update(state, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key: 'del'
        })
        state = nextState
    }
    const expectedState = initialState()
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    }
    expectedState.inputTarget = {
        kind: InputTargetKind.NUMBER,
        nodeIndex
    }
    expectedState.graph.nodes[nodeIndex].body!.editing = true
    expectedState.graph.nodes[nodeIndex].body!.value = 0
    expect(state).toEqual(expectedState)
})

test("pressing number on virtual keyboard appends to number node", () => {
    const nodeIndex = 3
    let state = openNumericKeyboard(initialState(), nodeIndex)
    for (const key of '1234567890') {
        const { state: nextState } = update(state, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        })
        state = nextState
    }
    const expectedState = initialState()
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    }
    expectedState.inputTarget = {
        kind: InputTargetKind.NUMBER,
        nodeIndex
    }
    expectedState.graph.nodes[nodeIndex].body!.editing = true
    expectedState.graph.nodes[nodeIndex].body!.value = 151234567890
    expect(state).toEqual(expectedState)
})

test("pressing del on virtual keyboard deletes from number node", () => {
    const nodeIndex = 3
    let state = openNumericKeyboard(initialState(), nodeIndex)
    for (const key of '1234567890') {
        const { state: nextState } = update(state, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        })
        state = nextState
    }
    const { state: nextState } = update(state, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'del'
    })
    state = nextState
    const expectedState = initialState()
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    }
    expectedState.inputTarget = {
        kind: InputTargetKind.NUMBER,
        nodeIndex
    }
    expectedState.graph.nodes[nodeIndex].body!.editing = true
    expectedState.graph.nodes[nodeIndex].body!.value = 15123456789
    expect(state).toEqual(expectedState)
})


test("pressing enter on keyboard while editing number node exits virtual keyboard", () => {
    const nodeIndex = 3
    let state = openNumericKeyboard(initialState(), nodeIndex)
    for (const key of '1234567890') {
        const { state: nextState } = update(state, {
            kind: EventKind.KEYDOWN,
            key
        })
        state = nextState
    }
    const { state: nextState } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Enter'
    })
    state = nextState
    const expectedState = initialState()
    expectedState.graph.nodes[nodeIndex].body!.value = 151234567890
    expect(state).toEqual(expectedState)
})

test("pressing ret on virtual keyboard while editing number node exits virtual keyboard", () => {
    const nodeIndex = 3
    let state = openNumericKeyboard(initialState(), nodeIndex)
    for (const key of '1234567890') {
        const { state: nextState } = update(state, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        })
        state = nextState
    }
    const { state: nextState } = update(state, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'ret'
    })
    state = nextState
    const expectedState = initialState()
    expectedState.graph.nodes[nodeIndex].body!.value = 151234567890
    expect(state).toEqual(expectedState)
})


test("pressing non number on keyboard while editing number node is ignored", () => {
    const nodeIndex = 3
    let state = openNumericKeyboard(initialState(), nodeIndex)
    for (const key of 'qwertyuiopasdfghjklzxcvbnm') {
        const { state: nextState } = update(state, {
            kind: EventKind.KEYDOWN,
            key
        })
        state = nextState
    }
    const expectedState = initialState()
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    }
    expectedState.inputTarget = {
        kind: InputTargetKind.NUMBER,
        nodeIndex
    }
    expectedState.graph.nodes[nodeIndex].body!.editing = true
    expect(state).toEqual(expectedState)
})


test("pressing non number on virtual keyboard while editing number node is ignored", () => {
    const nodeIndex = 3
    let state = openNumericKeyboard(initialState(), nodeIndex)
    for (const key of 'qwertyuiopasdfghjklzxcvbnm') {
        const { state: nextState } = update(state, {
            kind: EventKind.VIRTUAL_KEYDOWN,
            key
        })
        state = nextState
    }
    const expectedState = initialState()
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    }
    expectedState.inputTarget = {
        kind: InputTargetKind.NUMBER,
        nodeIndex
    }
    expectedState.graph.nodes[nodeIndex].body!.editing = true
    expect(state).toEqual(expectedState)
})

test("pressing a key on virtual keyboard while no input target selected doesn't change the state", () => {
    let state = initialState()
    state.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    }
    const { state: state1 } = update(state, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: '1'
    })
    const expectedState = initialState()
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    }
    expect(state1).toEqual(expectedState)
})

test("clicking a number node opens the numeric keyboard", () => {
    const nodeIndex = 3
    const state = initialState()
    const { state: state1 } = update(state, {
        kind: EventKind.CLICKED_NUMBER,
        nodeIndex
    })
    const expectedState = initialState()
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    }
    expectedState.inputTarget = {
        kind: InputTargetKind.NUMBER,
        nodeIndex
    }
    expectedState.graph.nodes[nodeIndex].body!.editing = true
    expectedState.graph.nodes[nodeIndex].body!.value = 15
    expect(state1).toEqual(expectedState)
})

test("clicking a number node when another number node is selected switches selections", () => {
    const state = initialState()
    const { state: state1 } = update(state, {
        kind: EventKind.CLICKED_NUMBER,
        nodeIndex: 0
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.CLICKED_NUMBER,
        nodeIndex: 1
    })
    const expectedState = initialState()
    expectedState.virtualKeyboard = {
        show: true,
        kind: VirtualKeyboardKind.NUMERIC
    }
    expectedState.inputTarget = {
        kind: InputTargetKind.NUMBER,
        nodeIndex: 1
    }
    expectedState.graph.nodes[1].body!.editing = true
    expectedState.graph.nodes[1].body!.value = 10
    expect(state2).toEqual(expectedState)
})

test("clicking background when a number node is selected deselects it", () => {
    const state = initialState()
    const { state: state1 } = update(state, {
        kind: EventKind.CLICKED_NUMBER,
        nodeIndex: 3
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.CLICKED_BACKGROUND,
    })
    const expectedState = initialState()
    expect(state2).toEqual(expectedState)
})


test("zooming", () => {
    const state = initialState()
    const pointer0 = {
        x: 0,
        y: 0,
        id: 0,
    }
    const pointer1 = {
        x: 10,
        y: 10,
        id: 1,
    }
    const pointer2 = {
        x: 20,
        y: 20,
        id: 1,
    }
    const pointer3 = {
        x: 30,
        y: 30,
        id: 1,
    }
    const { state: state1 } = update(state, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    {
        const expectedState = initialState()
        expectedState.dragging = true
        expectedState.potentialDoubleClick = true
        expectedState.pointers = [pointer0]
        expect(state1).toEqual(expectedState)
    }
    const { state: state2 } = update(state1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    {
        const expectedState = initialState()
        expectedState.zooming = true
        expectedState.pointers = [pointer0, pointer1]
        expect(state2).toEqual(expectedState)
    }
    const { state: state3 } = update(state2, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer2
    })
    {
        const expectedState = initialState()
        expectedState.zooming = true
        expectedState.pointerDistance = Math.sqrt(Math.pow(20, 2) + Math.pow(20, 2))
        expectedState.pointerCenter = [10, 10]
        expectedState.pointers = [pointer0, pointer2]
        expect(state3).toEqual(expectedState)
    }
    const { state: state4 } = update(state3, {
        kind: EventKind.POINTER_MOVE,
        pointer: pointer3
    })
    {
        const expectedState = initialState()
        expectedState.zooming = true
        expectedState.pointerDistance = Math.sqrt(Math.pow(30, 2) + Math.pow(30, 2))
        expectedState.pointerCenter = [15, 15]
        expectedState.pointers = [pointer0, pointer3]
        expectedState.camera = [
            0.906625499506728, 0, -3.13250999013456,
            0, 0.906625499506728, -3.13250999013456,
            0, 0, 1,
        ]
        expect(state4).toEqual(expectedState)
    }
})
*/