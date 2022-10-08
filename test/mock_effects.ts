import { Table } from "../src/model/table"
import { Effects } from "../src/effects"

export interface EffectModel {
    uuid: number
    time: number
}

export const defaultEffectModel = (): EffectModel => ({
    uuid: 0,
    time: 0,
})

export const makeEffects = (maybeModel?: EffectModel): Effects => {
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
    }
}
