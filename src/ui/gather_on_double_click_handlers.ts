import { Entry, WorldSpace, OnDoubleClick } from "."

export interface DoubleClickHandler {
    onDoubleClick: OnDoubleClick
    worldSpace: WorldSpace
}

export type DoubleClickHandlers = DoubleClickHandler[][]

export const initial = (): DoubleClickHandlers => []

export const combine = (
    handlers: DoubleClickHandlers,
    entry: Entry
): DoubleClickHandlers => {
    if (entry.ui.onDoubleClick === undefined) return handlers
    const needed = entry.z - handlers.length + 1
    for (let i = 0; i < needed; ++i) handlers.push([])
    handlers[entry.z].push({
        onDoubleClick: entry.ui.onDoubleClick,
        worldSpace: entry.geometry.worldSpace,
    })
    return handlers
}
