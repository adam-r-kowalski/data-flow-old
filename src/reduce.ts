import { Geometry } from "./geometry";
import { Layout } from "./layout";
import { Entry, UI } from "./ui";

export interface Reducer<T> {
    initial: () => T
    combine: (accumulator: T, entry: Entry) => T
}

export const reduce = <T>(ui: UI, layout: Layout, geometry: Geometry, reducer: Reducer<T>): T => {
    const accumulator = reducer.initial()
    for (const entry of ui.traverse(layout, geometry, 0)) {
        reducer.combine(accumulator, entry)
    }
    return accumulator
}

export const composeReducers = <T, U>(a: Reducer<T>, b: Reducer<U>): Reducer<[T, U]> => ({
    initial: () => [a.initial(), b.initial()],
    combine: ([a_acc, b_acc]: [T, U], entry: Entry): [T, U] =>
        [a.combine(a_acc, entry), b.combine(b_acc, entry)]
})