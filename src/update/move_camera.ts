import { AppEvent, EventKind, KeyDown, KeyUp } from ".";
import { multiplyMatrices, scale, translate } from "../linear_algebra/matrix3x3";
import { Model } from "../model";
import { CurrentTime, UpdateResult } from "../ui/run";

export const maybeStartMoveCamera = (model: Model, { key, ctrl }: KeyDown, currentTime: CurrentTime): UpdateResult<Model, AppEvent> => {
    interface Result {
        now: number
        dispatch?: AppEvent[]
    }
    const panDispatch = (): Result => {
        const { left, down, up, right } = model.panCamera
        const notMoving = !(left || down || up || right)
        return notMoving ?
            {
                now: currentTime(),
                dispatch: [{ kind: EventKind.PAN_CAMERA }]
            } :
            { now: model.panCamera.now }
    }
    const zoomDispatch = (): Result => {
        const notMoving = !(model.zoomCamera.in || model.zoomCamera.out)
        return notMoving ?
            {
                now: currentTime(),
                dispatch: [{ kind: EventKind.ZOOM_CAMERA }]
            } :
            { now: model.zoomCamera.now }
    }
    switch (key) {
        case 'h':
        case 'ArrowLeft': {
            const { now, dispatch } = panDispatch()
            return {
                model: {
                    ...model,
                    panCamera: { ...model.panCamera, left: true, now },
                },
                dispatch
            }
        }
        case 'j':
        case 'ArrowDown': {
            if (ctrl) {
                const { now, dispatch } = zoomDispatch()
                return {
                    model: {
                        ...model,
                        zoomCamera: { ...model.zoomCamera, out: true, now },
                        panCamera: { ...model.panCamera, up: false, down: false }
                    },
                    dispatch
                }
            } else {
                const { now, dispatch } = panDispatch()
                return {
                    model: {
                        ...model,
                        zoomCamera: { ...model.zoomCamera, in: false, out: false },
                        panCamera: { ...model.panCamera, down: true, now },
                    },
                    dispatch
                }
            }
        }
        case 'k':
        case 'ArrowUp': {
            if (ctrl) {
                const { now, dispatch } = zoomDispatch()
                return {
                    model: {
                        ...model,
                        zoomCamera: { ...model.zoomCamera, in: true, now },
                        panCamera: { ...model.panCamera, up: false, down: false }
                    },
                    dispatch
                }
            } else {
                const { now, dispatch } = panDispatch()
                return {
                    model: {
                        ...model,
                        zoomCamera: { ...model.zoomCamera, in: false, out: false },
                        panCamera: { ...model.panCamera, up: true, now }
                    },
                    dispatch
                }
            }
        }
        case 'l':
        case 'ArrowRight': {
            const { now, dispatch } = panDispatch()
            return {
                model: {
                    ...model,
                    panCamera: { ...model.panCamera, right: true, now }
                },
                dispatch
            }
        }
        default:
            return { model }
    }
}


export const maybeStopMoveCamera = (model: Model, { key, ctrl }: KeyUp): UpdateResult<Model, AppEvent> => {
    switch (key) {
        case 'h':
        case 'ArrowLeft':
            return {
                model: {
                    ...model,
                    panCamera: { ...model.panCamera, left: false, }
                },
            }
        case 'j':
        case 'ArrowDown':
            if (ctrl) {
                return {
                    model: {
                        ...model,
                        zoomCamera: { ...model.zoomCamera, out: false },
                        panCamera: { ...model.panCamera, up: false, down: false }
                    }
                }
            } else {
                return {
                    model: {
                        ...model,
                        zoomCamera: { ...model.zoomCamera, in: false, out: false },
                        panCamera: { ...model.panCamera, down: false }
                    },
                }
            }
        case 'k':
        case 'ArrowUp':
            if (ctrl) {
                return {
                    model: {
                        ...model,
                        zoomCamera: { ...model.zoomCamera, in: false },
                        panCamera: { ...model.panCamera, up: false, down: false },
                    }
                }
            } else {
                return {
                    model: {
                        ...model,
                        zoomCamera: { ...model.zoomCamera, in: false, out: false },
                        panCamera: { ...model.panCamera, up: false }
                    },
                }
            }
        case 'l':
        case 'ArrowRight':
            return {
                model: {
                    ...model,
                    panCamera: { ...model.panCamera, right: false }
                },
            }
        default:
            return { model }
    }
}

export const panCamera = (model: Model, currentTime: CurrentTime): UpdateResult<Model, AppEvent> => {
    const { left, down, up, right } = model.panCamera
    const moving = left || down || up || right
    if (moving) {
        const x = (left ? -1 : 0) + (right ? 1 : 0)
        const y = (up ? -1 : 0) + (down ? 1 : 0)
        const length = Math.max(Math.sqrt(Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2)), 1)
        const now = currentTime()
        const deltaTime = now - model.panCamera.now
        const speed = 0.5 * deltaTime
        return {
            model: {
                ...model,
                panCamera: { ...model.panCamera, now },
                camera: multiplyMatrices(model.camera, translate(x / length * speed, y / length * speed))
            },
            render: true,
            schedule: [{ after: { milliseconds: 10 }, event: { kind: EventKind.PAN_CAMERA } }]
        }
    } else {
        return { model }
    }
}

export const zoomCamera = (model: Model, currentTime: CurrentTime): UpdateResult<Model, AppEvent> => {
    const moving = model.zoomCamera.in || model.zoomCamera.out
    if (moving) {
        const now = currentTime()
        const deltaTime = now - model.zoomCamera.now
        const direction = (model.zoomCamera.in ? -1 : 0) + (model.zoomCamera.out ? 1 : 0)
        const speed = deltaTime * direction
        const { x, y } = model.nodePlacementLocation
        const move = translate(x, y)
        const zoom = Math.pow(2, speed * 0.01)
        const moveBack = translate(-x, -y)
        const camera = multiplyMatrices(model.camera, move, scale(zoom, zoom), moveBack)
        return {
            model: {
                ...model,
                zoomCamera: { ...model.zoomCamera, now },
                camera
            },
            render: true,
            schedule: [{ after: { milliseconds: 10 }, event: { kind: EventKind.ZOOM_CAMERA } }]
        }
    } else {
        return { model }
    }
}