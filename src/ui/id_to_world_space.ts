import { Entry, WorldSpace } from "."

export type IdToWorldSpace = { [id: string]: WorldSpace }

export const initial = (): IdToWorldSpace => ({})

export const combine = <AppEvent>(lookup: IdToWorldSpace, entry: Entry<AppEvent>): IdToWorldSpace => {
    if (!entry.ui.id) return lookup
    lookup[entry.ui.id] = entry.geometry.worldSpace
    return lookup
}