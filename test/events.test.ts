import { EventKind, update } from "../src/event"
import { identity, translate } from "../src/linear_algebra/matrix3x3"
import { State } from "../src/state"

const initialState = (): State => ({
    graph: {
        nodes: [
            {
                name: "Source",
                inputs: [],
                outputs: [
                    { name: "Out 1", selected: false, edgeIndices: [] },
                    { name: "Out 2", selected: false, edgeIndices: [] },
                ],
                x: 100,
                y: 200
            },
            {
                name: "Transform",
                inputs: [
                    { name: "In 1", selected: false, edgeIndices: [] },
                    { name: "In 2", selected: false, edgeIndices: [] }
                ],
                outputs: [
                    { name: "Out 1", selected: false, edgeIndices: [] },
                    { name: "Out 2", selected: false, edgeIndices: [] }
                ],
                x: 400,
                y: 300
            },
            {
                name: "Sink",
                inputs: [
                    { name: "In 1", selected: false, edgeIndices: [] },
                    { name: "In 2", selected: false, edgeIndices: [] }
                ],
                outputs: [],
                x: 800,
                y: 250
            },
        ],
        edges: []
    },
    zooming: false,
    dragging: false,
    draggedNode: null,
    pointers: [],
    pointerDistance: 0,
    pointerCenter: [0, 0],
    camera: identity(),
    selectedInput: null,
    selectedOutput: null,
    theme: {
        background: { red: 2, green: 22, blue: 39, alpha: 255 },
        node: { red: 41, green: 95, blue: 120, alpha: 255 },
        input: { red: 188, green: 240, blue: 192, alpha: 255 },
        selectedInput: { red: 175, green: 122, blue: 208, alpha: 255 },
        connection: { red: 255, green: 255, blue: 255, alpha: 255 },
    },
    potentialDoubleClick: false,
    finder: {
        search: '',
        show: false
    },
    operations: {}
})

test("pointer down", () => {
    const state = initialState()
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1, schedule } = update(state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const expectedState = initialState()
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
    const state = initialState()
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
    const { state: state1, schedule } = update(state, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const expectedState = initialState()
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
    const state = initialState()
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1 } = update(state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const { state: state3, dispatch } = update(state2, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const expectedState = initialState()
    expectedState.pointers = [pointer]
    expect(state3).toEqual(expectedState)
    expect(dispatch).toEqual([{ kind: EventKind.DOUBLE_CLICK }])
})

test("pointer double click timeout", () => {
    const state = initialState()
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1 } = update(state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const { state: state3 } = update(state2, {
        kind: EventKind.DOUBLE_CLICK_TIMEOUT
    })
    const expectedState = initialState()
    expect(state3).toEqual(expectedState)
})

test("pointer down then up", () => {
    const state = initialState()
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1 } = update(state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const expectedState = initialState()
    expectedState.potentialDoubleClick = true
    expect(state2).toEqual(expectedState)
})

test("two pointers down then up", () => {
    const state = initialState()
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
    const { state: state1 } = update(state, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer0
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.POINTER_DOWN,
        pointer: pointer1
    })
    const { state: state3 } = update(state2, {
        kind: EventKind.POINTER_UP,
        pointer: pointer0
    })
    const expectedState = initialState()
    expectedState.dragging = true
    expectedState.pointers = [pointer1]
    expect(state3).toEqual(expectedState)
})


test("click node", () => {
    const state = initialState()
    const { state: state1, render } = update(state, {
        kind: EventKind.CLICKED_NODE,
        index: 0
    })
    const expectedState = initialState()
    expectedState.draggedNode = 0
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("pointer move before pointer down does nothing", () => {
    const state = initialState()
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1 } = update(state, {
        kind: EventKind.POINTER_MOVE,
        pointer
    })
    expect(state1).toEqual(initialState())
})

test("pointer move after pointer down", () => {
    const state = initialState()
    const { state: state1 } = update(state, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            x: 0,
            y: 0,
            id: 0,
        }
    })
    const { state: state2, render } = update(state1, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            x: 50,
            y: 75,
            id: 0,
        }
    })
    const expectedState = initialState()
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
    const state = initialState()
    const { state: state1 } = update(state, {
        kind: EventKind.CLICKED_NODE,
        index: 0
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            x: 0,
            y: 0,
            id: 0,
        }
    })
    const { state: state3, render } = update(state2, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            x: 50,
            y: 75,
            id: 0,
        }
    })
    expect(state3.camera).toEqual(initialState().camera)
    expect(state3.graph.nodes).toEqual([
        {
            name: "Source",
            inputs: [],
            outputs: [
                { name: "Out 1", selected: false, edgeIndices: [] },
                { name: "Out 2", selected: false, edgeIndices: [] }
            ],
            x: 150,
            y: 275
        },
        {
            name: "Transform",
            inputs: [
                { name: "In 1", selected: false, edgeIndices: [] },
                { name: "In 2", selected: false, edgeIndices: [] }
            ],
            outputs: [
                { name: "Out 1", selected: false, edgeIndices: [] },
                { name: "Out 2", selected: false, edgeIndices: [] }
            ],
            x: 400,
            y: 300
        },
        {
            name: "Sink",
            inputs: [
                { name: "In 1", selected: false, edgeIndices: [] },
                { name: "In 2", selected: false, edgeIndices: [] }
            ],
            outputs: [],
            x: 800,
            y: 250
        },
    ])
    expect(render).toEqual(true)
})

