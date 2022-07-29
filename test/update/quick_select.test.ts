import { Model } from "../../src/model"
import { emptyModel } from "../../src/model/empty"
import { Operations } from "../../src/model/graph"
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
        quickSelect: {
            kind: QuickSelectKind.INPUT,
            hotkeys: {
                [inputs[0]]: 'a',
                [inputs[1]]: 'b'
            }
        }
    }
    expect(model2).toEqual(expectedModel)
})
