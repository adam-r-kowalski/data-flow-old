import { Effects } from "../src/ui/run"

export interface EffectModel {
    uuid: number
    time: number
}

export const defaultEffectModel = (): EffectModel => ({
    uuid: 0,
    time: 0
})

export const makeEffects = (maybeModel?: EffectModel): Effects => {
    const model: EffectModel = maybeModel === undefined ? defaultEffectModel() : maybeModel
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
        promptUserForFile: async (accept: string): Promise<File> => new File(["content"], "foo.csv")
    }
}