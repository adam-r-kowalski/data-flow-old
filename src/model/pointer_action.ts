import { Position } from "./graph"

export enum PointerActionKind { PAN, ZOOM, NONE }

export interface PointerActionPan {
    readonly kind: PointerActionKind.PAN
}

export interface PointerActionZoom {
    readonly kind: PointerActionKind.ZOOM
    readonly pointerDistance: number
    readonly pointerCenter: Position
}

export interface PointerActionNone {
    readonly kind: PointerActionKind.NONE
}

export type PointerAction =
    | PointerActionPan
    | PointerActionZoom
    | PointerActionNone
