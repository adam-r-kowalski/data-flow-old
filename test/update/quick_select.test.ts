import { Model } from "../../src/model"
import { emptyModel } from "../../src/model/empty"
import { FocusKind } from "../../src/model/focus"
import { Operations } from "../../src/model/graph"
import { PointerActionKind } from "../../src/model/pointer_action"
import { QuickSelectKind } from "../../src/model/quick_select"
import { addNodeToGraph, EventKind, update } from "../../src/update"

const makeGenerateUUID = (model: { i: number } = { i: 0 }) => {
    return () => {
        const uuid = model.i.toString()
        ++model.i
        return uuid
    }
}

test("pressing i with nothing focused launches quick select for inputs", () => {
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
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const inputs = model1.graph.nodes[node].inputs
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.KEYDOWN,
        key: 'i'
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

test("pressing hotkey with input quick select will select the input and disable quick select", () => {
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
    const { model: model1, node } = addNodeToGraph({
        model: model0,
        operation: operations['Add'],
        position: { x: 0, y: 0 },
        generateUUID: generateUUID
    })
    const inputs = model1.graph.nodes[node].inputs
    const { model: model2 } = update(generateUUID, model1, {
        kind: EventKind.KEYDOWN,
        key: 'i'
    })
    const { model: model3 } = update(generateUUID, model2, {
        kind: EventKind.KEYDOWN,
        key: 'a'
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
