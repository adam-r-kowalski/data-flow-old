import { Entry, WorldSpace, AppEvent } from "."

export interface ClickHandler {
    onClick: AppEvent
    worldSpace: WorldSpace
}

export type ClickHandlers = ClickHandler[][]

export const initial = (): ClickHandlers => []

export const combine = (
    handlers: ClickHandlers,
    entry: Entry
): ClickHandlers => {
    if (entry.ui.onClick === undefined) return handlers
    const needed = entry.z - handlers.length + 1
    for (let i = 0; i < needed; ++i) handlers.push([])
    handlers[entry.z].push({
        onClick: entry.ui.onClick,
        worldSpace: entry.geometry.worldSpace,
    })
    return handlers
}
