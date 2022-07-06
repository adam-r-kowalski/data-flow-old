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
})

test("pointer down", () => {
    const state = initialState()
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1, render } = update(state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const expectedState = initialState()
    expectedState.dragging = true
    expectedState.pointers = [pointer]
    expectedState.potentialDoubleClick = true
    expect(state1).toEqual(expectedState)
    expect(render).toBeUndefined()
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
    const { state: state2, render } = update(state1, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    const expectedState = initialState()
    expectedState.potentialDoubleClick = true
    expect(state2).toEqual(expectedState)
    expect(render).toBeUndefined()
})

test("click node", () => {
    const state = initialState()
    const { state: state1, render } = update(state, {
        kind: EventKind.CLICKED_NODE,
        index: 0
    })
    const expectedState = initialState()
    expectedState.draggedNode = 0
    expectedState.graph.nodes = [
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
    ]
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
    const { state: state1, render } = update(state, {
        kind: EventKind.POINTER_MOVE,
        pointer
    })
    expect(state1).toEqual(initialState())
    expect(render).toBeUndefined()
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
    expect(state2.camera).toEqual(translate(-50, -75))
    expect(state2.graph.nodes).toEqual(initialState().graph.nodes)
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
    const { state: state4, render } = update(state3, {
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
    expect(render).toBeUndefined()
})
