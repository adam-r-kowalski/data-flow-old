import { Entity } from "./ecs";

type Layer = Entity[]

export class Layers {
    data: Layer[]

    constructor() {
        this.data = []
    }

    push = (z: number, entity: Entity): void => {
        for (let i = this.data.length; i < z + 1; ++i) {
            this.data.push([])
        }
        this.data[z].push(entity)
    }
}