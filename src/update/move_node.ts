import { CurrentTime } from "../effects"
import { inverse, multiplyMatrixVector } from "../linear_algebra/matrix3x3"
import { length } from "../linear_algebra/vector3"
import { Model, NodePlacementLocation } from "../model"
import { FocusKind, FocusNode } from "../model/focus"
import { changeNodePosition } from "./graph"

export const maybeStartMoveNode = (
    model: Model,
    focus: FocusNode,
    key: string,
    currentTime: CurrentTime,
    moveNode: () => {}
): Model => {
    const { left, down, up, right } = focus.move
    const notMoving = !(left || down || up || right)
    const now = (() => {
        if (notMoving) {
            moveNode()
            return currentTime()
        } else {
            return focus.move.now
        }
    })()
    const nodePlacementLocation: NodePlacementLocation = {
        ...model.nodePlacementLocation,
        show: false,
    }
    switch (key) {
        case "h":
        case "ArrowLeft": {
            return {
                ...model,
                focus: {
                    ...focus,
                    move: { ...focus.move, left: true, now },
                },
                nodePlacementLocation,
            }
        }
        case "j":
        case "ArrowDown": {
            return {
                ...model,
                focus: {
                    ...focus,
                    move: { ...focus.move, down: true, now },
                },
                nodePlacementLocation,
            }
        }
        case "k":
        case "ArrowUp": {
            return {
                ...model,
                focus: {
                    ...focus,
                    move: { ...focus.move, up: true, now },
                },
                nodePlacementLocation,
            }
        }
        case "l":
        case "ArrowRight": {
            return {
                ...model,
                focus: {
                    ...focus,
                    move: { ...focus.move, right: true, now },
                },
                nodePlacementLocation,
            }
        }
        default:
            return model
    }
}

export const maybeStopMoveNode = (
    model: Model,
    focus: FocusNode,
    key: string
): Model => {
    switch (key) {
        case "h":
        case "ArrowLeft": {
            return {
                ...model,
                focus: {
                    ...focus,
                    move: { ...focus.move, left: false },
                },
            }
        }
        case "j":
        case "ArrowDown": {
            return {
                ...model,
                focus: {
                    ...focus,
                    move: { ...focus.move, down: false },
                },
            }
        }
        case "k":
        case "ArrowUp": {
            return {
                ...model,
                focus: {
                    ...focus,
                    move: { ...focus.move, up: false },
                },
            }
        }
        case "l":
        case "ArrowRight": {
            return {
                ...model,
                focus: {
                    ...focus,
                    move: { ...focus.move, right: false },
                },
            }
        }
        default:
            return model
    }
}

export const moveNode = (
    model: Model,
    currentTime: CurrentTime,
    moveNodeAfter: (ms: number) => {}
): Model => {
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
                moveNodeAfter(10)
                return {
                    ...model,
                    focus: {
                        ...model.focus,
                        move: { ...model.focus.move, now },
                    },
                    graph,
                }
            } else {
                return model
            }
        default:
            return model
    }
}
