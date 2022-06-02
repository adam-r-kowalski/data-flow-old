import { Entity } from "./ecs";
import { Mat3 } from "./linear_algebra";

interface Data {
    z: number
    texture: number
    entity: Entity
}

export class Layers {
    layers: Map<number, Entity[]>[]
    lines: Entity[]
    cameras: Mat3[]
    activeCamera: number

    constructor() {
        this.layers = []
        this.lines = []
        this.cameras = [Mat3.identity()]
        this.activeCamera = 0
    }

    pushAndSetActiveCamera = (camera: Mat3) => {
        this.activeCamera = this.cameras.length
        this.cameras.push(camera)
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