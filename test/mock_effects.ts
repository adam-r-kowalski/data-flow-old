import { Table } from "../src/model/table"
import { Effects, showCursor } from "../src/effects"
import { Document } from "../src/ui/dom"

export interface EffectModel {
    uuid: number
    time: number
}

export const defaultEffectModel = (): EffectModel => ({
    uuid: 0,
    time: 0,
})

export const makeEffects = (
    document: Document,
    maybeModel?: EffectModel
): Effects => {
    const model: EffectModel =
        maybeModel === undefined ? defaultEffectModel() : maybeModel
    return {
        generateUUID: () => {
            const uuid = model.uuid.toString()
            ++model.uuid
            return uuid
        },
        currentTime: () => {
            const time = model.time
            ++model.time
            return time
        },
        promptUserForTable: async (): Promise<Table> => ({
            name: "table.csv",
            columns: {
                a: [1, 2, 3],
                b: [4, 5, 6],
            },
        }),
        showCursor: (show: boolean) => showCursor(document, show),
    }
}
