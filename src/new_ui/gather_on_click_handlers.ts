import { Entry, WorldSpace } from "."

export interface ClickHandler<AppEvent> {
    onClick: AppEvent
    worldSpace: WorldSpace
}

export type ClickHandlers<AppEvent> = ClickHandler<AppEvent>[][]

export const initial = <AppEvent>(): ClickHandlers<AppEvent> => []

export const combine = <AppEvent>(handlers: ClickHandlers<AppEvent>, entry: Entry<AppEvent>): ClickHandlers<AppEvent> => {
    if (!entry.ui.onClick) return handlers
    const needed = entry.z - handlers.length + 1
    for (let i = 0; i < needed; ++i) handlers.push([])
    handlers[entry.z].push({
        onClick: entry.ui.onClick,
        worldSpace: entry.geometry.worldSpace
    })
    return handlers
}
