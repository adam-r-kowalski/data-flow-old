import { Entry, WorldSpace } from "."

export type IdToWorldSpace = { [id: string]: WorldSpace }

export const initial = (): IdToWorldSpace => ({})

export const combine = <UIEvent>(lookup: IdToWorldSpace, entry: Entry<UIEvent>): IdToWorldSpace => {
    if (!entry.ui.id) return lookup
    lookup[entry.ui.id] = entry.geometry.worldSpace
    return lookup
}