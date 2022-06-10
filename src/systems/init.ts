import { Dragging, Pointers } from "../components";
import { ECS } from "../ecs";

export const init = (ecs: ECS) =>
    ecs.set(
        new Pointers([]),
        new Dragging(false)
    )