import { WorldSpace } from "../components"
import { ECS, Entity } from "../ecs"
import { Layers } from "../layers"
import { Mat3, Vec3 } from "../linear_algebra"

export function* rayCast(ecs: ECS, camera: Mat3, vec: Vec3): Generator<Entity> {
    const [mx, my, _] = camera.vecMul(vec).data
    for (const layer of ecs.get(Layers)!.layers.reverse()) {
        for (const entities of layer.values()) {
            for (const entity of entities) {
                const { x, y, width, height } = entity.get(WorldSpace)!
                if (mx > x && mx < x + width && my > y && my < y + height) {
                    yield entity
                }
            }
        }
    }
}
