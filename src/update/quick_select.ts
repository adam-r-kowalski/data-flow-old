import { AppEvent } from ".";
import { Model } from "../model";
import { UUID } from "../model/graph";
import { QuickSelectKind } from "../model/quick_select";
import { UpdateResult } from "../ui/run";

export const quickSelect = (model: Model, key: string): UpdateResult<Model, AppEvent> => {
    switch (key) {
        case 'i':
            const hotkeys: { [input: UUID]: string } = {}
            Object.keys(model.graph.inputs).forEach((input, i) => {
                hotkeys[input] = String.fromCharCode(97 + i)
            })
            return {
                model: {
                    ...model,
                    quickSelect: {
                        kind: QuickSelectKind.INPUT,
                        hotkeys
                    }
                },
                render: true
            }
        default:
            return { model }
    }
}