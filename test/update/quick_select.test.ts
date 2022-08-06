import { Model } from "../../src/model"
import { emptyModel } from "../../src/model/empty"
import { FocusKind } from "../../src/model/focus"
import { Operations } from "../../src/model/graph"
import { PointerActionKind } from "../../src/model/pointer_action"
import { QuickSelectKind } from "../../src/model/quick_select"
import { addNodeToGraph, EventKind, update } from "../../src/update"
import { makeEffects } from "../mock_effects"

test("pressing i with nothing focused launches quick select for inputs", () => {
    const effects = makeEffects()
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
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const inputs = model1.graph.nodes[node].inputs
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: 'i',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.NONE },
            quickSelect: {
                kind: QuickSelectKind.INPUT,
                hotkeys: {
                    [inputs[0]]: 'a',
                    [inputs[1]]: 'b'
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing i with output focused launches quick select for inputs", () => {
    const effects = makeEffects()
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
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const output = model1.graph.nodes[node].outputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const inputs = model2.graph.nodes[node].inputs
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'i',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.OUTPUT,
            output,
            quickSelect: {
                kind: QuickSelectKind.INPUT,
                hotkeys: {
                    [inputs[0]]: 'a',
                    [inputs[1]]: 'b'
                }
            }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing i with input focused launches quick select for inputs", () => {
    const effects = makeEffects()
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
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const inputs = model1.graph.nodes[node].inputs
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_INPUT,
        input: inputs[0]
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'i',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.INPUT,
            input: inputs[0],
            quickSelect: {
                kind: QuickSelectKind.INPUT,
                hotkeys: {
                    [inputs[0]]: 'a',
                    [inputs[1]]: 'b'
                }
            }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing i with body focused launches quick select for inputs", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        },
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
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model2.graph.nodes[node0].body!
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_BODY,
        body
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.KEYDOWN,
        key: 'i',
        ctrl: false
    })
    const inputs = model4.graph.nodes[node1].inputs
    const expectedModel: Model = {
        ...model2,
        focus: {
            kind: FocusKind.BODY,
            body,
            quickSelect: {
                kind: QuickSelectKind.INPUT,
                hotkeys: {
                    [inputs[0]]: 'a',
                    [inputs[1]]: 'b'
                }
            }
        }
    }
    expect(model4).toEqual(expectedModel)
})

test("pressing i with node focused launches quick select for inputs", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Number': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    const model0: Model = {
        ...emptyModel(),
        operations
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'i',
        ctrl: false
    })
    const inputs = model3.graph.nodes[node].inputs
    const expectedModel: Model = {
        ...model2,
        focus: {
            kind: FocusKind.NODE,
            node,
            drag: true,
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: {
                kind: QuickSelectKind.INPUT,
                hotkeys: {
                    [inputs[0]]: 'a',
                    [inputs[1]]: 'b'
                }
            }
        }
    }
    expect(model3).toEqual(expectedModel)
})


test("pressing hotkey with input quick select will select the input and disable quick select", () => {
    const effects = makeEffects()
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
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const inputs = model1.graph.nodes[node].inputs
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: 'i',
        ctrl: false
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'a',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.INPUT,
            input: inputs[0],
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model3).toEqual(expectedModel)
})


test("pressing o with nothing focused launches quick select for outputs", () => {
    const effects = makeEffects()
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
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const output = model1.graph.nodes[node].outputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: 'o',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.NONE },
            quickSelect: {
                kind: QuickSelectKind.OUTPUT,
                hotkeys: {
                    [output]: 'a',
                }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})

test("pressing o with output focused launches quick select for outputs", () => {
    const effects = makeEffects()
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
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const output = model1.graph.nodes[node].outputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_OUTPUT,
        output
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'o',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.OUTPUT,
            output,
            quickSelect: {
                kind: QuickSelectKind.OUTPUT,
                hotkeys: {
                    [output]: 'a',
                }
            }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing o with input focused launches quick select for outputs", () => {
    const effects = makeEffects()
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
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const inputs = model1.graph.nodes[node].inputs
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_INPUT,
        input: inputs[0]
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'o',
        ctrl: false
    })
    const output = model3.graph.nodes[node].outputs[0]
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.INPUT,
            input: inputs[0],
            quickSelect: {
                kind: QuickSelectKind.OUTPUT,
                hotkeys: {
                    [output]: 'a',
                }
            }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing o with body focused launches quick select for outputs", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Number': {
            name: 'Number',
            inputs: [],
            body: 0,
            outputs: ['out']
        },
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
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2, node: node1 } = addNodeToGraph({
        model: model1,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const body = model2.graph.nodes[node0].body!
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.CLICKED_BODY,
        body
    })
    const { model: model4 } = update(effects, model3, {
        kind: EventKind.KEYDOWN,
        key: 'o',
        ctrl: false
    })
    const output0 = model4.graph.nodes[node0].outputs[0]
    const output1 = model4.graph.nodes[node1].outputs[0]
    const expectedModel: Model = {
        ...model2,
        focus: {
            kind: FocusKind.BODY,
            body,
            quickSelect: {
                kind: QuickSelectKind.OUTPUT,
                hotkeys: {
                    [output0]: 'a',
                    [output1]: 'b',
                }
            }
        }
    }
    expect(model4).toEqual(expectedModel)
})

test("pressing o with node focused launches quick select for outputs", () => {
    const effects = makeEffects()
    const operations: Operations = {
        'Number': {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out']
        },
    }
    const model0: Model = {
        ...emptyModel(),
        operations
    }
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Number'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.CLICKED_NODE,
        node
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'o',
        ctrl: false
    })
    const output = model3.graph.nodes[node].outputs[0]
    const expectedModel: Model = {
        ...model2,
        focus: {
            kind: FocusKind.NODE,
            node,
            drag: true,
            move: { left: false, up: false, down: false, right: false, now: 0 },
            quickSelect: {
                kind: QuickSelectKind.OUTPUT,
                hotkeys: {
                    [output]: 'a',
                }
            }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing hotkey with output quick select will select the output and disable quick select", () => {
    const effects = makeEffects()
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
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const output = model1.graph.nodes[node].outputs[0]
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: 'o',
        ctrl: false
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'a',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.OUTPUT,
            output,
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing invalid hotkey with output quick select will disable quick select", () => {
    const effects = makeEffects()
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
    const { model: model1 } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: 'o',
        ctrl: false
    })
    const { model: model3 } = update(effects, model2, {
        kind: EventKind.KEYDOWN,
        key: 'z',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.NONE },
            quickSelect: { kind: QuickSelectKind.NONE }
        }
    }
    expect(model3).toEqual(expectedModel)
})

test("pressing n with nothing focused launches quick select for nodes", () => {
    const effects = makeEffects()
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
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: effects.generateUUID
    })
    const { model: model2 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: 'n',
        ctrl: false
    })
    const expectedModel: Model = {
        ...model1,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.NONE },
            quickSelect: {
                kind: QuickSelectKind.NODE,
                hotkeys: { [node]: 'a' }
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})
