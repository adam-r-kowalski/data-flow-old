import { Renderer } from "."
import { WorldSpace } from "../geometry"
import { MouseClick, RendererEvent, RendererEventKind } from "./events"
import { onRender } from "./render"

const inWorldSpace = ({ x0, y0, x1, y1 }: WorldSpace, click: MouseClick) =>
    x0 <= click.x && click.x <= x1 &&
    y0 <= click.y && click.y <= y1


const onMouseClick = <R extends Renderer>(renderer: R, click: MouseClick): R => {
    for (let i = renderer.clickHandlers.length; i > 0; --i) {
        for (const { onClick, worldSpace } of renderer.clickHandlers[i - 1]) {
            if (inWorldSpace(worldSpace, click)) {
                onClick(click)
            }
        }
    }
    return renderer
}

export const dispatchRendererEvent = <R extends Renderer>(renderer: R, event: RendererEvent): R => {
    switch (event.kind) {
        case RendererEventKind.RENDER: return onRender(renderer, event)
        case RendererEventKind.MOUSE_CLICK: return onMouseClick(renderer, event)
    }
}