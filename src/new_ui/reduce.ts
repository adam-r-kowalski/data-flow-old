import { UI, Geometry, Layout, Entry, traverse } from "./";

export interface Reducer<UIEvent, T> {
    initial: () => T
    combine: (accumulator: T, entry: Entry<UIEvent>) => T
}

export const reduce = <UIEvent, T>(ui: UI<UIEvent>, layout: Layout, geometry: Geometry, reducer: Reducer<UIEvent, T>): T => {
    const accumulator = reducer.initial()
    for (const entry of traverse(ui, layout, geometry, 0)) {
        reducer.combine(accumulator, entry)
    }
    return accumulator
}