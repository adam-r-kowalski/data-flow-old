import { rgba } from "../src/color"
import { EventKind, update } from "../src/event"
import { Mat3 } from "../src/linear_algebra"
import { State } from "../src/state"

const initialState = (): State => ({
    nodes: [
        {
            name: "Source",
            inputs: [],
            outputs: ["Out 1", "Out 2"],
            x: 100,
            y: 200
        },
        {
            name: "Transform",
            inputs: ["In 1", "In 2"],
            outputs: ["Out 1", "Out 2"],
            x: 400,
            y: 300
        },
        {
            name: "Sink",
            inputs: ["In 1", "In 2"],
            outputs: [],
            x: 800,
            y: 250
        },
    ],
    dragging: false,
    draggedNode: null,
    pointers: [],
    camera: Mat3.identity(),
    theme: {
        background: rgba(1, 22, 39, 255),
        node: rgba(41, 95, 120, 255),
        input: rgba(188, 240, 192, 255)
    },
})

test("pointer down", () => {
    const state = initialState()
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1, rerender } = update(state, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    expect(state1.dragging).toEqual(true)
    expect(state1.pointers).toEqual([pointer])
    expect(rerender).toEqual(false)
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
    const { state: state2, rerender } = update(state1, {
        kind: EventKind.POINTER_UP,
        pointer
    })
    expect(state2.dragging).toEqual(false)
    expect(state2.pointers).toEqual([])
    expect(rerender).toEqual(false)
})

test("click node", () => {
    const state = initialState()
    const { state: state1, rerender } = update(state, {
        kind: EventKind.CLICKED_NODE,
        index: 0
    })
    expect(state1.draggedNode).toEqual(2)
    expect(state1.nodes).toEqual([
        {
            name: "Sink",
            inputs: ["In 1", "In 2"],
            outputs: [],
            x: 800,
            y: 250
        },
        {
            name: "Transform",
            inputs: ["In 1", "In 2"],
            outputs: ["Out 1", "Out 2"],
            x: 400,
            y: 300
        },
        {
            name: "Source",
            inputs: [],
            outputs: ["Out 1", "Out 2"],
            x: 100,
            y: 200
        },
    ])
    expect(rerender).toEqual(true)
})

test("pointer move before pointer down does nothing", () => {
    const state = initialState()
    const pointer = {
        x: 0,
        y: 0,
        id: 0,
    }
    const { state: state1, rerender } = update(state, {
        kind: EventKind.POINTER_MOVE,
        pointer
    })
    expect(state1.camera.data).toEqual(initialState().camera.data)
    expect(state1.nodes).toEqual(initialState().nodes)
    expect(rerender).toEqual(false)
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
    const { state: state2, rerender } = update(state1, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            x: 50,
            y: 75,
            id: 0,
        }
    })
    expect(state2.camera.data).toEqual(Mat3.translate(-50, -75).data)
    expect(state2.nodes).toEqual(initialState().nodes)
    expect(rerender).toEqual(true)
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
    const { state: state3, rerender } = update(state2, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            x: 50,
            y: 75,
            id: 0,
        }
    })
    expect(state3.camera.data).toEqual(initialState().camera.data)
    expect(state3.nodes).toEqual([
        {
            name: "Sink",
            inputs: ["In 1", "In 2"],
            outputs: [],
            x: 800,
            y: 250
        },
        {
            name: "Transform",
            inputs: ["In 1", "In 2"],
            outputs: ["Out 1", "Out 2"],
            x: 400,
            y: 300
        },
        {
            name: "Source",
            inputs: [],
            outputs: ["Out 1", "Out 2"],
            x: 150,
            y: 275
        },
    ])
    expect(rerender).toEqual(true)
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
    const { state: state4, rerender } = update(state3, {
        kind: EventKind.POINTER_MOVE,
        pointer: {
            x: 50,
            y: 75,
            id: 0,
        }
    })
    expect(state4.camera.data).toEqual(initialState().camera.data)
    expect(state4.nodes).toEqual([
        {
            name: "Sink",
            inputs: ["In 1", "In 2"],
            outputs: [],
            x: 800,
            y: 250
        },
        {
            name: "Transform",
            inputs: ["In 1", "In 2"],
            outputs: ["Out 1", "Out 2"],
            x: 400,
            y: 300
        },
        {
            name: "Source",
            inputs: [],
            outputs: ["Out 1", "Out 2"],
            x: 100,
            y: 200
        },
    ])
    expect(rerender).toEqual(false)
})
