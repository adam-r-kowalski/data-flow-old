import { WorldSpace } from "."
import { Position } from "../model/graph"
import { Renderer } from "./renderer"

const inWorldSpace = ({ x0, y0, x1, y1 }: WorldSpace, position: Position) =>
    x0 <= position.x && position.x <= x1 && y0 <= position.y && position.y <= y1

export const onClick = <AppEvent>(
    renderer: Renderer<AppEvent>,
    position: Position
): void => {
    for (let i = renderer.clickHandlers.length; i > 0; --i) {
        for (const { onClick, worldSpace } of renderer.clickHandlers[i - 1]) {
            if (inWorldSpace(worldSpace, position)) {
                onClick(position)
                return
            }
        }
    }
}
