import { ConnectionFrom, ConnectionTo, DraggedEntity, Dragging, PointerDistance, Pointers } from "../components";
import { ECS } from "../ecs";
import { pointerDown } from "./pointerDown";
import { pointerMove } from "./pointerMove";
import { pointerUp } from "./pointerUp";
import { resize } from "./resize";
import { touchEnd } from "./touchEnd";
import { wheel } from "./wheel";

export const init = (ecs: ECS) => {
    ecs.set(
        new Pointers([]),
        new PointerDistance(0),
        new Dragging(false),
        new DraggedEntity(null),
        new ConnectionFrom(null),
        new ConnectionTo(null),
    )
    pointerDown(ecs)
    pointerMove(ecs)
    pointerUp(ecs)
    resize(ecs)
    touchEnd(ecs)
    wheel(ecs)
}