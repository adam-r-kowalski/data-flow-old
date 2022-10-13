import { Entry, WorldSpace, OnDrag } from "."

export interface DragHandler {
    onDrag: OnDrag
    worldSpace: WorldSpace
}

export type DragHandlers = DragHandler[][]

export const initial = (): DragHandlers => []

export const combine = (handlers: DragHandlers, entry: Entry): DragHandlers => {
    if (entry.ui.onDrag === undefined) return handlers
    const needed = entry.z - handlers.length + 1
    for (let i = 0; i < needed; ++i) handlers.push([])
    handlers[entry.z].push({
        onDrag: entry.ui.onDrag,
        worldSpace: entry.geometry.worldSpace,
    })
    return handlers
}
