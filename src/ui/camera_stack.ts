import { WorldSpace } from "."
import { identity, inverse, Matrix3x3, multiplyMatrixVector } from "../linear_algebra/matrix3x3"

export interface CameraStack {
    cameras: Matrix3x3[]
    stack: number[]
    transform: Matrix3x3
}

export const initCameraStack = (): CameraStack => {
    const camera = identity()
    return {
        cameras: [identity()],
        stack: [0],
        transform: inverse(camera)
    }
}

export const pushCamera = (cameraStack: CameraStack, camera: Matrix3x3): void => {
    const index = cameraStack.cameras.length
    cameraStack.cameras.push(camera)
    cameraStack.stack.push(index)
    cameraStack.transform = inverse(camera)
}

export const activeCamera = (cameraStack: CameraStack): number => cameraStack.stack.slice(-1)[0]

export const popCamera = (cameraStack: CameraStack): void => {
    cameraStack.stack.pop()
    cameraStack.transform = inverse(cameraStack.cameras[activeCamera(cameraStack)])
}

export const transformWorldSpace = (cameraStack: CameraStack, worldSpace: WorldSpace): WorldSpace => {
    const [x0, y0, _0] = multiplyMatrixVector(cameraStack.transform, [worldSpace.x0, worldSpace.y0, 1])
    const [x1, y1, _1] = multiplyMatrixVector(cameraStack.transform, [worldSpace.x1, worldSpace.y1, 1])
    return { x0, y0, x1, y1 }
}
