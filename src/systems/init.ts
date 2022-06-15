import { ConnectionFrom, ConnectionTo, DraggedEntity, Dragging, PointerDistance, Pointers } from "../components";
import { Entity } from "../ecs";
import { pointerDown } from "./pointerDown";
import { pointerMove } from "./pointerMove";
import { pointerUp } from "./pointerUp";
import { resize } from "./resize";
import { touchEnd } from "./touchEnd";
import { wheel } from "./wheel";

export const init = (graph: Entity) => {
    const ecs = graph.ecs
    ecs.set(
        new Pointers([]),
        new PointerDistance(0),
        new Dragging(false),
        new DraggedEntity(null),
        new ConnectionFrom(null),
        new ConnectionTo(null),
    )
    pointerDown(graph)
    pointerMove(graph)
    pointerUp(ecs)
    resize(ecs)
    touchEnd(ecs)
    wheel(graph)
}