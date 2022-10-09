import { CurrentTime } from "../effects"
import { KeyDown, KeyUp } from "../event"
import { multiplyMatrices, scale, translate } from "../linear_algebra/matrix3x3"
import { Model, NodePlacementLocation } from "../model"

export const maybeStartMoveCamera = (
    model: Model,
    { key }: KeyDown,
    currentTime: CurrentTime,
    panCamera: () => void,
    zoomCamera: () => void
): Model => {
    const pan = () => {
        const { left, down, up, right } = model.panCamera
        const notMoving = !(left || down || up || right)
        if (notMoving) {
            panCamera()
            return currentTime()
        } else {
            return model.panCamera.now
        }
    }
    const zoom = () => {
        const notMoving = !(model.zoomCamera.in || model.zoomCamera.out)
        if (notMoving) {
            zoomCamera()
            return currentTime()
        } else {
            return model.zoomCamera.now
        }
    }
    const nodePlacementLocation: NodePlacementLocation = {
        x: model.window.width / 2,
        y: model.window.height / 2,
        show: true,
    }
    switch (key) {
        case "h":
        case "ArrowLeft": {
            return {
                ...model,
                panCamera: { ...model.panCamera, left: true, now: pan() },
                nodePlacementLocation,
            }
        }
        case "j":
        case "ArrowDown": {
            return {
                ...model,
                zoomCamera: {
                    ...model.zoomCamera,
                    in: false,
                    out: false,
                },
                panCamera: { ...model.panCamera, down: true, now: zoom() },
                nodePlacementLocation,
            }
        }
        case "k":
        case "ArrowUp": {
            return {
                ...model,
                zoomCamera: {
                    ...model.zoomCamera,
                    in: false,
                    out: false,
                },
                panCamera: { ...model.panCamera, up: true, now: pan() },
                nodePlacementLocation,
            }
        }
        case "l":
        case "ArrowRight": {
            return {
                ...model,
                panCamera: { ...model.panCamera, right: true, now: pan() },
                nodePlacementLocation,
            }
        }
        case "<c-j>":
        case "<c-ArrowDown>": {
            return {
                ...model,
                zoomCamera: { ...model.zoomCamera, out: true, now: zoom() },
                panCamera: {
                    ...model.panCamera,
                    up: false,
                    down: false,
                },
                nodePlacementLocation,
            }
        }
        case "<c-k>":
        case "<c-ArrowUp>": {
            return {
                ...model,
                zoomCamera: { ...model.zoomCamera, in: true, now: zoom() },
                panCamera: {
                    ...model.panCamera,
                    up: false,
                    down: false,
                },
                nodePlacementLocation,
            }
        }
        default:
            return model
    }
}

export const maybeStopMoveCamera = (model: Model, { key }: KeyUp): Model => {
    switch (key) {
        case "h":
        case "ArrowLeft":
            return {
                ...model,
                panCamera: { ...model.panCamera, left: false },
            }
        case "j":
        case "ArrowDown":
            return {
                ...model,
                zoomCamera: {
                    ...model.zoomCamera,
                    in: false,
                    out: false,
                },
                panCamera: { ...model.panCamera, down: false },
            }
        case "k":
        case "ArrowUp":
            return {
                ...model,
                zoomCamera: {
                    ...model.zoomCamera,
                    in: false,
                    out: false,
                },
                panCamera: { ...model.panCamera, up: false },
            }
        case "l":
        case "ArrowRight":
            return {
                ...model,
                panCamera: { ...model.panCamera, right: false },
            }
        case "<c-j>":
        case "<c-ArrowDown>": {
            return {
                ...model,
                zoomCamera: { ...model.zoomCamera, out: false },
                panCamera: {
                    ...model.panCamera,
                    up: false,
                    down: false,
                },
            }
        }
        case "<c-k>":
        case "<c-ArrowUp>": {
            return {
                ...model,
                zoomCamera: { ...model.zoomCamera, in: false },
                panCamera: {
                    ...model.panCamera,
                    up: false,
                    down: false,
                },
            }
        }
        default:
            return model
    }
}

export const panCamera = (
    model: Model,
    currentTime: CurrentTime,
    panAfter: (ms: number) => void
): Model => {
    const { left, down, up, right } = model.panCamera
    const moving = left || down || up || right
    if (moving) {
        const x = (left ? -1 : 0) + (right ? 1 : 0)
        const y = (up ? -1 : 0) + (down ? 1 : 0)
        const length = Math.max(
            Math.sqrt(Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2)),
            1
        )
        const now = currentTime()
        const deltaTime = now - model.panCamera.now
        const speed = 0.5 * deltaTime
        panAfter(10)
        return {
            ...model,
            panCamera: { ...model.panCamera, now },
            camera: multiplyMatrices(
                model.camera,
                translate((x / length) * speed, (y / length) * speed)
            ),
        }
    } else {
        return model
    }
}

export const zoomCamera = (
    model: Model,
    currentTime: CurrentTime,
    zoomAfter: (ms: number) => void
): Model => {
    const moving = model.zoomCamera.in || model.zoomCamera.out
    if (moving) {
        const now = currentTime()
        const deltaTime = now - model.zoomCamera.now
        const direction =
            (model.zoomCamera.in ? -1 : 0) + (model.zoomCamera.out ? 1 : 0)
        const speed = deltaTime * direction
        const { x, y } = model.nodePlacementLocation
        const move = translate(x, y)
        const zoom = Math.pow(2, speed * 0.01)
        const moveBack = translate(-x, -y)
        const camera = multiplyMatrices(
            model.camera,
            move,
            scale(zoom, zoom),
            moveBack
        )
        zoomAfter(10)
        return {
            ...model,
            zoomCamera: { ...model.zoomCamera, now },
            camera,
        }
    } else {
        return model
    }
}
