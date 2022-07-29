import { AppEvent } from "."
import { Model } from "../model"
import { FocusKind } from "../model/focus"
import { GenerateUUID, UUID } from "../model/graph"
import { PointerActionKind } from "../model/pointer_action"
import { QuickSelectKind } from "../model/quick_select"
import { UpdateResult } from "../ui/run"
import { addEdge, removeInputEdge } from "./graph"

export const clearFocus = (model: Model): Model => ({
    ...model,
    focus: {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    }
})


export const selectInput = (model: Model, inputUUID: UUID, generateUUID: GenerateUUID): UpdateResult<Model, AppEvent> => {
    if (model.focus.kind === FocusKind.OUTPUT) {
        const input = model.graph.inputs[inputUUID]
        const output = model.graph.outputs[model.focus.output]
        if (input.node === output.node) {
            return { model }
        } else {
            const graph0 = input.edge !== undefined ?
                removeInputEdge(model.graph, input.uuid) :
                model.graph
            const { graph: graph1 } = addEdge({
                graph: graph0,
                input: inputUUID,
                output: model.focus.output,
                generateUUID
            })
            return {
                model: clearFocus({ ...model, graph: graph1 }),
                render: true
            }
        }
    } else {
        return {
            model: {
                ...model,
                focus: {
                    kind: FocusKind.INPUT,
                    input: inputUUID,
                    quickSelect: { kind: QuickSelectKind.NONE }
                }
            },
            render: true
        }
    }
}
