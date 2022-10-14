import { WorldSpace } from "."
import { Position } from "../model/graph"
import { Renderer } from "./renderer"

const inWorldSpace = ({ x0, y0, x1, y1 }: WorldSpace, position: Position) =>
    x0 <= position.x && position.x <= x1 && y0 <= position.y && position.y <= y1

export const onDoubleClick = <AppEvent>(
    renderer: Renderer<AppEvent>,
    position: Position
): void => {
    for (let i = renderer.doubleClickHandlers.length; i > 0; --i) {
        for (const { onDoubleClick, worldSpace } of renderer
            .doubleClickHandlers[i - 1]) {
            if (inWorldSpace(worldSpace, position)) {
                onDoubleClick(position)
                return
            }
        }
    }
}
