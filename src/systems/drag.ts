import { Translate } from "../components"
import { Entity } from "../ecs"

export const drag = (entity: Entity, x: number, y: number) =>
    entity.update(Translate, translate => {
        translate.x += x
        translate.y += y
    })