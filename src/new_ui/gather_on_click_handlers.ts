import { Entry, WorldSpace } from "."

export interface ClickHandler<UIEvent> {
    onClick: UIEvent
    worldSpace: WorldSpace
}

export type ClickHandlers<UIEvent> = ClickHandler<UIEvent>[][]

export const initial = <UIEvent>(): ClickHandlers<UIEvent> => []

export const combine = <UIEvent>(handlers: ClickHandlers<UIEvent>, entry: Entry<UIEvent>): ClickHandlers<UIEvent> => {
    if (!entry.ui.onClick) return handlers
    const needed = entry.z - handlers.length + 1
    for (let i = 0; i < needed; ++i) handlers.push([])
    handlers[entry.z].push({
        onClick: entry.ui.onClick,
        worldSpace: entry.geometry.worldSpace
    })
    return handlers
}
