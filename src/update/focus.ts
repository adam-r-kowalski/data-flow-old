import { GenerateUUID } from "../effects"
import { Model } from "../model"
import { FocusKind } from "../model/focus"
import { UUID } from "../model/graph"
import { PointerActionKind } from "../model/pointer_action"
import { QuickSelectKind } from "../model/quick_select"
import { addEdge, removeInputEdge } from "./graph"

export const clearFocus = (model: Model): Model => ({
    ...model,
    focus: {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE },
    },
})

export const selectInput = (
    model: Model,
    inputUUID: UUID,
    generateUUID: GenerateUUID
): Model => {
    if (model.focus.kind === FocusKind.OUTPUT) {
        const input = model.graph.inputs[inputUUID]
        const output = model.graph.outputs[model.focus.output]
        if (input.node === output.node) {
            return model
        } else {
            const graph0 =
                input.edge !== undefined
                    ? removeInputEdge(model.graph, input.uuid)
                    : model.graph
            const { graph: graph1 } = addEdge({
                graph: graph0,
                input: inputUUID,
                output: model.focus.output,
                generateUUID,
            })
            return clearFocus({ ...model, graph: graph1 })
        }
    } else {
        return {
            ...model,
            focus: {
                kind: FocusKind.INPUT,
                input: inputUUID,
                quickSelect: { kind: QuickSelectKind.NONE },
            },
        }
    }
}

export const selectOutput = (
    model: Model,
    outputUUID: UUID,
    generateUUID: GenerateUUID
): Model => {
    if (model.focus.kind === FocusKind.INPUT) {
        const input = model.graph.inputs[model.focus.input]
        const output = model.graph.outputs[outputUUID]
        if (output.node === input.node) {
            return model
        } else {
            const graph0 =
                input.edge !== undefined
                    ? removeInputEdge(model.graph, input.uuid)
                    : model.graph
            const { graph: graph1 } = addEdge({
                graph: graph0,
                input: model.focus.input,
                output: outputUUID,
                generateUUID,
            })
            return clearFocus({ ...model, graph: graph1 })
        }
    } else {
        return {
            ...model,
            focus: {
                kind: FocusKind.OUTPUT,
                output: outputUUID,
                quickSelect: { kind: QuickSelectKind.NONE },
            },
        }
    }
}
