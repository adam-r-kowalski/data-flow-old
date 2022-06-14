import { Entity } from "./ecs";
import { Mat3 } from "./linear_algebra";

interface Data {
    z: number
    texture: number
    entity: Entity
}

export class Layers {
    cameras: Mat3[]
    cameraStack: number[]
    cameraForEntity: Map<Entity, number>
    layers: Map<number, Entity[]>[]
    lines: Entity[]

    constructor() {
        this.cameras = [Mat3.identity()]
        this.cameraStack = [0]
        this.cameraForEntity = new Map()
        this.layers = []
        this.lines = []
    }

    activeCamera = () => this.cameraStack.slice(-1)[0]

    pushCamera = (camera: Mat3) => {
        const index = this.cameras.length
        this.cameras.push(camera)
        this.cameraStack.push(index)
        return index
    }

    popCamera = () => this.cameraStack.pop()

    push = ({ z, texture, entity }: Data): void => {
        this.cameraForEntity.set(entity, this.activeCamera())
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