import { UUID } from "./graph"
import { PointerAction } from "./pointer_action"

export enum FocusKind {
    NODE,
    INPUT,
    OUTPUT,
    BODY,
    FINDER,
    NONE
}

export interface FocusNode {
    readonly kind: FocusKind.NODE
    readonly node: UUID
    readonly drag: boolean
}

export interface FocusInput {
    readonly kind: FocusKind.INPUT
    readonly input: UUID
}

export interface FocusOutput {
    readonly kind: FocusKind.OUTPUT
    readonly output: UUID
}

export interface FocusBody {
    readonly kind: FocusKind.BODY
    readonly body: UUID
}

export interface FocusFinder {
    readonly kind: FocusKind.FINDER,
    readonly search: string
    readonly options: Readonly<string[]>
}

export interface FocusNone {
    readonly kind: FocusKind.NONE
    readonly pointerAction: PointerAction
}

export type Focus =
    | FocusNode
    | FocusInput
    | FocusOutput
    | FocusBody
    | FocusFinder
    | FocusNone
