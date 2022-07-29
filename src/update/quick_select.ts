import { Model } from "../model";
import { UUID } from "../model/graph";
import { QuickSelect, QuickSelectKind } from "../model/quick_select";

export const maybeTriggerQuickSelect = (model: Model, key: string): QuickSelect => {
    switch (key) {
        case 'i':
            const hotkeys: { [input: UUID]: string } = {}
            Object.keys(model.graph.inputs).forEach((input, i) => {
                hotkeys[input] = String.fromCharCode(97 + i)
            })
            return {
                kind: QuickSelectKind.INPUT,
                hotkeys
            }
        default:
            return { kind: QuickSelectKind.NONE }
    }
}