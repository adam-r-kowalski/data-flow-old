import { UUID } from "./graph"
import { PointerAction } from "./pointer_action"
import { QuickSelect, QuickSelectNone } from "./quick_select"

export enum FocusKind {
    NODE,
    INPUT,
    OUTPUT,
    BODY,
    FINDER_INSERT,
    FINDER_CHANGE,
    NONE
}

export interface MoveNode {
    readonly left: boolean
    readonly down: boolean
    readonly up: boolean
    readonly right: boolean
    readonly now: number
}


export interface FocusNode {
    readonly kind: FocusKind.NODE
    readonly node: UUID
    readonly drag: boolean
    readonly move: MoveNode
    readonly quickSelect: QuickSelect
}

export interface FocusInput {
    readonly kind: FocusKind.INPUT
    readonly input: UUID
    readonly quickSelect: QuickSelect
}

export interface FocusOutput {
    readonly kind: FocusKind.OUTPUT
    readonly output: UUID
    readonly quickSelect: QuickSelect
}

export interface FocusBody {
    readonly kind: FocusKind.BODY
    readonly body: UUID
    readonly quickSelect: QuickSelect
}

export interface FocusFinderInsert {
    readonly kind: FocusKind.FINDER_INSERT,
    readonly search: string
    readonly options: Readonly<string[]>
    readonly quickSelect: QuickSelectNone
}

export interface FocusFinderChange {
    readonly kind: FocusKind.FINDER_CHANGE,
    readonly search: string
    readonly options: Readonly<string[]>
    readonly quickSelect: QuickSelectNone
    readonly node: UUID
}

export interface FocusNone {
    readonly kind: FocusKind.NONE
    readonly pointerAction: PointerAction
    readonly quickSelect: QuickSelect
}

export type Focus =
    | FocusNode
    | FocusInput
    | FocusOutput
    | FocusBody
    | FocusFinderInsert
    | FocusFinderChange
    | FocusNone
