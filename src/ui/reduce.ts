import { UI, Geometry, Layout, Entry, traverse } from ".";

export interface Reducer<AppEvent, T> {
    initial: () => T
    combine: (accumulator: T, entry: Entry<AppEvent>) => T
}

export const reduce = <AppEvent, T>(ui: UI<AppEvent>, layout: Layout, geometry: Geometry, reducer: Reducer<AppEvent, T>): T => {
    const accumulator = reducer.initial()
    for (const entry of traverse(ui, layout, geometry, 0)) {
        reducer.combine(accumulator, entry)
    }
    return accumulator
}