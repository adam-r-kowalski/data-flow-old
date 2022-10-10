import { Table } from "../src/model/table"
import { Effects, showCursor } from "../src/effects"
import { Document } from "../src/ui/dom"
import { AppEvent } from "../src/event"
import { Dispatch } from "../src/run"
import { mockDocument } from "../src/ui/mock"

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
        setTimeout: (callback: () => void, ms: number) => {
            callback()
        },
    }
}

interface Tracked {
    events: AppEvent[]
    times: number[]
    effects: Effects
    dispatch: Dispatch<AppEvent>
}

export const makeTracked = (): Tracked => {
    const events: AppEvent[] = []
    const times: number[] = []
    const dispatch = (event: AppEvent) => events.push(event)
    const effects = makeEffects(mockDocument())
    effects.setTimeout = (cb, ms) => {
        times.push(ms)
        cb()
    }
    return { events, times, effects, dispatch }
}

export const resetTracked = ({ effects }: Tracked): Tracked => {
    const events: AppEvent[] = []
    const times: number[] = []
    const dispatch = (event: AppEvent) => events.push(event)
    effects.setTimeout = (cb, ms) => {
        times.push(ms)
        cb()
    }
    return {
        events,
        times,
        effects,
        dispatch,
    }
}
