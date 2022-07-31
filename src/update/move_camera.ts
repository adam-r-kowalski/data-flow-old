import { AppEvent, EventKind } from ".";
import { multiplyMatrices, translate } from "../linear_algebra/matrix3x3";
import { Model } from "../model";
import { CurrentTime, UpdateResult } from "../ui/run";

export const maybeStartMoveCamera = (model: Model, key: string, currentTime: CurrentTime): UpdateResult<Model, AppEvent> => {
    const { left, down, up, right } = model.moveCamera
    const notMoving = !(left || down || up || right)
    const dispatch: AppEvent[] = notMoving ? [{ kind: EventKind.MOVE_CAMERA }] : []
    const now = notMoving ? currentTime() : model.moveCamera.now
    switch (key) {
        case 'h':
        case 'ArrowLeft':
            return {
                model: {
                    ...model,
                    moveCamera: { ...model.moveCamera, left: true, now },
                },
                dispatch
            }
        case 'j':
        case 'ArrowDown':
            return {
                model: {
                    ...model,
                    moveCamera: { ...model.moveCamera, down: true, now },
                },
                dispatch
            }
        case 'k':
        case 'ArrowUp':
            return {
                model: {
                    ...model,
                    moveCamera: { ...model.moveCamera, up: true, now }
                },
                dispatch
            }
        case 'l':
        case 'ArrowRight':
            return {
                model: {
                    ...model,
                    moveCamera: { ...model.moveCamera, right: true, now }
                },
                dispatch
            }
        default:
            return { model }
    }
}


export const maybeStopMoveCamera = (model: Model, key: string): UpdateResult<Model, AppEvent> => {
    switch (key) {
        case 'h':
        case 'ArrowLeft':
            return {
                model: {
                    ...model,
                    moveCamera: { ...model.moveCamera, left: false, }
                },
            }
        case 'j':
        case 'ArrowDown':
            return {
                model: {
                    ...model,
                    moveCamera: { ...model.moveCamera, down: false }
                },
            }
        case 'k':
        case 'ArrowUp':
            return {
                model: {
                    ...model,
                    moveCamera: { ...model.moveCamera, up: false }
                },
            }
        case 'l':
        case 'ArrowRight':
            return {
                model: {
                    ...model,
                    moveCamera: { ...model.moveCamera, right: false }
                },
            }
        default:
            return { model }
    }
}

export const moveCamera = (model: Model, currentTime: CurrentTime): UpdateResult<Model, AppEvent> => {
    const { left, down, up, right } = model.moveCamera
    const moving = left || down || up || right
    if (moving) {
        const x = (left ? -1 : 0) + (right ? 1 : 0)
        const y = (up ? -1 : 0) + (down ? 1 : 0)
        const length = Math.max(Math.sqrt(Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2)), 1)
        const now = currentTime()
        const deltaTime = now - model.moveCamera.now
        const speed = 0.5 * deltaTime
        return {
            model: {
                ...model,
                moveCamera: { ...model.moveCamera, now },
                camera: multiplyMatrices(model.camera, translate(x / length * speed, y / length * speed))
            },
            render: true,
            schedule: [{ after: { milliseconds: 10 }, event: { kind: EventKind.MOVE_CAMERA } }]
        }
    } else {
        return { model }
    }
}