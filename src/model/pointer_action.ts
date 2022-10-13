import { Position } from "./graph"

export enum PointerActionKind {
    PAN,
    ZOOM,
    NONE,
}

export interface PointerActionZoom {
    readonly kind: PointerActionKind.ZOOM
    readonly pointerDistance: number
    readonly pointerCenter: Position
}

export interface PointerActionNone {
    readonly kind: PointerActionKind.NONE
}

export type PointerAction = PointerActionZoom | PointerActionNone
