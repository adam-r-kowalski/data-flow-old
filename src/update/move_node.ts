import { AppEvent, EventKind } from "../event"
import { inverse, multiplyMatrixVector } from "../linear_algebra/matrix3x3"
import { length } from "../linear_algebra/vector3"
import { Model, NodePlacementLocation } from "../model"
import { FocusKind, FocusNode } from "../model/focus"
import { CurrentTime, UpdateResult } from "../run"
import { changeNodePosition } from "./graph"

export const maybeStartMoveNode = (
    model: Model,
    focus: FocusNode,
    key: string,
    currentTime: CurrentTime
): UpdateResult => {
    interface Result {
        now: number
        dispatch?: AppEvent[]
    }
    const { left, down, up, right } = focus.move
    const notMoving = !(left || down || up || right)
    const { now, dispatch }: Result = notMoving
        ? {
              now: currentTime(),
              dispatch: [{ kind: EventKind.MOVE_NODE }],
          }
        : { now: focus.move.now }
    const nodePlacementLocation: NodePlacementLocation = {
        ...model.nodePlacementLocation,
        show: false,
    }
    switch (key) {
        case "h":
        case "ArrowLeft": {
            return {
                model: {
                    ...model,
                    focus: {
                        ...focus,
                        move: { ...focus.move, left: true, now },
                    },
                    nodePlacementLocation,
                },
                dispatch,
            }
        }
        case "j":
        case "ArrowDown": {
            return {
                model: {
                    ...model,
                    focus: {
                        ...focus,
                        move: { ...focus.move, down: true, now },
                    },
                    nodePlacementLocation,
                },
                dispatch,
            }
        }
        case "k":
        case "ArrowUp": {
            return {
                model: {
                    ...model,
                    focus: {
                        ...focus,
                        move: { ...focus.move, up: true, now },
                    },
                    nodePlacementLocation,
                },
                dispatch,
            }
        }
        case "l":
        case "ArrowRight": {
            return {
                model: {
                    ...model,
                    focus: {
                        ...focus,
                        move: { ...focus.move, right: true, now },
                    },
                    nodePlacementLocation,
                },
                dispatch,
            }
        }
        default:
            return { model }
    }
}

export const maybeStopMoveNode = (
    model: Model,
    focus: FocusNode,
    key: string
): UpdateResult => {
    switch (key) {
        case "h":
        case "ArrowLeft": {
            return {
                model: {
                    ...model,
                    focus: {
                        ...focus,
                        move: { ...focus.move, left: false },
                    },
                },
            }
        }
        case "j":
        case "ArrowDown": {
            return {
                model: {
                    ...model,
                    focus: {
                        ...focus,
                        move: { ...focus.move, down: false },
                    },
                },
            }
        }
        case "k":
        case "ArrowUp": {
            return {
                model: {
                    ...model,
                    focus: {
                        ...focus,
                        move: { ...focus.move, up: false },
                    },
                },
            }
        }
        case "l":
        case "ArrowRight": {
            return {
                model: {
                    ...model,
                    focus: {
                        ...focus,
                        move: { ...focus.move, right: false },
                    },
                },
            }
        }
        default:
            return { model }
    }
}

export const moveNode = (
    model: Model,
    currentTime: CurrentTime
): UpdateResult => {
    switch (model.focus.kind) {
        case FocusKind.NODE:
            const { left, down, up, right } = model.focus.move
            const moving = left || down || up || right
            if (moving) {
                const x = (left ? -1 : 0) + (right ? 1 : 0)
                const y = (up ? -1 : 0) + (down ? 1 : 0)
                const normalized_distance = Math.max(
                    Math.sqrt(
                        Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2)
                    ),
                    1
                )
                const now = currentTime()
                const deltaTime = now - model.focus.move.now
                const scale = length(
                    multiplyMatrixVector(inverse(model.camera), [0, 1, 0])
                )
                const speed = (0.5 * deltaTime) / scale
                const graph = changeNodePosition(
                    model.graph,
                    model.focus.node,
                    (p) => ({
                        x: p.x + (x / normalized_distance) * speed,
                        y: p.y + (y / normalized_distance) * speed,
                    })
                )
                return {
                    model: {
                        ...model,
                        focus: {
                            ...model.focus,
                            move: { ...model.focus.move, now },
                        },
                        graph,
                    },
                    render: true,
                    schedule: [
                        {
                            after: { milliseconds: 10 },
                            event: { kind: EventKind.MOVE_NODE },
                        },
                    ],
                }
            } else {
                return { model }
            }
        default:
            return { model }
    }
}
