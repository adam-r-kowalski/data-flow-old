import { Entity } from "./ecs";

interface Data {
    z: number
    texture: number
    entity: Entity
}

export class Layers {
    layers: Map<number, Entity[]>[]

    constructor() {
        this.layers = []
    }

    push = ({ z, texture, entity }: Data): void => {
        for (let i = this.layers.length; i < z + 1; ++i) {
            this.layers.push(new Map())
        }
        const layer = this.layers[z]
        const entities = layer.get(texture)
        if (entities) {
            entities.push(entity)
            return
        }
        layer.set(texture, [entity])
    }
}