import { WorldSpace } from "./geometry"
import { Mat3, Vec3 } from "./linear_algebra"
import { Cameras } from "./renderer/render"

export type CameraIndex = number

export class CameraStack {
    cameras: Cameras
    stack: number[]
    transform: Mat3

    constructor() {
        const camera = Mat3.identity()
        this.cameras = [Mat3.identity()]
        this.stack = [0]
        this.transform = camera.inverse()
    }

    pushCamera = (camera: Mat3) => {
        const index = this.cameras.length
        this.cameras.push(camera)
        this.stack.push(index)
        this.transform = camera.inverse()
    }

    popCamera = () => {
        this.stack.pop()
        this.transform = this.cameras[this.activeCamera()].inverse()
    }

    activeCamera = () => this.stack.slice(-1)[0]

    transformWorldSpace = (worldSpace: WorldSpace): WorldSpace => {
        const [x0, y0, _0] = this.transform.vecMul(new Vec3([worldSpace.x0, worldSpace.y0, 1])).data
        const [x1, y1, _1] = this.transform.vecMul(new Vec3([worldSpace.x1, worldSpace.y1, 1])).data
        return { x0, y0, x1, y1 }
    }
}
