import { WorldSpace } from "./geometry"
import { identity, inverse, Matrix3x3, multiplyMatrixVector } from "./linear_algebra/matrix3x3"
import { Cameras } from "./renderer/render"

export type CameraIndex = number

export class CameraStack {
    cameras: Cameras
    stack: number[]
    transform: Matrix3x3

    constructor() {
        const camera = identity()
        this.cameras = [identity()]
        this.stack = [0]
        this.transform = inverse(camera)
    }

    pushCamera = (camera: Matrix3x3) => {
        const index = this.cameras.length
        this.cameras.push(camera)
        this.stack.push(index)
        this.transform = inverse(camera)
    }

    popCamera = () => {
        this.stack.pop()
        this.transform = inverse(this.cameras[this.activeCamera()])
    }

    activeCamera = () => this.stack.slice(-1)[0]

    transformWorldSpace = (worldSpace: WorldSpace): WorldSpace => {
        const [x0, y0, _0] = multiplyMatrixVector(this.transform, [worldSpace.x0, worldSpace.y0, 1])
        const [x1, y1, _1] = multiplyMatrixVector(this.transform, [worldSpace.x1, worldSpace.y1, 1])
        return { x0, y0, x1, y1 }
    }
}
