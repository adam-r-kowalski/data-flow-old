import { WorldSpace } from "./geometry"
import { Mat3, Vec3 } from "./linear_algebra"
import { Cameras } from "./renderer/render"

export type CameraIndex = number

export class CameraStack {
    cameras: Cameras
    stack: number[]

    constructor() {
        this.cameras = [Mat3.identity()]
        this.stack = [0]
    }

    pushCamera = (camera: Mat3) => {
        const index = this.cameras.length
        this.cameras.push(camera)
        this.stack.push(index)
    }

    popCamera = () => this.stack.pop()

    activeCamera = () => this.stack.slice(-1)[0]

    transformWorldSpace = (worldSpace: WorldSpace): WorldSpace => {
        const camera = this.cameras[this.activeCamera()].inverse()
        const [x0, y0, _0] = camera.vecMul(new Vec3([worldSpace.x0, worldSpace.y0, 1])).data
        const [x1, y1, _1] = camera.vecMul(new Vec3([worldSpace.x1, worldSpace.y1, 1])).data
        return { x0, y0, x1, y1 }
    }
}