test("pointer move after clicking node, pointer down, then pointer up", () => {
    const state = initialState()
    const { state: state1 } = update(state, {
        kind: EventKind.CLICKED_NODE,
        index: 0
    })
    const { state: state2 } = update(state1, {
        kind: EventKind.POINTER_DOWN,
        pointer: {
            x: 0,
            y: 0,
            id: 0,
        }
    })
    const { state: state3 } = update(state2, {
        kind: EventKind.POINTER_UP,
        pointer: {
            x: 0,
            y: 0,
            id: 0,
        }
    })
    const { state: state4 } = update(state3, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            x: 50,
            y: 75,
            id: 0,
        }
    })
    expect(state4.camera).toEqual(initialState().camera)
    expect(state4.graph.nodes).toEqual([
        {
            name: "Source",
            inputs: [],
            outputs: [
                { name: "Out 1", selected: false, edgeIndices: [] },
                { name: "Out 2", selected: false, edgeIndices: [] }
            ],
            x: 100,
            y: 200
        },
        {
            name: "Transform",
            inputs: [
                { name: "In 1", selected: false, edgeIndices: [] },
                { name: "In 2", selected: false, edgeIndices: [] }
            ],
            outputs: [
                { name: "Out 1", selected: false, edgeIndices: [] },
                { name: "Out 2", selected: false, edgeIndices: [] }
            ],
            x: 400,
            y: 300
        },
        {
            name: "Sink",
            inputs: [
                { name: "In 1", selected: false, edgeIndices: [] },
                { name: "In 2", selected: false, edgeIndices: [] }
            ],
            outputs: [],
            x: 800,
            y: 250
        },
    ])
})

test("mouse wheel zooms in camera relative to mouse position", () => {
    const state = initialState()
    const { state: state1 } = update(state, {
        kind: EventKind.WHEEL,
        x: 50,
        y: 100,
        deltaY: 10
    })
    const expectedState = initialState()
    expectedState.camera = [
        1.0717734625362931, 0, -3.588673126814655,
        0, 1.0717734625362931, -7.17734625362931,
        0, 0, 1,
    ]
    expect(state1).toEqual(expectedState)
})

