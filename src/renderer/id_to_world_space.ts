import { WorldSpace } from "../geometry"
import { Reducer } from "../reduce"
import { Entry } from "../ui"

export type IdToWorldSpace = { [id: string]: WorldSpace }

export const buildIdToWorldSpace: Reducer<IdToWorldSpace> = {
    initial: () => ({}),
    combine: (lookup: IdToWorldSpace, entry: Entry) => {
        if (!entry.ui.id) return lookup
        lookup[entry.ui.id] = entry.geometry.worldSpace
        return lookup
    }
}