test("clicking input selects it", () => {
    const state = initialState()
    const expectedState = initialState()
    const inputPath = { nodeIndex: 1, inputIndex: 0 }
    const { state: state1, render } = update(state, {
        kind: EventKind.CLICKED_INPUT,
        inputPath
    })
    expectedState.graph.nodes[1].inputs[0].selected = true
    expectedState.selectedInput = inputPath
    expectedState.draggedNode = inputPath.nodeIndex
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("clicking new input selects it and deselects old input", () => {
    const state = initialState()
    const expectedState = initialState()
    const { state: state1 } = update(state, {
        kind: EventKind.CLICKED_INPUT,
        inputPath: { nodeIndex: 1, inputIndex: 0 }
    })
    const { state: state2, render } = update(state1, {
        kind: EventKind.CLICKED_INPUT,
        inputPath: { nodeIndex: 1, inputIndex: 1 }
    })
    expectedState.graph.nodes[1].inputs[1].selected = true
    expectedState.selectedInput = { nodeIndex: 1, inputIndex: 1 }
    expectedState.draggedNode = 1
    expect(state2).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("clicking output after clicking input adds connection", () => {
    const state = initialState()
    const expectedState = initialState()
    const { state: state1 } = update(state, {
        kind: EventKind.CLICKED_INPUT,
        inputPath: { nodeIndex: 1, inputIndex: 1 }
    })
    const { state: state2, render } = update(state1, {
        kind: EventKind.CLICKED_OUTPUT,
        outputPath: { nodeIndex: 0, outputIndex: 0 }
    })
    expectedState.graph.edges.push({
        input: { nodeIndex: 1, inputIndex: 1 },
        output: { nodeIndex: 0, outputIndex: 0 }
    })
    expectedState.graph.nodes[1].inputs[1].edgeIndices.push(0)
    expectedState.graph.nodes[0].outputs[0].edgeIndices.push(0)
    expect(state2).toEqual(expectedState)
    expect(render).toEqual(true)
})

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
        outputPath: { nodeIndex: 0, outputIndex: 1 }
    })
    expectedState.graph.nodes[0].outputs[1].selected = true
    expectedState.selectedOutput = { nodeIndex: 0, outputIndex: 1 }
    expectedState.draggedNode = 0
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
        inputPath: { nodeIndex: 1, inputIndex: 1 }
    })
    expectedState.graph.edges.push({
        input: { nodeIndex: 1, inputIndex: 1 },
        output: { nodeIndex: 0, outputIndex: 0 }
    })
    expectedState.graph.nodes[1].inputs[1].edgeIndices.push(0)
    expectedState.graph.nodes[0].outputs[0].edgeIndices.push(0)
    expect(state2).toEqual(expectedState)
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
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("key down when finder is shown appends to search", () => {
    const state = initialState()
    state.finder.show = true
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
    expect(state3).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("backspace key down when finder is shown deletes from search", () => {
    const state = initialState()
    state.finder.show = true
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
    expect(state4).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("enter key down when finder is shown closes finder", () => {
    const state = initialState()
    state.finder.show = true
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Enter'
    })
    const expectedState = initialState()
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("escape key down when finder is shown closes finder", () => {
    const state = initialState()
    state.finder.show = true
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Escape'
    })
    const expectedState = initialState()
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("shift key down when finder is shown are ignored", () => {
    const state = initialState()
    state.finder.show = true
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Shift'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("alt key down when finder is shown are ignored", () => {
    const state = initialState()
    state.finder.show = true
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Alt'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("control key down when finder is shown are ignored", () => {
    const state = initialState()
    state.finder.show = true
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Control'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("meta key down when finder is shown are ignored", () => {
    const state = initialState()
    state.finder.show = true
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Meta'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("Tab key down when finder is shown are ignored", () => {
    const state = initialState()
    state.finder.show = true
    const { state: state1, render } = update(state, {
        kind: EventKind.KEYDOWN,
        key: 'Tab'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("virtual key down when finder is not shown does nothing", () => {
    const state = initialState()
    const { state: state1 } = update(state, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'f'
    })
    const expectedState = initialState()
    expect(state1).toEqual(expectedState)
})

test("virtual key down when finder is shown appends to search", () => {
    const state = initialState()
    state.finder.show = true
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
    expect(state3).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("del virtual key down when finder is shown deletes from search", () => {
    const state = initialState()
    state.finder.show = true
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
    expect(state4).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("space virtual key down when finder is shown adds space to search", () => {
    const state = initialState()
    state.finder.show = true
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
    expect(state3).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("ret virtual key down when finder is shown closes finder", () => {
    const state = initialState()
    state.finder.show = true
    const { state: state1, render } = update(state, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'ret'
    })
    const expectedState = initialState()
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})

test("sft virtual key down when finder is shown are ignored", () => {
    const state = initialState()
    state.finder.show = true
    const { state: state1, render } = update(state, {
        kind: EventKind.VIRTUAL_KEYDOWN,
        key: 'sft'
    })
    const expectedState = initialState()
    expectedState.finder.show = true
    expect(state1).toEqual(expectedState)
    expect(render).toEqual(true)
})
